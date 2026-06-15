import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { formatDate } from "./Date"
import { ValidLocale } from "../i18n"

type ArticleDates = {
  created?: Date
  modified?: Date
}

const ArticleHeader: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = (fileData.frontmatter as { title?: string } | undefined)?.title
  if (!title) {
    return null
  }

  const dates = fileData.dates as ArticleDates | undefined
  const locale = (cfg.locale ?? "en-US") as ValidLocale
  const created = dates?.created
  const modified = dates?.modified

  return (
    <header class={classNames(displayClass, "article-header")}>
      <h1 class="article-header__title">{title}</h1>
      {(created || modified) && (
        <p class="article-header__meta">
          {created && (
            <>
              <span class="article-header__label">Created</span>{" "}
              <time datetime={created.toISOString()}>{formatDate(created, locale)}</time>
            </>
          )}
          {created && modified && <span class="article-header__sep"> · </span>}
          {modified && (
            <>
              <span class="article-header__label">Modified</span>{" "}
              <time datetime={modified.toISOString()}>{formatDate(modified, locale)}</time>
            </>
          )}
        </p>
      )}
    </header>
  )
}

ArticleHeader.css = `
.article-header {
  margin: 1.5rem 0 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--lightgray);
}

.article-header__title {
  margin: 0 0 0.5rem;
  font-family: var(--headerFont);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--dark);
}

.article-header__meta {
  margin: 0;
  font-family: var(--codeFont);
  font-size: 0.85rem;
  color: var(--gray);
}

.article-header__label {
  color: var(--tertiary);
}

.article-header__sep {
  opacity: 0.6;
}
`

export default (() => ArticleHeader) satisfies QuartzComponentConstructor
