"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneRendererIsometric_1 = require("./scene/isometric/SceneRendererIsometric");
var RenderMode;
(function (RenderMode) {
    RenderMode[RenderMode["ISOMETRIC"] = 0] = "ISOMETRIC";
})(RenderMode = exports.RenderMode || (exports.RenderMode = {}));
function CreateRenderer(config) {
    switch (config.mode) {
        case RenderMode.ISOMETRIC: return new SceneRendererIsometric_1.SceneRendererIsometric(config.pixi_app);
        default: return new SceneRendererIsometric_1.SceneRendererIsometric(config.pixi_app);
    }
}
exports.CreateRenderer = CreateRenderer;
