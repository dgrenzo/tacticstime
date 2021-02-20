"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitableUnit = exports.RecruitableButton = exports.Tavern = void 0;
var PIXI = require("pixi.js");
var _ = require("lodash");
var AssetManager_1 = require("../assets/AssetManager");
var GameBoard_1 = require("../board/GameBoard");
var UnitLoader_1 = require("../assets/UnitLoader");
var TIER_ONE = [
    "guard",
    "knight_green",
    "dwarf",
    "oldman",
    "basic_bow",
    "basic_axe",
];
function GetRandomRecruit() {
    var index = Math.floor(Math.random() * TIER_ONE.length) % TIER_ONE.length;
    return TIER_ONE[index];
}
var Tavern = (function () {
    function Tavern(m_parent_container, m_events) {
        var _this = this;
        this.m_events = m_events;
        this.m_container = new PIXI.Container();
        this.m_available_slots = 5;
        this.m_available_recruits = [];
        this.positionContainer = function (dimensions) {
            _this.m_container.position.set(dimensions.width / 2 - _this.m_container.width / 2, dimensions.height - 175);
        };
        this.setPlayer = function (player) {
            _this.m_player = player;
        };
        this.onRefreshClicked = function () {
            if (_this.m_player.chargeGold(1)) {
                _this.clearRecruits();
                _this.refreshRecruits();
            }
        };
        this.refreshRecruits = function () {
            for (var i = 0; i < _this.m_available_slots; i++) {
                var type = GetRandomRecruit();
                var btn = new RecruitableButton(type);
                _this.m_container.addChild(btn.sprite);
                btn.sprite.position.set(i * 24, 0);
                btn.on(_this.onButtonClicked);
                _this.m_available_recruits.push(btn);
            }
        };
        this.onButtonClicked = function (btn) {
            if (_this.m_player.chargeGold(3)) {
                btn.onPurchase();
                var unit_def = UnitLoader_1.UnitLoader.GetUnitDefinition(btn.type);
                _this.m_player.addUnit(GameBoard_1.CreateUnit(unit_def, "PLAYER"));
            }
        };
        this.render = function () {
            var finished_btn = new PIXI.Container();
            finished_btn.addChild(new PIXI.Graphics()
                .beginFill(0x666666)
                .lineStyle(1, 0x333333)
                .drawRect(0, 0, 24, 8));
            var label = new PIXI.Text("DONE", {
                fill: 0xFFFFFF,
                fontWeight: 'bold'
            });
            label.anchor.set(0.5, 0.5);
            label.scale.set(0.25);
            label.position.set(12, 4);
            finished_btn.addChild(label);
            finished_btn.position.set(46, 25);
            finished_btn.interactive = finished_btn.buttonMode = true;
            finished_btn.on('pointertap', function () {
                _this.m_events.emit("LEAVE_TAVERN");
            });
            _this.m_container.addChild(finished_btn);
        };
        this.clearRecruits = function () {
            _.forEach(_this.m_available_recruits, function (btn) {
                btn.destroy();
            });
            _this.m_available_recruits = [];
        };
        this.sellUnit = function (unit) {
        };
        this.buyUnit = function (unit) {
        };
        m_parent_container.addChild(this.m_container);
        this.m_container.scale.set(4);
        this.m_container.position.set(16, 16);
        this.render();
        this.m_events.on('RESIZE', this.positionContainer);
        this.m_events.once('LEAVE_TAVERN', function () {
            _this.m_events.off('RESIZE', _this.positionContainer);
            _this.clearRecruits();
            m_parent_container.removeChild(_this.m_container);
        });
        this.refreshRecruits();
    }
    Object.defineProperty(Tavern.prototype, "sprite", {
        get: function () {
            return this.m_container;
        },
        enumerable: false,
        configurable: true
    });
    return Tavern;
}());
exports.Tavern = Tavern;
var RecruitableButton = (function () {
    function RecruitableButton(type) {
        var _this = this;
        this.type = type;
        this.m_locked = false;
        this.destroy = function () {
            _this.m_animated_sprite.destroy();
            _this.m_container.removeChildren();
            _this.m_container.removeAllListeners();
        };
        this.locked = function () {
            return _this.m_locked;
        };
        this.onPurchase = function () {
            _this.lock();
            _this.m_container.addChild(new PIXI.Graphics()
                .beginFill(0xCCCCAA)
                .lineStyle(2, 0x333333, 1, 1)
                .drawRect(0, 0, 19, 19)
                .beginFill(0xAAAA99)
                .lineStyle(0)
                .drawRect(0, 13, 19, 6), new PIXI.Graphics()
                .beginFill(0x333388, 0.5)
                .drawRect(0, 0, 19, 19)
                .endFill());
        };
        this.lock = function () {
            _this.m_locked = true;
            _this.m_tint.alpha = 1;
            _this.m_container.off('pointermove', _this.hover);
            _this.m_container.buttonMode = false;
        };
        this.unlock = function () {
            _this.m_locked = false;
            _this.m_container.on('pointermove', _this.hover);
            _this.m_container.buttonMode = true;
        };
        this.on = function (callback) {
            _this.m_container.on('pointertap', function () {
                if (!_this.m_locked) {
                    callback(_this);
                }
            });
        };
        this.hover = function (evt) {
            if (_this.locked()) {
                return;
            }
            var local = _this.m_container.toLocal(evt.data.global);
            if (local.x >= 0 && local.y >= 0 && local.x <= 19 && local.y <= 19) {
                _this.m_tint.alpha = 0;
                _this.m_animated_sprite.play();
            }
            else {
                _this.m_tint.alpha = 1;
                _this.m_animated_sprite.stop();
            }
        };
        this.m_container = new PIXI.Container();
        this.m_container.interactive = true;
        var animation_data = AssetManager_1.default.getAnimatedSprite(this.type + "_idle");
        this.m_animated_sprite = new PIXI.AnimatedSprite(animation_data);
        this.m_animated_sprite.position.set(1, 0);
        var bg = new PIXI.Graphics()
            .beginFill(0xCCCFFF)
            .lineStyle(2, 0x333333, 1, 1)
            .drawRect(0, 0, 19, 19)
            .beginFill(0xAAAA99)
            .lineStyle(0)
            .drawRect(0, 13, 19, 6)
            .beginFill(0x999988)
            .drawRect(2, 14, 12, 3)
            .endFill();
        this.m_container.addChild(bg);
        this.m_container.addChild(this.m_animated_sprite);
        this.m_tint = new PIXI.Graphics()
            .beginFill(0x333355, 0.3)
            .drawRect(0, 0, 19, 19)
            .endFill();
        this.m_container.addChild(this.m_tint);
        this.unlock();
    }
    Object.defineProperty(RecruitableButton.prototype, "sprite", {
        get: function () {
            return this.m_container;
        },
        enumerable: false,
        configurable: true
    });
    return RecruitableButton;
}());
exports.RecruitableButton = RecruitableButton;
var RecruitableUnit = (function () {
    function RecruitableUnit(m_type) {
        this.m_type = m_type;
    }
    Object.defineProperty(RecruitableUnit.prototype, "type", {
        get: function () {
            return this.m_type;
        },
        enumerable: false,
        configurable: true
    });
    return RecruitableUnit;
}());
exports.RecruitableUnit = RecruitableUnit;
