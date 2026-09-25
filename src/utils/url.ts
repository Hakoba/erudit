/** Хост адреса; пусто — адреса нет или он не разбирается */
export function hostOf(url: string | undefined): string {
  if (!url) return ''

  try {
    return new URL(url).host
  } catch {
    return ''
  }
}
