/** Prefix for plain image URLs. Empty locally; the Webflow mount path in production. */
export function assetUrl(path: string) {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  const base =
    raw === "" || raw === "/"
      ? ""
      : raw.startsWith("/")
        ? raw.replace(/\/$/, "")
        : `/${raw.replace(/\/$/, "")}`;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
