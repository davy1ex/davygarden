import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { ActivityDateType, buildActivityData } from "./activityUtils"
// @ts-expect-error - inline script imported as string by esbuild loader
import script from "./scripts/activityHeatmap.inline.ts"

export interface ActivityHeatmapOptions {
  title?: string
  dateType?: ActivityDateType
  weeks?: number
}

const defaultOptions: ActivityHeatmapOptions = {
  title: "Activity",
  dateType: "modified",
  weeks: 52,
}

const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""]

export default ((userOpts?: Partial<ActivityHeatmapOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const ActivityHeatmap: QuartzComponent = ({ allFiles, cfg, displayClass, fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") {
      return null
    }

    const data = buildActivityData(allFiles, cfg, {
      dateType: opts.dateType,
      weeks: opts.weeks,
    })

    if (data.stats.totalNotes === 0) {
      return null
    }

    const dateTypeLabel = opts.dateType === "created" ? "published" : "updated"
    const summary =
      data.stats.activeDays === 0
        ? `${data.stats.totalNotes} ${data.stats.totalNotes === 1 ? "note" : "notes"} · no activity in the last ${opts.weeks} weeks`
        : `${data.stats.activeDays} active ${data.stats.activeDays === 1 ? "day" : "days"} · ${data.stats.updatesInRange} ${data.stats.updatesInRange === 1 ? "update" : "updates"} in ${opts.weeks} weeks`

    const gridStyle = {
      gridTemplateColumns: `var(--activity-label-width) repeat(${data.weekCount}, var(--activity-cell-size))`,
    }

    return (
      <section class={classNames(displayClass, "activity-heatmap")}>
        <div class="activity-heatmap__top">
          <div class="activity-heatmap__intro">
            <h3>{opts.title}</h3>
            <p class="activity-heatmap__summary">{summary}</p>
            <p class="activity-heatmap__meta">By last {dateTypeLabel} date</p>
          </div>
          <div class="activity-heatmap__legend" aria-hidden="true">
            <span>Less</span>
            <div class="activity-cell activity-cell--0" />
            <div class="activity-cell activity-cell--1" />
            <div class="activity-cell activity-cell--2" />
            <div class="activity-cell activity-cell--3" />
            <div class="activity-cell activity-cell--4" />
            <span>More</span>
          </div>
        </div>

        <div class="activity-heatmap__scroll">
          <div class="activity-heatmap__grid" style={gridStyle}>
            <div class="activity-heatmap__month-spacer" />

            {data.monthLabels.map(({ label, weekIndex }) => (
              <span
                class="activity-heatmap__month"
                style={{ gridColumn: weekIndex + 2, gridRow: 1 }}
              >
                {label}
              </span>
            ))}

            {dayLabels.map((label, dayIndex) => (
              <span class="activity-heatmap__day-label" style={{ gridColumn: 1, gridRow: dayIndex + 2 }}>
                {label}
              </span>
            ))}

            {data.weeks.map((week, weekIndex) =>
              week.map((cell, dayIndex) => (
                <div
                  class={`activity-cell activity-cell--${cell.level}`}
                  style={{ gridColumn: weekIndex + 2, gridRow: dayIndex + 2 }}
                  data-date={cell.dateKey}
                  data-count={cell.count}
                  title={cell.label}
                  role="img"
                  aria-label={cell.label}
                />
              )),
            )}
          </div>
        </div>
      </section>
    )
  }

  ActivityHeatmap.css = `
.activity-heatmap {
  --activity-cell-size: 10px;
  --activity-cell-gap: 3px;
  --activity-label-width: 1.65rem;
  margin: 0 0 1rem;
  padding: 0;
}

.activity-heatmap__top {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.activity-heatmap__intro h3 {
  margin: 0;
  font-family: var(--headerFont);
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark);
}

.activity-heatmap__summary {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  color: var(--darkgray);
  line-height: 1.4;
}

.activity-heatmap__meta {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: var(--gray);
}

.activity-heatmap__legend {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  font-size: 0.68rem;
  color: var(--gray);
  justify-content: flex-end;
}

.activity-heatmap__scroll {
  overflow-x: auto;
  padding-bottom: 0.25rem;
  -webkit-overflow-scrolling: touch;
}

.activity-heatmap__grid {
  display: grid;
  grid-template-rows: 1rem repeat(7, var(--activity-cell-size));
  gap: var(--activity-cell-gap);
  width: max-content;
  min-width: 100%;
}

.activity-heatmap__month-spacer {
  grid-column: 1;
  grid-row: 1;
}

.activity-heatmap__month {
  grid-row: 1;
  align-self: end;
  font-size: 0.68rem;
  line-height: 1;
  color: var(--gray);
  white-space: nowrap;
  pointer-events: none;
}

.activity-heatmap__day-label {
  font-size: 0.65rem;
  line-height: var(--activity-cell-size);
  color: var(--gray);
  text-align: right;
  padding-right: 0.35rem;
}

.activity-cell {
  width: var(--activity-cell-size);
  height: var(--activity-cell-size);
  border-radius: 2px;
  box-sizing: border-box;
}

.activity-cell--0 {
  background: color-mix(in srgb, var(--lightgray) 70%, var(--light));
  outline: 1px solid color-mix(in srgb, var(--gray) 22%, transparent);
  outline-offset: -1px;
}

.activity-cell--1 {
  background: color-mix(in srgb, #a3be8c 45%, var(--lightgray));
}

.activity-cell--2 {
  background: color-mix(in srgb, #a3be8c 65%, var(--lightgray));
}

.activity-cell--3 {
  background: color-mix(in srgb, #a3be8c 85%, var(--lightgray));
}

.activity-cell--4 {
  background: #a3be8c;
}

.activity-cell[data-count]:not([data-count="0"]):hover {
  outline: 1px solid var(--secondary);
  outline-offset: 1px;
  z-index: 1;
  position: relative;
}

.activity-cell--today {
  outline: 1px solid var(--secondary);
  outline-offset: 1px;
  z-index: 1;
  position: relative;
}

`

  ActivityHeatmap.afterDOMLoaded = script

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor
