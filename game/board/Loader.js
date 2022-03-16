"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var _ = require("lodash");
var UnitLoader_1 = require("../assets/UnitLoader");
function LoadMission(path) {
    var loaded_mission = {
        board: null,
        teams: [],
    };
    return LoadJSON(path)
        .then(function (data) {
        var promises = [];
        promises.push(LoadBoard(data.board).then(function (board_cfg) {
            loaded_mission.board = board_cfg;
        }));
        _.forEach(data.teams, function (team, team_index) {
            loaded_mission.teams.push({
                name: team.name,
                units: [],
            });
            _.forEach(team.units, function (unit, unit_index) {
                loaded_mission.teams[team_index].units[unit_index] = {
                    pos: unit.pos,
                    unit: UnitLoader_1.UnitLoader.GetUnitDefinition(unit.type),
                };
            });
        });
        return Promise.all(promises);
    }).then(function (data) {
        return loaded_mission;
    });
}
exports.LoadMission = LoadMission;
function LoadBoard(path) {
    return LoadJSON(path).then(ParseBoardData);
}
exports.LoadBoard = LoadBoard;
function LoadJSON(path) {
    path = path + "?t=" + Date.now();
    return new Promise(function (resolve) {
        new PIXI.Loader()
            .add(path)
            .load(function (loader, resources) {
            resolve(resources[path].data);
        });
    });
}
exports.LoadJSON = LoadJSON;
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
        }
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
        }
    };
}
exports.LoadFromURLParam = LoadFromURLParam;
