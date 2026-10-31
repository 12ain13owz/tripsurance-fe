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
import { useMediaQuery } from '@/shared/hooks'
import { cn } from '@/shared/utils'
import { Pagination } from './Pagination'
import type { DragEndEvent } from '@dnd-kit/core'
import type { ReactNode } from 'react'

// Tailwind's md breakpoint: table from here up, one card per row below (DESIGN.md §4)
const TABLE_MEDIA_QUERY = '(min-width: 48rem)'

export interface DataTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  /** Table-only width/extra classes for the header and cells, e.g. 'w-32' */
  className?: string
  align?: 'start' | 'end'
  /** Keep the header for screen readers only, e.g. an actions column */
  hideHeader?: boolean
  /** Place in the mobile card: 'title' (top), 'action' (top-right), 'field' (label/value), 'hidden' */
  card?: 'title' | 'action' | 'field' | 'hidden'
}

export interface DataTableReorder<T> {
  onReorder: (rows: T[]) => void
  /** Names a row in the drag handle's label, e.g. (row) => row.code */
  getRowLabel: (row: T) => string
  /** e.g. while the list is filtered (a reorder must send every row) or a save is in flight */
  disabled?: boolean
  /** Shown on the disabled handle, e.g. "Clear filters to reorder" */
  disabledHint?: string
}

export interface DataTablePagination {
  page: number
  pageSize: number
  /** Rows across all pages, after filtering */
  total: number
  onPageChange: (page: number) => void
}

interface DataTableProps<T extends { id: string }> {
  /** Rows to show — the current page when paginated, every row when reorderable */
  rows: T[]
  columns: DataTableColumn<T>[]
  emptyMessage: string
  /** Opt-in drag-and-drop; never combined with pagination (DESIGN.md §4) */
  reorder?: DataTableReorder<T>
  /** Opt-in pagination footer */
  pagination?: DataTablePagination
}

interface ReorderState {
  disabled: boolean
  disabledHint?: string
}

const ReorderStateContext = createContext<ReorderState>({ disabled: false })

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  emptyMessage,
  reorder,
  pagination,
}: DataTableProps<T>) {
  const isTable = useMediaQuery(TABLE_MEDIA_QUERY, true)

  const list =
    rows.length === 0 ? (
      <p className="text-muted py-6 text-center text-sm">{emptyMessage}</p>
    ) : isTable ? (
      <TableView rows={rows} columns={columns} reorder={reorder} />
    ) : (
      <CardView rows={rows} columns={columns} reorder={reorder} />
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-auto">
        {reorder ? (
          <ReorderProvider rows={rows} reorder={reorder}>
            {list}
          </ReorderProvider>
        ) : (
          list
        )}
      </div>
      {pagination && rows.length > 0 && <PaginationFooter rows={rows} pagination={pagination} />}
    </div>
  )
}

interface ViewProps<T extends { id: string }> {
  rows: T[]
  columns: DataTableColumn<T>[]
  reorder?: DataTableReorder<T>
}

function TableView<T extends { id: string }>({ rows, columns, reorder }: ViewProps<T>) {
  const cells = (row: T) =>
    columns.map((column) => (
      <td key={column.key} className={cn(column.className, column.align === 'end' && 'text-end')}>
        {column.cell(row)}
      </td>
    ))

  return (
    <table className="table-striped table table-fixed">
      <thead>
        <tr>
          {reorder && (
            <th className="w-12">
              <span className="sr-only">Reorder</span>
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(column.className, column.align === 'end' && 'text-end')}
            >
              {column.hideHeader ? <span className="sr-only">{column.header}</span> : column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) =>
          reorder ? (
            <SortableRow key={row.id} id={row.id} label={reorder.getRowLabel(row)}>
              {cells(row)}
            </SortableRow>
          ) : (
            <tr key={row.id}>{cells(row)}</tr>
          )
        )}
      </tbody>
    </table>
  )
}

function CardView<T extends { id: string }>({ rows, columns, reorder }: ViewProps<T>) {
  const titleColumns = columns.filter((column) => column.card === 'title')
  const actionColumns = columns.filter((column) => column.card === 'action')
  const fieldColumns = columns.filter((column) => (column.card ?? 'field') === 'field')

  const content = (row: T) => ({
    title: titleColumns.map((column) => <span key={column.key}>{column.cell(row)}</span>),
    actions: actionColumns.map((column) => <span key={column.key}>{column.cell(row)}</span>),
    fields: (
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        {fieldColumns.map((column) => (
          <div key={column.key} className="contents">
            <dt className="text-muted">{column.header}</dt>
            <dd className="text-end tabular-nums">{column.cell(row)}</dd>
          </div>
        ))}
      </dl>
    ),
  })

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) =>
        reorder ? (
          <SortableCard
            key={row.id}
            id={row.id}
            label={reorder.getRowLabel(row)}
            {...content(row)}
          />
        ) : (
          <li key={row.id} className="border-base-300 rounded-box bg-base-100 border p-4">
            <CardBody {...content(row)} />
          </li>
        )
      )}
    </ul>
  )
}

interface CardBodyProps {
  handle?: ReactNode
  title: ReactNode
  actions: ReactNode
  fields: ReactNode
}

function CardBody({ handle, title, actions, fields }: CardBodyProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {handle}
        <div className="text-base-content min-w-0 flex-1 truncate font-medium">{title}</div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {fields}
    </div>
  )
}

function PaginationFooter<T>({ rows, pagination }: { rows: T[]; pagination: DataTablePagination }) {
  const { page, pageSize, total, onPageChange } = pagination
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-muted text-sm tabular-nums">
        Showing {start + 1}–{start + rows.length} of {total}
      </p>
      <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
    </div>
  )
}

// --- Drag and drop -------------------------------------------------------------------------

function ReorderProvider<T extends { id: string }>({
  rows,
  reorder,
  children,
}: {
  rows: T[]
  reorder: DataTableReorder<T>
  children: ReactNode
}) {
  const id = useId()
  const disabled = reorder.disabled ?? false
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    // Press-and-hold on touch, so swiping over the handle still scrolls the list
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) {
      return
    }

    const from = rows.findIndex((row) => row.id === active.id)
    const to = rows.findIndex((row) => row.id === over.id)
    reorder.onReorder(arrayMove(rows, from, to))
  }

  // DndContext renders screen-reader <div>s next to its children, so it wraps the whole
  // <table>/<ul> — inside a <table> they would be invalid DOM
  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={rows} strategy={verticalListSortingStrategy} disabled={disabled}>
        <ReorderStateContext value={{ disabled, disabledHint: reorder.disabledHint }}>
          {children}
        </ReorderStateContext>
      </SortableContext>
    </DndContext>
  )
}

function useSortableItem(id: string) {
  const sortable = useSortable({ id })
  return {
    ...sortable,
    style: {
      transform: CSS.Translate.toString(sortable.transform),
      transition: sortable.transition,
    },
    draggingClass: sortable.isDragging && 'relative z-10 shadow-lg',
  }
}

function SortableRow({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, style, draggingClass } =
    useSortableItem(id)

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(draggingClass, draggingClass && 'bg-base-100')}
    >
      <td className="w-12">
        <DragHandle
          ref={setActivatorNodeRef}
          attributes={attributes}
          listeners={listeners}
          label={label}
        />
      </td>
      {children}
    </tr>
  )
}

function SortableCard({
  id,
  label,
  ...body
}: { id: string; label: string } & Omit<CardBodyProps, 'handle'>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, style, draggingClass } =
    useSortableItem(id)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn('border-base-300 rounded-box bg-base-100 border p-4', draggingClass)}
    >
      <CardBody
        {...body}
        handle={
          <DragHandle
            ref={setActivatorNodeRef}
            attributes={attributes}
            listeners={listeners}
            label={label}
          />
        }
      />
    </li>
  )
}

type SortableHandleProps = Pick<ReturnType<typeof useSortable>, 'attributes' | 'listeners'>

interface DragHandleProps extends SortableHandleProps {
  /** dnd-kit's setActivatorNodeRef, passed as React 19's `ref` prop — not through context,
   *  which trips react-hooks/refs */
  ref: (element: HTMLElement | null) => void
  label: string
}

// Only the handle starts a drag — the rest of the row stays selectable so its text can be copied
function DragHandle({ ref, attributes, listeners, label }: DragHandleProps) {
  const { disabled, disabledHint } = useContext(ReorderStateContext)

  // title sits on a wrapper: disabled buttons don't fire hover events in every browser
  return (
    <span className="inline-flex" title={disabled ? disabledHint : undefined}>
      <button
        ref={ref}
        type="button"
        className="btn btn-outline btn-primary btn-square btn-sm cursor-grab active:cursor-grabbing"
        disabled={disabled}
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${label}`}
      >
        <GripVertical className="size-4" />
      </button>
    </span>
  )
}
