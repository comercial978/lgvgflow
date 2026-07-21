type TitleCopy = {
  prefix: string
  highlight: string
  suffix: string
}

type Props = {
  label: string
  title: TitleCopy
  description?: string
  align?: 'left' | 'center'
  id?: string
}

export function SectionTitle({ label, title, description, align = 'center', id }: Props) {
  return (
    <header className={`section-title section-title-${align}`}>
      <p className="eyebrow">{label}</p>
      <h2 id={id}>
        {title.prefix}<em>{title.highlight}</em>{title.suffix}
      </h2>
      {description ? <p className="section-description">{description}</p> : null}
    </header>
  )
}
