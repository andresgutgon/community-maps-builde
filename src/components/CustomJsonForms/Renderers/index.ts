const CUSTOM_RENDERERS_PREFIX = 'coopdevs'
export function buildScope (renderer: string): string {
  return `${CUSTOM_RENDERERS_PREFIX}_${renderer}`
}
