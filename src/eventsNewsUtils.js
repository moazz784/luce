import {
  resolveContentImage,
  localImageSets,
  staticFallbackBundle,
} from "./homeStaticFallback";

export function formatNewsPublishedAt(iso) {
  if (iso == null || iso === "") return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatEventSchedule(iso) {
  return formatNewsPublishedAt(iso);
}

export function mapEventsFromApi(rawEvents) {
  const raw = rawEvents ?? [];
  return raw.map((e, i) => {
    const eventDateIso = e.eventDate ?? e.EventDate ?? null;
    const rawDate = e.date ?? e.Date;
    let dateParts =
      rawDate && typeof rawDate === "object"
        ? {
            day: String(rawDate.day ?? rawDate.Day ?? ""),
            month: String(rawDate.month ?? rawDate.Month ?? ""),
          }
        : { day: "", month: "" };
    if (!dateParts.day && !dateParts.month && eventDateIso) {
      const d = new Date(eventDateIso);
      if (!Number.isNaN(d.getTime())) {
        dateParts = {
          day: String(d.getDate()).padStart(2, "0"),
          month: d.toLocaleString("en", { month: "short" }),
        };
      }
    }
    const loc = String(e.location ?? e.Location ?? "").trim();
    const tr = String(e.timeRange ?? e.TimeRange ?? "").trim();
    return {
      id: e.id,
      image: resolveContentImage(e.imageUrl, localImageSets.events, i),
      date: dateParts,
      location: loc,
      time: tr,
      eventDate: eventDateIso,
      title: e.title,
      description: e.description ?? e.Description ?? "",
      color: e.accentColor ?? e.AccentColor ?? "#3b4b81",
    };
  });
}

export function mapNewsFromApi(rawNews) {
  const raw = rawNews ?? [];
  return raw.map((n, i) => ({
    id: n.id,
    title: n.title,
    body: n.body ?? n.Body ?? "",
    location: String(n.location ?? n.Location ?? "").trim(),
    image: resolveContentImage(n.imageUrl, localImageSets.news, i),
    publishedAt: n.publishedAt ?? n.PublishedAt ?? null,
  }));
}

export function getEventsListOrFallback(apiList) {
  const mapped = mapEventsFromApi(apiList);
  return mapped.length ? mapped : staticFallbackBundle.events;
}

export function getNewsListOrFallback(apiList) {
  const mapped = mapNewsFromApi(apiList);
  if (mapped.length) return mapped;
  return staticFallbackBundle.newsData.map((n) => ({
    ...n,
    body: n.body ?? "",
    location: n.location ?? "",
  }));
}
