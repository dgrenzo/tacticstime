import * as PIXI from 'pixi.js';

export type HIGHLIGHT_PLUGIN = "highlight_red" | "highlight_green" | "highlight_blue";
export type RENDER_PLUGIN = "batch" | HIGHLIGHT_PLUGIN;

const blue_frag = `
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    float blue = (color.r + color.g + color.b) / 3.0;
    gl_FragColor = vec4(color.r / 2.0, color.g / 2.0, blue, color.a);
}
`;

const red_frag = `
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    float red = (color.r + color.g + color.b) / 3.0;
    gl_FragColor = vec4(red, color.g / 2.0, color.b / 2.0, color.a);
}
`;

const green_frag = `
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    float green = (color.r + color.g + color.b) / 3.0;
    gl_FragColor = vec4(color.r / 2.0 , green, color.b / 2.0, color.a);
}
`;



export function InitRenderPlugins() {
  PIXI.Renderer.registerPlugin('highlight_blue', PIXI.BatchPluginFactory.create({ fragment : blue_frag }));
  
  PIXI.Renderer.registerPlugin('highlight_red', PIXI.BatchPluginFactory.create({ fragment : red_frag }));
  
  PIXI.Renderer.registerPlugin('highlight_green', PIXI.BatchPluginFactory.create({ fragment : green_frag }));
}