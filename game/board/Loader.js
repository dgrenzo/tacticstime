"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var _ = require("lodash");
function LoadBoard(path) {
    var board_json = path;
    return new Promise(function (resolve) {
        new PIXI.Loader()
            .add(board_json)
            .load(function (loader, resources) {
            var board_config = resources[board_json].data;
            var parsed_config = ParseBoardData(board_config);
            resolve(parsed_config);
        });
    });
}
exports.LoadBoard = LoadBoard;
function ParseBoardData(boardFile) {
    var data_split = (boardFile.data).match(/.{2}/g);
    var data_cfg = [];
    _.forEach(data_split, function (part) {
        data_cfg.push(parseInt(part));
    });
    return {
        layout: {
            width: data_cfg.shift(),
            height: data_cfg.shift(),
            tiles: data_cfg
        },
        entities: [],
    };
}
function LoadFromURLParam() {
    var url_data = location.search.split("board=")[1];
    var url_cfg = null;
    if (url_data && url_data.length > -1) {
        try {
            var strings = (url_data).match(/.{2}/g);
            url_cfg = [];
            _.forEach(strings, function (str) {
                url_cfg.push(parseInt(str));
            });
        }
        catch (e) {
            return null;
        }
    }
    return {
        layout: {
            width: url_cfg.shift(),
            height: url_cfg.shift(),
            tiles: url_cfg
        },
        entities: [],
    };
}
exports.LoadFromURLParam = LoadFromURLParam;
