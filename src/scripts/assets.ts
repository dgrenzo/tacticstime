import {FACTION, PIECE} from './types'

export interface AssetInfo {
  name : string,
}

export function factionToString(faction : FACTION) : string {
  switch (faction) {
    case FACTION.BLACK : return 'black';
    case FACTION.WHITE : return 'white';
  }
}

export function getAssetURL(asset) {
  return 'assets/images/isometric/' + asset;
}