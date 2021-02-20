"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitRenderPlugins = void 0;
var PIXI = require("pixi.js");
var blue_frag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    float blue = (color.r + color.g + color.b) / 3.0;\n    gl_FragColor = vec4(color.r / 2.0, color.g / 2.0, blue, color.a);\n}\n";
var red_frag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    float red = (color.r + color.g + color.b) / 3.0;\n    gl_FragColor = vec4(red, color.g / 2.0, color.b / 2.0, color.a);\n}\n";
var green_frag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    float green = (color.r + color.g + color.b) / 3.0;\n    gl_FragColor = vec4(color.r / 2.0 , green, color.b / 2.0, color.a);\n}\n";
function InitRenderPlugins() {
    PIXI.Renderer.registerPlugin('highlight_blue', PIXI.BatchPluginFactory.create({ fragment: blue_frag }));
    PIXI.Renderer.registerPlugin('highlight_red', PIXI.BatchPluginFactory.create({ fragment: red_frag }));
    PIXI.Renderer.registerPlugin('highlight_green', PIXI.BatchPluginFactory.create({ fragment: green_frag }));
}
exports.InitRenderPlugins = InitRenderPlugins;
