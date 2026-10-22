export function rotaAtiva(pathname, link) {
  return [link.path, ...(link.tambem ?? [])].some((base) => pathname === base || pathname.startsWith(`${base}/`))
}
