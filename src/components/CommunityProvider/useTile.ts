import { useMemo } from 'react'
import { TILES } from '@maps/types/index'
import type { MapAttribution, Config, Tile } from '@maps/types/index'

type ReturnType = {
  url: string
  minZoom: number
  maxZoom: number
  attribution: string
}
const useTile = (config: Config | null): ReturnType => {
  const style = config?.theme?.tileStyle
  return useMemo<ReturnType>((): ReturnType => {
      const { attributions, url, minZoom, maxZoom } = TILES[style] || TILES.osm
      const attribution = attributions.map((attribution: MapAttribution) => {
        if (!attribution.link) return attribution.linkText
        return `<a href=${attribution.link} target='_blank'>${attribution.linkText}</a>`
      }).join(' | ')

      return { url, minZoom, maxZoom, attribution }
    },
    [style]
  )
}

export default useTile
