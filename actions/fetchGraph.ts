"use server";

import { fetchYearContributions } from "./fetchYearContributions";
import { getCachedGraph, setCachedGraph } from "@/lib/cache";

function getFillColorLight(count: number): string {
  if (count === 0) return "#ebedf0";
  if (count <= 5) return "#9be9a8";
  if (count <= 10) return "#40c463";
  if (count <= 20) return "#30a14e";
  return "#216e39";
}

function dateToYyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const fetchGraph = async (username: string): Promise<{ graph: string }> => {
  try {
    const key = username.trim().toLowerCase();
    const cached = getCachedGraph(key);
    if (cached) return cached;

    const currentYear = new Date().getFullYear();
    const contributionDays = await fetchYearContributions(username, currentYear);

    const dayWidth = 14;
    const dayHeight = 14;
    const dayPadding = 2;
    const weekPadding = 3;
    const svgPadding = 4;

    const dateToCount = new Map<string, number>();
    for (const d of contributionDays) {
      const key = d.date.slice(0, 10);
      dateToCount.set(key, (dateToCount.get(key) ?? 0) + d.contributionCount);
    }

    const jan1 = new Date(currentYear, 0, 1);
    const firstSunday = new Date(jan1);
    firstSunday.setDate(jan1.getDate() - jan1.getDay());

    const numWeeks = 53;
    const dec31 = new Date(currentYear, 11, 31);

    const rects: string[] = [];
    for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const cellDate = new Date(firstSunday);
        cellDate.setDate(firstSunday.getDate() + weekIndex * 7 + dayIndex);
        const dateStr = dateToYyyyMmDd(cellDate);
        const count = cellDate >= jan1 && cellDate <= dec31 ? dateToCount.get(dateStr) ?? 0 : 0;

        const x = svgPadding + weekIndex * (dayWidth + weekPadding);
        const y = svgPadding + dayIndex * (dayHeight + dayPadding);
        const fillColor = getFillColorLight(count);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const label = cellDate >= jan1 && cellDate <= dec31
          ? `${monthNames[cellDate.getMonth()]} ${cellDate.getDate()} – ${count} contribution${count !== 1 ? "s" : ""}`
          : "";
        rects.push(
          `<rect x="${x}" y="${y}" width="${dayWidth}" height="${dayHeight}" fill="${fillColor}" stroke-width="0.5" stroke="#d1d5db" rx="2" ry="2">${label ? `<title>${label}</title>` : ""}</rect>`
        );
      }
    }

    const svgHeight = 7 * (dayHeight + dayPadding) + 2 * svgPadding;
    const svgWidth = numWeeks * (dayWidth + weekPadding) + 2 * svgPadding;

    const graph = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}">${rects.join("")}</svg>`;

    const result = { graph };
    setCachedGraph(key, result);
    return result;
  } catch (error) {
    console.error("Error generating contribution graph:", error);
    return { graph: "Error" };
  }
};

export default fetchGraph;
