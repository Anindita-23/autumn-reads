// Minimal fetch-based client stub to avoid requiring `axios` at module-load.
// It returns objects of shape { data } to match the legacy components' usage.
const client = async <T = any>(path: string, options?: RequestInit) => {
  const base = "/api";
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;

  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();
    return { data } as { data: T };
  }

  const text = await res.text();
  return { data: text as unknown as T };
};

export default client;
