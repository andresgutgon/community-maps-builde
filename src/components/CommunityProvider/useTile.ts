import { TILES } from '@maps/types/index'
import type { Config, Tile } from '@maps/types/index'

const useTile = (config: Config | null): Tile | null => {
  return TILES[config?.theme?.tileStyle] || TILES.osm
}

export default useTile
