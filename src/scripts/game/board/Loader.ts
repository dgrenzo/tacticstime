import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { IBoardConfig } from './GameBoard';

interface IBoardFile {
  version : string,
  data : string,
}

export function LoadBoard(path : string) : Promise<IBoardConfig> {
  let board_json : string = path;

  return new Promise((resolve) => {
    new PIXI.Loader()
    .add(board_json)
    .load((loader : PIXI.Loader, resources : PIXI.IResourceDictionary) => {
      let board_config : IBoardFile = resources[board_json].data;
      let parsed_config : IBoardConfig = ParseBoardData(board_config);

      resolve(parsed_config);
    })
  });
}

function ParseBoardData(boardFile : IBoardFile) : IBoardConfig {
  let data_split = (boardFile.data).match(/.{2}/g);
  let data_cfg : Array<number> = [];
  _.forEach(data_split, part => {
    data_cfg.push(parseInt(part));
  });

  return {
    layout : {
      width : data_cfg.shift(),
      height : data_cfg.shift(),
      tiles : data_cfg
    },
    entities : [],
  }
}

export function LoadFromURLParam() : IBoardConfig {
  let url_data = location.search.split("board=")[1];
  let url_cfg : number[] = null;
  if (url_data && url_data.length > -1) {
    try {
      let strings = (url_data).match(/.{2}/g);
      url_cfg = [];
      _.forEach(strings, str => {
        url_cfg.push(parseInt(str));
      })
    } catch (e) {
      return null;
    }
  }
  return {
    layout : {
      width : url_cfg.shift(),
      height : url_cfg.shift(),
      tiles : url_cfg
    },
    entities : [],
  }
}