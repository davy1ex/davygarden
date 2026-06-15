import { GlobalConfiguration } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"
import { ValidLocale } from "../i18n"
import { ValidDateType } from "./Date"

export type ActivityDateType = "modified" | "created"

export type HeatmapCell = {
  date: Date
  dateKey: string
  count: number
  level: number
  label: string
}

export type HeatmapWeek = HeatmapCell[]

export type ActivityStats = {
  totalNotes: number
  activeDays: number
  notesThisYear: number
  longestStreak: number
  maxPerDay: number
  updatesInRange: number
}

export type ActivityData = {
  weeks: HeatmapWeek[]
  stats: ActivityStats
  monthLabels: { label: string; weekIndex: number }[]
  weekCount: number
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function isNotePage(slug: string | undefined): boolean {
  if (!slug) return false
  if (slug === "index" || slug.endsWith("/index")) return false
  if (slug === "tags" || slug.startsWith("tags/")) return false
  return true
}

function resolveDateType(
  data: QuartzPluginData,
  cfg: GlobalConfiguration,
  preferred: ActivityDateType,
): ValidDateType {
  return (
    preferred ??
    (data.defaultDateType as ValidDateType | undefined) ??
    ((cfg as Record<string, unknown>).defaultDateType as ValidDateType | undefined) ??
    "modified"
  )
}

export function getActivityDate(
  data: QuartzPluginData,
  cfg: GlobalConfiguration,
  dateType: ActivityDateType,
): Date | undefined {
  const type = resolveDateType(data, cfg, dateType)
  const dates = data.dates as Record<ValidDateType, Date> | undefined
  if (!dates) return undefined
  return dates[type] ?? dates.modified ?? dates.created
}

function intensityLevel(count: number, maxCount: number): number {
  if (count === 0) return 0
  if (maxCount <= 1) return 4
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

function longestStreak(activeDayKeys: string[]): number {
  if (activeDayKeys.length === 0) return 0
  const sorted = [...new Set(activeDayKeys)].sort()
  let max = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]!)
    const curr = new Date(sorted[i]!)
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000)
    if (diffDays === 1) {
      current++
      max = Math.max(max, current)
    } else if (diffDays > 1) {
      current = 1
    }
  }

  return max
}

function formatDayLabel(date: Date, count: number, locale: ValidLocale): string {
  const formatted = date.toLocaleDateString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  if (count === 0) {
    return `No activity on ${formatted}`
  }
  const noun = count === 1 ? "update" : "updates"
  return `${count} ${noun} on ${formatted}`
}

function buildMonthLabels(weeks: HeatmapWeek[], locale: ValidLocale): { label: string; weekIndex: number }[] {
  const labels: { label: string; weekIndex: number }[] = []
  let lastMonth = -1

  weeks.forEach((week, weekIndex) => {
    for (const cell of week) {
      const month = cell.date.getMonth()
      if (month === lastMonth) continue
      lastMonth = month
      labels.push({
        label: cell.date.toLocaleDateString(locale, { month: "short" }),
        weekIndex,
      })
      break
    }
  })

  return labels
}

export function buildActivityData(
  allFiles: QuartzPluginData[],
  cfg: GlobalConfiguration,
  options: { dateType?: ActivityDateType; weeks?: number; endDate?: Date } = {},
): ActivityData {
  const dateType = options.dateType ?? "modified"
  const numWeeks = options.weeks ?? 52
  const end = new Date(options.endDate ?? new Date())
  end.setHours(0, 0, 0, 0)

  const locale = (cfg.locale ?? "en-US") as ValidLocale
  const counts = new Map<string, number>()
  let totalNotes = 0
  let notesThisYear = 0
  const currentYear = end.getFullYear()

  for (const file of allFiles) {
    if ((file as { unlisted?: boolean }).unlisted === true) continue
    if (!isNotePage(file.slug as string | undefined)) continue

    const activityDate = getActivityDate(file, cfg, dateType)
    if (!activityDate) continue

    totalNotes++
    const dateKey = toDateKey(activityDate)
    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1)

    if (activityDate.getFullYear() === currentYear) {
      notesThisYear++
    }
  }

  const start = new Date(end)
  start.setDate(start.getDate() - (numWeeks * 7 - 1))
  start.setDate(start.getDate() - start.getDay())

  let maxPerDay = 0
  for (const count of counts.values()) {
    maxPerDay = Math.max(maxPerDay, count)
  }

  const weeks: HeatmapWeek[] = []
  const activeDayKeys: string[] = []
  let updatesInRange = 0
  let current = new Date(start)
  let week: HeatmapWeek = []

  while (current <= end) {
    const dateKey = toDateKey(current)
    const count = counts.get(dateKey) ?? 0
    if (count > 0) {
      activeDayKeys.push(dateKey)
      updatesInRange += count
    }

    week.push({
      date: new Date(current),
      dateKey,
      count,
      level: intensityLevel(count, maxPerDay),
      label: formatDayLabel(current, count, locale),
    })

    if (current.getDay() === 6) {
      weeks.push(week)
      week = []
    }

    current.setDate(current.getDate() + 1)
  }

  if (week.length > 0) {
    weeks.push(week)
  }

  const rangeActiveDays = weeks
    .flat()
    .filter((cell) => cell.count > 0 && cell.date <= end)
    .map((cell) => cell.dateKey)

  return {
    weeks,
    weekCount: weeks.length,
    stats: {
      totalNotes,
      activeDays: new Set(rangeActiveDays).size,
      notesThisYear,
      longestStreak: longestStreak(activeDayKeys),
      maxPerDay,
      updatesInRange,
    },
    monthLabels: buildMonthLabels(weeks, locale),
  }
}
