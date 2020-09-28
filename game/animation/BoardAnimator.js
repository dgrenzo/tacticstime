"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneRenderer_1 = require("../../engine/render/scene/SceneRenderer");
var effects_1 = require("../effects");
var BoardAnimator = (function () {
    function BoardAnimator(m_renderer, m_board_controller) {
        var _this = this;
        this.m_renderer = m_renderer;
        this.m_board_controller = m_board_controller;
        this.m_render_elements = new Map();
        this.setRenderElement = function (id, renderable) {
            _this.m_render_elements.set(id, renderable);
        };
        this.getRenderElement = function (entity_id) {
            return _this.m_render_elements.get(entity_id);
        };
        this.createEffect = function (ability, cb) {
            return effects_1.default.RenderEffect(ability, cb);
        };
        this.m_board_controller.on("CREATE_UNIT", function (data) {
            var renderable = _this.m_renderer.addEntity(data.unit);
            renderable.renderAsset(SceneRenderer_1.getAsset(data.unit));
            _this.setRenderElement(data.unit.id, renderable);
        });
        this.m_board_controller.on("UNIT_KILLED", function (data) {
            var renderable = _this.m_render_elements.get(data.entity_id);
            _this.m_renderer.removeEntity(renderable.id);
        });
        this.m_board_controller.on("MOVE", function (data) {
            _this.m_renderer.positionElement(_this.getRenderElement(data.entity_id), data.move.to);
        });
    }
    BoardAnimator.prototype.animateGameAction = function (action, board) {
        var _this = this;
        if (action.type === 'ABILITY') {
            return this.animateAbility(action.data, board);
        }
        return new Promise(function (resolve) {
            var effect = _this.createEffect(action, resolve);
            if (effect) {
                var action_target = board.getElement(action.data.entity_id);
                effect.setPosition(action_target.pos);
            }
            else {
                setTimeout(resolve, 100);
            }
            setTimeout(resolve, 100);
        });
    };
    BoardAnimator.prototype.animateAbility = function (data, board) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!board.getUnitAtPosition(data.target.pos)) {
                return resolve();
            }
            var renderable = _this.getRenderElement(data.source.id);
            var sprite = renderable.sprite;
            var dir = {
                x: data.target.pos.x - data.source.pos.x,
                y: data.target.pos.y - data.source.pos.y,
            };
            var anim_dir = _this.m_renderer.getProjection(dir);
            anim_dir.x = Math.min(Math.max(-1, anim_dir.x), 1);
            anim_dir.y = Math.min(Math.max(-1, anim_dir.y), 1);
            sprite.position.x = -anim_dir.x;
            sprite.position.y = -anim_dir.y;
            setTimeout(function () {
                sprite.position.x = anim_dir.x * 3;
                sprite.position.y = anim_dir.y * 3;
                setTimeout(function () {
                    sprite.position.set(0, 0);
                }, 150);
                resolve();
            }, 250);
        });
    };
    return BoardAnimator;
}());
exports.BoardAnimator = BoardAnimator;
