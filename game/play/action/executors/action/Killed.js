"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene_1 = require("../../../../../engine/scene/Scene");
function ExecuteKilled(action, scene) {
    scene = Scene_1.Scene.RemoveElementById(scene, action.data.entity_id);
    return scene;
}
exports.ExecuteKilled = ExecuteKilled;
