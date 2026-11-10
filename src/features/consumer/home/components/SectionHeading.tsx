interface SectionHeadingProps {
  title: string
  subtitle?: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
      {subtitle && <p className="text-subtle max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  )
}
