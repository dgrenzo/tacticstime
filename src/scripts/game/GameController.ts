import * as _ from 'lodash';

import * as PIXI from 'pixi.js';
import { ChessBoard, ITilePos, IBoardConfig } from "./board/GameBoard";
import { RenderMode, CreateRenderer } from '../engine/render/render';
import { FSM } from '../engine/FSM';
import { SceneRenderer } from '../engine/render/scene/SceneRenderer';
import { EventManager } from '../engine/listener/event';
import TileHighlighter from './extras/TileHighlighter';
import { Tile, TILE_DEF } from './board/Tile';
import AssetManager from './assets';
import { TilePalette } from './interface/tile_palette';

export type GameConfig = {
  pixi_app : PIXI.Application,
  mode : RenderMode.ISOMETRIC,
}

export enum GameState {
  SETUP = 0,
  PLAY,
}

export type ClickedData = {
  id:number
};
export type TileData = {
  x : number,
  y : number
};

export type GameSignal = "PIECE_CLICKED" | "TILE_CLICKED";


export class GameController {

  private m_fsm : FSM;
  private m_board : ChessBoard;
  private m_renderer : SceneRenderer;
  private m_eventManager = new EventManager<GameSignal>();

  constructor(private m_config : GameConfig) {
    this.m_fsm = new FSM();
    m_config.pixi_app.ticker.add(this.m_fsm.update);
    
    this.m_board = new ChessBoard();
    this.m_renderer = CreateRenderer(this.m_config);


    this.loadBoard();
  }

  private loadBoard = () => {

    let default_path : string = 'assets/data/boards/default.json';
    let board_json : string = default_path;

    new PIXI.Loader()
      .add(board_json)
      .load((loader : PIXI.Loader, resources : PIXI.IResourceDictionary) => {

        let url_data = location.search.split("board=")[1];
        let url_cfg : number[] = null;
        if (url_data && url_data.length > -1) {
          try {
            url_cfg = JSON.parse(url_data);
          } catch (e) {
          }
        }

        let board_config : number[] = url_cfg ? url_cfg : resources[board_json].data;

        let parsed_def : IBoardConfig = {
          layout : {
            width : board_config.shift(),
            height : board_config.shift(),
            tiles : board_config
          },
          entities : [],
        }

        this.m_board.init(parsed_def);
        this.m_renderer.initializeScene(this.m_board);
        this.onSetupComplete();
      });
  }

  private onSetupComplete = () => {
    this.m_config.pixi_app.stage.addChild(this.m_renderer.stage);

    let highligher = new TileHighlighter(this.m_renderer, this.m_board);
    this.m_config.pixi_app.ticker.add(highligher.update);

    this.m_config.pixi_app.ticker.add(() => {
      this.m_renderer.renderScene(this.m_board);
    });


    this.m_renderer.on("POINTER_DOWN", this.tileClicked);

    
    let p = new TilePalette();

    let brush : TILE_DEF = TILE_DEF.GRASS_EMPTY;
    let painting : boolean = false;

    p.on("TILE_SELECTED", data => {
      brush = data.def;
    })
    
    let paintTile = (pos : ITilePos, type : TILE_DEF) => {
      let tile = this.m_board.getTileAt(pos);
      if (!tile) { return; }
      if (tile.type !== type) {
        tile.setTileType(type);
        this.m_renderer.getRenderable(tile.id).setSprite(AssetManager.getTile(tile.getAssetInfo().name));

        let cfg = this.m_board.getConfig();
        let str = JSON.stringify(cfg);
        let url =  location.origin + location.pathname ;
        history.replaceState({}, "board", url + "?board=" + str);
      }
    }

    this.m_renderer.on("POINTER_DOWN", (data) => {
      painting = true;
      paintTile(data, brush);
    })
    this.m_renderer.on("POINTER_MOVE", (data) => {
      if (painting) {
        paintTile(data, brush);
      }
    })
    this.m_renderer.on("POINTER_UP", (data) => {
      painting = false;
    })


    this.m_config.pixi_app.stage.addChild(p.container);

  }

  public getTileAt = (pos : { x : number, y : number }) : Tile => {
    return this.m_board.getTileAt(pos);
  }
  
  public highlightTile = (pos: ITilePos, highlight : boolean) => {
    let tile = this.getTileAt(pos);
    if (!tile) {
      return;
    }
    this.m_renderer.getRenderable(tile.id).setFilter({highlight : highlight});
  }

  public highlightTiles = (coords:ITilePos[], highlight : boolean) => {
    _.forEach(coords, pos => {
      this.highlightTile(pos, highlight);
    });
  }

  public on = (event_name : GameSignal, cb : (data:any) => void) => {
    this.m_eventManager.add(event_name, cb);
  }
  public off = (event_name : GameSignal, cb : (data:any) => void) => {
    this.m_eventManager.remove(event_name, cb);
  }

  private tileClicked = (data : TileData) => {
    this.m_eventManager.emit("TILE_CLICKED", data);
  }
}