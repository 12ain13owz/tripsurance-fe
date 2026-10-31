'use client'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { createContext, useContext, useId } from 'react'
import { cn } from '@/shared/utils'
import type { DragEndEvent } from '@dnd-kit/core'
import type { ReactNode } from 'react'

const SortableDisabledContext = createContext(false)

interface SortableTableProps<T extends { id: string }> {
  items: T[]
  /** e.g. while the list is filtered (reorder must send every row) or a reorder is in flight */
  disabled?: boolean
  onReorder: (items: T[]) => void
  /** The whole <table>; rows inside <tbody> are <SortableRow> in the same order as `items` */
  children: ReactNode
}

// Wraps the <table>, not the <tbody>: DndContext renders screen-reader <div>s next to its
// children, which would be invalid DOM inside a table
export function SortableTable<T extends { id: string }>({
  items,
  disabled = false,
  onReorder,
  children,
}: SortableTableProps<T>) {
  const id = useId()
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    // Press-and-hold on touch, so swiping over the handle still scrolls the table
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) {
      return
    }

    const from = items.findIndex((item) => item.id === active.id)
    const to = items.findIndex((item) => item.id === over.id)
    onReorder(arrayMove(items, from, to))
  }

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy} disabled={disabled}>
        <SortableDisabledContext value={disabled}>{children}</SortableDisabledContext>
      </SortableContext>
    </DndContext>
  )
}

interface SortableRowProps {
  id: string
  /** Accessible name of the drag handle, e.g. "Reorder baggage-plus" */
  handleLabel: string
  /** Shown on hover while dragging is disabled, e.g. "Clear filters to reorder" */
  disabledHint?: string
  className?: string
  /** The row's other cells; the drag handle is always rendered as the first cell */
  children: ReactNode
}

// Only the handle starts a drag — the rest of the row stays selectable so its text can be copied.
// The handle lives here, not in its own component: passing dnd-kit's callback ref through context
// trips react-hooks/refs
export function SortableRow({
  id,
  handleLabel,
  disabledHint,
  className,
  children,
}: SortableRowProps) {
  const disabled = useContext(SortableDisabledContext)
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(isDragging && 'bg-base-100 relative z-10 shadow-lg', className)}
    >
      <td className="w-12">
        {/* title sits on a wrapper: disabled buttons don't fire hover events in every browser */}
        <span className="inline-flex" title={disabled ? disabledHint : undefined}>
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="btn btn-ghost btn-square btn-sm cursor-grab active:cursor-grabbing"
            disabled={disabled}
            {...attributes}
            {...listeners}
            aria-label={handleLabel}
          >
            <GripVertical className="size-4" />
          </button>
        </span>
      </td>
      {children}
    </tr>
  )
}
