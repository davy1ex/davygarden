function todayKey() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

function scrollHeatmapToToday(container: HTMLElement) {
  const key = todayKey()
  const today = container.querySelector(`[data-date="${key}"]`) as HTMLElement | null

  if (today) {
    today.classList.add("activity-cell--today")
  }

  const maxScroll = container.scrollWidth - container.clientWidth
  if (maxScroll <= 0) return

  if (!today) {
    container.scrollLeft = maxScroll
    return
  }

  const containerRect = container.getBoundingClientRect()
  const cellRect = today.getBoundingClientRect()
  const padding = 6
  const delta = cellRect.right - containerRect.right + padding
  container.scrollLeft = Math.max(0, Math.min(maxScroll, container.scrollLeft + delta))
}

function setupActivityHeatmaps() {
  for (const container of document.querySelectorAll(".activity-heatmap__scroll")) {
    requestAnimationFrame(() => {
      scrollHeatmapToToday(container as HTMLElement)
    })
  }
}

function handleNavOrRender() {
  setupActivityHeatmaps()
}

document.addEventListener("nav", handleNavOrRender)
document.addEventListener("render", handleNavOrRender)
handleNavOrRender()
