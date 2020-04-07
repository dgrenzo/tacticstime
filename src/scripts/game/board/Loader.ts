import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { IBoardConfig } from './GameBoard';

interface IBoardFile {
  version : string,
  data : string,
}

interface IUnitData {
  type : string,
  pos : {
    x : number,
    y : number,
  }
}

interface ITeamData {
  name : string,
  units : IUnitData[],
}
interface IMissionData {
  board : string,
  teams : ITeamData[],
}

export interface ILoadedUnit {
  display : {
    sprite : string,
  },
  abilities : string[],
  stats : {
    speed : number,
    move : number,
    hp : number,
    magic : number,
  },
}

export interface IMissionUnit {
  unit : ILoadedUnit,
  pos : {
    x : number,
    y : number,
  }
}

export interface ILoadedTeam {
  name : string,
  units : IMissionUnit[]
}

export interface ILoadedMission {
  board : IBoardConfig,
  teams : ILoadedTeam[],
}

export function LoadMission(path : string) : Promise<ILoadedMission> {
  let loaded_mission : ILoadedMission = {
    board : null,
    teams : [],
  };
  return LoadJSON<IMissionData>(path)
  .then( data => {
    let promises : Promise<any>[] = [];

    promises.push(LoadBoard(data.board).then(board_cfg => {
      loaded_mission.board = board_cfg
    }));

    _.forEach(data.teams, (team, team_index) => {
      loaded_mission.teams.push({
        name : team.name,
        units : [],
      });
      _.forEach(team.units, (unit, unit_index) => {
        promises.push(LoadJSON<ILoadedUnit>(unit.type).then (unit_data => {
          loaded_mission.teams[team_index].units[unit_index] = {
            pos : unit.pos,
            unit : unit_data,
          }
        }))
      });
    });
    return Promise.all(promises);
  }).then(data => {
    return loaded_mission;
  });
}

export function LoadBoard(path : string) : Promise<IBoardConfig> {
  return LoadJSON<IBoardFile>(path).then(ParseBoardData)
}

export function LoadJSON<JSONType>(path : string) : Promise<JSONType> {
  path = path + "?t=" + Date.now();
  return new Promise<JSONType>((resolve) => {
    new PIXI.Loader()
    .add(path)
    .load( (loader : PIXI.Loader, resources : PIXI.IResourceDictionary) => {
      resolve(resources[path].data as JSONType);
    })
  })
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
    }
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
    }
  }
}