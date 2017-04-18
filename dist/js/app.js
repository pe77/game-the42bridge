var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    var game = new GameBase.Game();
};
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkEvent = (function () {
        function PkEvent(name, target) {
            this.id = ++PkEvent.id;
            this.listeners = [];
            this.target = target;
            this.name = name;
        }
        PkEvent.prototype.add = function (key, callBack, context) {
            var context = context || {};
            var exist = false;
            // verifica se já não foi add
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].callBack.toString() === callBack.toString()) {
                    exist = true;
                    break;
                }
            }
            ;
            if (!exist)
                this.listeners.push({ key: key, callBack: callBack, context: context });
            //
        };
        PkEvent.prototype.dispatch = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < this.listeners.length; i++) {
                if (key == this.listeners[i].key) {
                    var data = {
                        target: this.target // ho dispatch the event
                    };
                    // se houver contexto, manda pelo contexto
                    if (this.listeners[i].context) {
                        (_a = this.listeners[i].callBack).call.apply(_a, [this.listeners[i].context, data].concat(args));
                        return;
                    }
                    // dispara sem contexto mesmo
                    (_b = this.listeners[i]).callBack.apply(_b, [data].concat(args));
                }
            }
            var _a, _b;
        };
        return PkEvent;
    }());
    PkEvent.id = 0;
    Pk.PkEvent = PkEvent;
})(Pk || (Pk = {}));
/// <reference path='../PkTransition.ts' />
var Pk;
(function (Pk) {
    var PkTransitionAnimation;
    (function (PkTransitionAnimation) {
        var Default = (function () {
            function Default() {
                this.event = new Pk.PkEvent('PkTADefault', this);
            }
            Default.prototype.start = function () {
                // animation here
                // ...
                this.event.dispatch(Pk.E.OnTransitionEndStart);
            };
            Default.prototype.end = function () {
                // animation here
                // ...
                this.event.dispatch(Pk.E.OnTransitionEndEnd);
            };
            return Default;
        }());
        PkTransitionAnimation.Default = Default;
    })(PkTransitionAnimation = Pk.PkTransitionAnimation || (Pk.PkTransitionAnimation = {}));
})(Pk || (Pk = {}));
/// <reference path='../event/PkEvent.ts' />
/// <reference path='../PkGame.ts' />
/// <reference path='PkState.ts' />
/// <reference path='transitions/Default.ts' />
var Pk;
(function (Pk) {
    var PkTransition = (function () {
        function PkTransition(state) {
            this.transitionAnimation = new Pk.PkTransitionAnimation.Default();
            // defaults
            this.clearWorld = true;
            this.clearCache = false;
            this.game = state.game;
            this.state = state;
        }
        PkTransition.prototype.change = function (to) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.to = to;
            this.params = args;
            this.transitionAnimation.event.add(Pk.E.OnTransitionEndStart, this.endStartAnimation, this);
            this.transitionAnimation.event.add(Pk.E.OnTransitionEndEnd, this.endStartAnimation, this);
            this.transitionAnimation.start();
        };
        // This is called when the state preload has finished and creation begins
        PkTransition.prototype.endStartAnimation = function (e) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.game.state.onStateChange.addOnce(function (state) {
                // get current state
                var currentState = _this.game.state.getCurrentState();
                _this.game.state.onCreateCallback = function () {
                    // call current state create
                    currentState.create();
                    // play transition end
                    _this.transitionAnimation.end();
                };
            });
            // change state
            (_a = this.game.state).start.apply(_a, [this.to, this.clearWorld, this.clearCache].concat(this.params));
            var _a;
        };
        return PkTransition;
    }());
    Pk.PkTransition = PkTransition;
    var E;
    (function (E) {
        E.OnTransitionEndStart = "OnTransitionEndStart";
        E.OnTransitionEndEnd = "OnTransitionEndEnd";
    })(E = Pk.E || (Pk.E = {}));
})(Pk || (Pk = {}));
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkElement = (function (_super) {
        __extends(PkElement, _super);
        function PkElement(game) {
            var _this = _super.call(this, game) || this;
            _this.id = ++PkElement.id;
            _this.tweens = [];
            _this.name = "PkElement-" + _this.id;
            // inicia gerenciador de eventos
            _this.event = new Pk.PkEvent('element-event-' + _this.id, _this);
            return _this;
        }
        PkElement.prototype.addTween = function (displayObject) {
            this.tweens.push(this.game.add.tween(displayObject));
            return this.tweens[this.tweens.length - 1];
        };
        PkElement.prototype.destroy = function () {
            for (var i = this.tweens.length - 1; i >= 0; i--) {
                this.tweens[i].stop();
            }
            _super.prototype.destroy.call(this);
        };
        return PkElement;
    }(Phaser.Group));
    PkElement.id = 0;
    Pk.PkElement = PkElement;
})(Pk || (Pk = {}));
/// <reference path='PkTransition.ts' />
/// <reference path='../element/PkElement.ts' />
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkState = (function (_super) {
        __extends(PkState, _super);
        function PkState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.layers = [];
            _this.addLayer = function (layerName) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                if (!exist) {
                    // add to layer
                    this.layers.push({
                        name: layerName,
                        total: 0,
                        group: this.game.add.group()
                    });
                }
            };
            _this.addToLayer = function (layerName, element) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                // if dont exist, wharever
                if (!exist)
                    return;
                //
                // add element to layer
                this.layers[i].group.add(element);
                this.layers[i].total = this.layers[i].group.total;
                // order layers
                for (var i = 0; i < this.layers.length; i++)
                    this.game.world.bringToTop(this.layers[i].group);
                //
            };
            return _this;
        }
        PkState.prototype.getGame = function () {
            return this.game;
        };
        PkState.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.transition = new Pk.PkTransition(this);
        };
        PkState.prototype.create = function () {
            // console.log('PkState create');
        };
        return PkState;
    }(Phaser.State));
    Pk.PkState = PkState;
})(Pk || (Pk = {}));
/// <reference path='vendor/phaser/phaser.d.ts' />
/// <reference path='state/PkState.ts' />
var Pk;
(function (Pk) {
    var PkGame = (function (_super) {
        __extends(PkGame, _super);
        function PkGame(pkConfig) {
            if (pkConfig === void 0) { pkConfig = new Pk.PkConfig(); }
            var _this = _super.call(this, pkConfig.canvasSize[0], pkConfig.canvasSize[1], pkConfig.renderMode, pkConfig.canvasId) || this;
            PkGame.pkConfig = pkConfig;
            // add states
            _this.state.add('PkLoaderPreLoader', PkGame.pkConfig.preLoaderState);
            // init loader
            _this.state.start('PkLoaderPreLoader');
            PkGame.game = _this;
            return _this;
        }
        return PkGame;
    }(Phaser.Game));
    Pk.PkGame = PkGame;
    var PkLoaderPreLoader = (function (_super) {
        __extends(PkLoaderPreLoader, _super);
        function PkLoaderPreLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoaderPreLoader.prototype.init = function () {
            // add loader screen
            this.game.state.add('PkLoader', PkGame.pkConfig.loaderState);
        };
        PkLoaderPreLoader.prototype.preload = function () {
            // load loadingbar sprite
            this.load.image('pk-loading-bar', PkGame.pkConfig.loaderLoadingBar);
        };
        PkLoaderPreLoader.prototype.create = function () {
            // change to preloader screen*
            this.game.state.start('PkLoader');
        };
        return PkLoaderPreLoader;
    }(Pk.PkState));
    Pk.PkLoaderPreLoader = PkLoaderPreLoader;
})(Pk || (Pk = {}));
var Pk;
(function (Pk) {
    var PkConfig = (function () {
        function PkConfig() {
            this.canvasSize = [800, 600]; // width, height
            this.canvasId = 'game';
            this.renderMode = RenderMode.AUTO;
            this.initialState = ''; // initial state after loadscreen
            // loading settings
            this.loaderLoadingBar = 'assets/states/loader/images/loading-bar.png'; // loading bar
            this.loaderWaitingTime = 1000; // 1 sec
            this.loaderState = Pk.PkLoader;
            this.preLoaderState = Pk.PkLoaderPreLoader;
        }
        return PkConfig;
    }());
    Pk.PkConfig = PkConfig;
    // for remember ...    :'(     ... never forget
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["AUTO"] = Phaser.AUTO] = "AUTO";
        RenderMode[RenderMode["CANVAS"] = Phaser.CANVAS] = "CANVAS";
        RenderMode[RenderMode["WEBGL"] = Phaser.WEBGL] = "WEBGL";
        RenderMode[RenderMode["HEADLESS"] = Phaser.HEADLESS] = "HEADLESS";
    })(RenderMode = Pk.RenderMode || (Pk.RenderMode = {}));
})(Pk || (Pk = {}));
/// <reference path='state/PkState.ts' />
var Pk;
(function (Pk) {
    var PkLoader = (function (_super) {
        __extends(PkLoader, _super);
        function PkLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoader.prototype.init = function () {
        };
        PkLoader.prototype.preload = function () {
            this.load.setPreloadSprite(this.add.sprite(200, 250, 'pk-loading-bar'));
        };
        PkLoader.prototype.create = function () {
            var _this = this;
            setTimeout(function () {
                // if initial state set, load
                if (Pk.PkGame.pkConfig.initialState != '')
                    _this.game.state.start(Pk.PkGame.pkConfig.initialState);
                //
            }, Pk.PkGame.pkConfig.loaderWaitingTime);
        };
        return PkLoader;
    }(Pk.PkState));
    Pk.PkLoader = PkLoader;
})(Pk || (Pk = {}));
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkUtils = (function () {
        function PkUtils() {
        }
        // check if is a empty object
        PkUtils.isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true && JSON.stringify(obj) === JSON.stringify({});
        };
        PkUtils.createSquareBitmap = function (game, width, height, color) {
            if (color === void 0) { color = "#000000"; }
            var bmd = game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = color;
            bmd.ctx.fill();
            return bmd;
        };
        PkUtils.createSquare = function (game, width, height, color) {
            if (color === void 0) { color = "#000000"; }
            var bmd = Pk.PkUtils.createSquareBitmap(game, width, height, color);
            return game.add.sprite(0, 0, bmd);
        };
        return PkUtils;
    }());
    Pk.PkUtils = PkUtils;
})(Pk || (Pk = {}));
/// <reference path='PkGame.ts' />
/// <reference path='PkConfig.ts' />
/// <reference path='PkLoader.ts' />
/// <reference path='state/PkState.ts' />
/// <reference path='state/PkTransition.ts' />
/// <reference path='state/transitions/Default.ts' />
/// <reference path='event/PkEvent.ts' />
/// <reference path='element/PkElement.ts' />
/// <reference path='utils/PkUtils.ts' /> 
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, new Config()) || this;
            // add default state
            _this.state.add('Menu', GameBase.Menu);
            _this.state.add('Intro', GameBase.Intro);
            _this.state.add('Main', GameBase.Main);
            return _this;
        }
        return Game;
    }(Pk.PkGame));
    GameBase.Game = Game;
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            var _this = _super.call(this) || this;
            // loading load screen assets (logo, loading bar, etc) [pre-preloading]
            _this.preLoaderState = GameBase.Preloader;
            // loading all* game assets
            _this.loaderState = GameBase.Loader;
            _this.canvasSize = [1280, 720];
            _this.initialState = 'Main';
            return _this;
        }
        return Config;
    }(Pk.PkConfig));
})(GameBase || (GameBase = {}));
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var IntroBox = (function (_super) {
        __extends(IntroBox, _super);
        function IntroBox(game, image, text) {
            var _this = _super.call(this, game) || this;
            _this.padding = 20;
            _this.textStyle = {
                // font details
                font: "25px Arial",
                fill: "#fff",
                boundsAlignH: "center",
                boundsAlignV: "top",
                wordWrap: true,
                wordWrapWidth: 250
            };
            // set img
            _this.image = image;
            // text.w = image.w
            _this.textStyle.wordWrapWidth = _this.image.width + 100;
            // create text object
            _this.text = _this.game.add.text(0, 0, text, _this.textStyle);
            _this.text.align = "center";
            // style details
            _this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            // pos
            _this.text.y += _this.image.height + _this.padding;
            _this.text.width;
            _this.image.anchor.x = .5;
            _this.image.x = _this.text.width / 2;
            // add objs
            _this.add(_this.text);
            _this.add(_this.image);
            // "display none"
            _this.alpha = 0;
            return _this;
        }
        IntroBox.prototype.in = function (delay) {
            // anim block
            if (delay === void 0) { delay = 1500; }
            this.addTween(this).to({
                alpha: 1
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            true, // auto start
            delay // delay 
            );
        };
        IntroBox.prototype.out = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 0; }
            // anim block
            var outTween = this.addTween(this).to({
                alpha: 0
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            false, // auto start
            delay // delay 
            );
            // remove when anim out complete
            outTween.onComplete.add(function () {
                _this.destroy();
            }, this);
            outTween.start();
        };
        return IntroBox;
    }(Pk.PkElement));
    GameBase.IntroBox = IntroBox;
    var E;
    (function (E) {
        var IntroBoxDirection;
        (function (IntroBoxDirection) {
            IntroBoxDirection[IntroBoxDirection["LEFT"] = 0] = "LEFT";
            IntroBoxDirection[IntroBoxDirection["RIGHT"] = 1] = "RIGHT";
        })(IntroBoxDirection = E.IntroBoxDirection || (E.IntroBoxDirection = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            // utils / vendor
            this.load.script('WebFont', 'com/gamebase/vendor/webfontloader.js');
            // load game loading bar
            this.load.image('game-loading-bar', 'assets/states/loader/images/loading-bar.png');
            // load game loading logo
            this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        };
        return Preloader;
    }(Pk.PkLoaderPreLoader));
    GameBase.Preloader = Preloader;
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Loader.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        Loader.prototype.preload = function () {
            // ignore preloading bar
            // super.preload();
            // creating sprites from preloadead images
            this.loadingBar = this.add.sprite(0, 0, 'game-loading-bar');
            this.logo = this.add.sprite(0, 0, 'game-loading-logo');
            // position loading bar | middle
            this.loadingBar.anchor.x = 0.5;
            this.loadingBar.x = this.game.width / 2;
            this.loadingBar.y = this.game.height - this.loadingBar.height;
            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);
            // positioning logo on middle
            this.logo.anchor.set(.5, .5);
            this.logo.position.set(this.game.width / 2, this.game.height / 2);
            // add a preloadead logo
            this.game.add.existing(this.logo);
            this.logo.alpha = 0;
            //  ** ADDING Other things  ** //
            // intro
            this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            this.load.image('intro-1', 'assets/states/intro/images/1.jpg');
            this.load.image('intro-2', 'assets/states/intro/images/2.jpg');
            this.load.image('intro-3', 'assets/states/intro/images/3.jpg');
            // chars
            this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/idle.png', 200, 300, 1);
            this.load.spritesheet('char2-idle', 'assets/default/images/chars/heroes/2/idle.png', 150, 200, 1);
            this.load.spritesheet('char3-idle', 'assets/default/images/chars/heroes/3/idle.png', 150, 250, 1);
            this.load.spritesheet('char4-idle', 'assets/default/images/chars/heroes/4/iddle.png', 211, 203.4, 20);
            // icons
            this.load.image('heath-icon', 'assets/default/images/ui/ico-health.png');
            this.load.image('stamina-icon', 'assets/default/images/ui/ico-stamina.png');
            this.load.image('mana-icon', 'assets/default/images/ui/ico-mana.png');
            this.load.spritesheet('selected-icon', 'assets/default/images/selectable-icon.png', 22, 16, 3);
            // ui hero
            this.load.image('ui-hero-1-on', 'assets/default/images/chars/heroes/1/ui-on.png');
            this.load.image('ui-hero-2-on', 'assets/default/images/chars/heroes/2/ui-on.png');
            this.load.image('ui-hero-3-on', 'assets/default/images/chars/heroes/3/ui-on.png');
            this.load.image('ui-hero-4-on', 'assets/default/images/chars/heroes/4/ui-on.png');
            this.load.image('ui-hero-1-off', 'assets/default/images/chars/heroes/1/ui-off.png');
            this.load.image('ui-hero-2-off', 'assets/default/images/chars/heroes/2/ui-off.png');
            this.load.image('ui-hero-3-off', 'assets/default/images/chars/heroes/3/ui-off.png');
            this.load.image('ui-hero-4-off', 'assets/default/images/chars/heroes/4/ui-off.png');
            // ui hero attacks
            this.load.image('ui-hero-attacks-bg-1', 'assets/default/images/ui/b-large-bg.png');
            this.load.image('ui-hero-attack-bg', 'assets/default/images/ui/b-spell-bg.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.DIVI, 'assets/default/images/ui/b-i-div.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MULT, 'assets/default/images/ui/b-i-multi.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.PLUS, 'assets/default/images/ui/b-i-soma.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MINU, 'assets/default/images/ui/b-i-sub.png');
            this.load.image('ui-enemy-value-bg', 'assets/default/images/ui/b-monster-bg.png');
            this.load.image('reload-box', 'assets/default/images/ui/reload-box.png');
            // monster
            this.load.spritesheet('monster1-idle', 'assets/default/images/chars/enemies/1/idle.png', 350, 480, 1);
            this.load.spritesheet('monster2-idle', 'assets/default/images/chars/enemies/2/idle.png', 650, 474, 1);
            this.load.spritesheet('monster3-idle', 'assets/default/images/chars/enemies/3/idle.png', 300, 500, 1);
            this.load.spritesheet('monster4-idle', 'assets/default/images/chars/enemies/4/idle.png', 500, 550, 1);
            // main
            this.load.image('main-bg', 'assets/states/main/images/bg/s-background.png');
            this.load.image('main-bridge-back', 'assets/states/main/images/bg/s-bridge-back.png');
            this.load.image('main-bridge-front', 'assets/states/main/images/bg/s-bridge-front.png');
            // op icons
            this.load.spritesheet('operator-icon-' + GameBase.E.Operator.MULT, 'assets/default/images/operator-icon-mult.png', 15, 15, 3);
            this.load.spritesheet('operator-icon-' + GameBase.E.Operator.PLUS, 'assets/default/images/operator-icon-plus.png', 15, 15, 3);
            this.load.spritesheet('operator-icon-' + GameBase.E.Operator.MINU, 'assets/default/images/operator-icon-min.png', 15, 15, 3);
            this.load.spritesheet('operator-icon-' + GameBase.E.Operator.DIVI, 'assets/default/images/operator-icon-div.png', 15, 15, 3);
        };
        Loader.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        return Loader;
    }(Pk.PkLoader));
    GameBase.Loader = Loader;
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Attack = (function (_super) {
        __extends(Attack, _super);
        function Attack(game, value, energyCost, operator, energyType, name, description, icon) {
            if (name === void 0) { name = "Attack Name"; }
            if (description === void 0) { description = "Attack description. Bla Bla Bla Bla"; }
            if (icon === void 0) { icon = null; }
            var _this = _super.call(this, game) || this;
            _this.iconPadding = 10;
            _this.textPadding = 1;
            _this.bgPadding = 10;
            _this.textStyleName = {
                font: "18px Arial",
                fill: "#fff"
            };
            _this.textStyleDescription = {
                font: "12px Arial",
                fill: "#fff"
            };
            _this.textStyleValues = {
                font: "22px Arial",
                fill: "#fff"
            };
            // values
            _this.value = value;
            _this.energyCost = energyCost;
            _this.operator = operator;
            // meta info
            _this.name = name;
            _this.description = description;
            _this.icon = icon;
            _this.energyType = energyType;
            return _this;
        }
        Attack.prototype.create = function () {
            this.visible = false;
        };
        Attack.prototype.show = function (delay) {
            this.visible = true;
            // save initial pos | one time only
            if (!this.initialPos)
                this.initialPos = new Phaser.Point(this.x, this.y);
            //
            this.alpha = 1;
            this.addTween(this).from({
                alpha: 0
            }, 200, Phaser.Easing.Back.In, true, delay);
            this.position.y = this.initialPos.y;
            this.addTween(this).from({
                y: this.initialPos.y + 50
            }, 500, Phaser.Easing.Cubic.Out, true, delay);
        };
        return Attack;
    }(Pk.PkElement));
    GameBase.Attack = Attack;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
/// <reference path='./base/Attack.ts' />
var GameBase;
(function (GameBase) {
    var Attacks;
    (function (Attacks) {
        var Regular = (function (_super) {
            __extends(Regular, _super);
            function Regular(game, operator, energyType) {
                return _super.call(this, game, 5, 2, operator, energyType, "Regular Attack", "Attack description. Bla Bla Bla Bla", new GameBase.Icon(game, 'attack-icon-regular')) || this;
            }
            Regular.prototype.create = function () {
                _super.prototype.create.call(this);
            };
            return Regular;
        }(GameBase.Attack));
        Attacks.Regular = Regular;
    })(Attacks = GameBase.Attacks || (GameBase.Attacks = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Char = (function (_super) {
        __extends(Char, _super);
        function Char(game, body) {
            var _this = _super.call(this, game) || this;
            _this.energyMax = 5;
            _this.healthMax = 5;
            _this.side = Side.RIGHT; // sprite side
            _this.animations = [];
            _this.selected = false;
            _this.attacks = [];
            _this.attackOpenDelay = 100;
            var bodySprite = Pk.PkUtils.createSquare(game, body.width, body.height);
            bodySprite.alpha = .0;
            _this.setBody(bodySprite);
            return _this;
        }
        Char.prototype.addAnimation = function (sprite, animationKey, fps) {
            if (fps === void 0) { fps = 10; }
            var a = sprite.animations.add(animationKey);
            // a.play(fps, true);
            // this.body.addChild(sprite);
            this.add(sprite);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;
            sprite.x = this.body.width / 2;
            sprite.y = this.body.height; // + 40;
            // sprite.anchor.set(.5, .5);
            //sprite.position = this.body.position; 
            // this.body.events.
            // sprite.y = this.body.y;
            this.animations.push({
                animation: a,
                sprite: sprite
            });
            return sprite;
        };
        Char.prototype.playAnimation = function (key, fps, loop) {
            if (fps === void 0) { fps = 10; }
            if (loop === void 0) { loop = true; }
            this.animations.forEach(function (element) {
                element.animation.stop();
                element.sprite.visible = false;
                console.log('------??');
                if (element.animation.name == key) {
                    console.log('play animation key:' + key);
                    element.animation.play(fps, loop);
                    // element.animation.restart();
                    element.sprite.visible = true;
                }
            });
        };
        Char.prototype.create = function () {
            /*
            // animation
            this.animationIdle = this.body.animations.add('idle');
            this.animationIdle.play(10, true); // start idle animation
            */
            this.selectedIcon = new GameBase.SelectedIcon(this.game, this.body);
            this.selectedIcon.create();
            this.add(this.selectedIcon);
        };
        Char.prototype.setBody = function (body) {
            this.body = body;
            this.add(this.body);
            /*
            this.body.events.onInputOver.add(this.inputOver, this);
            this.body.events.onInputOut.add(this.inputOut, this);
            */
        };
        Char.prototype.inputOver = function () {
            this.selectedIcon.in();
            this.selected = true;
        };
        Char.prototype.inputOut = function () {
            this.selectedIcon.out();
            this.selected = false;
        };
        Char.prototype.addAttack = function (attack) {
            // create attack
            attack.create();
            // add attack
            this.attacks.push(attack);
        };
        Char.prototype.openAttacks = function () {
            for (var i = 0; i < this.attacks.length; i++) {
                var attack = this.attacks[i];
                // pos attacks
                attack.x = this.x + this.body.width / 2;
                attack.y = this.y - attack.height;
                // last attack position
                if (i > 0)
                    attack.y = this.attacks[i - 1].y - attack.height - this.attacks[i - 1].energyTypeIcon.height - 50;
                //
                // show
                attack.show(i * this.attackOpenDelay);
            }
        };
        return Char;
    }(Pk.PkElement));
    GameBase.Char = Char;
    var E;
    (function (E) {
        var Operator;
        (function (Operator) {
            Operator[Operator["MULT"] = 0] = "MULT";
            Operator[Operator["DIVI"] = 1] = "DIVI";
            Operator[Operator["PLUS"] = 2] = "PLUS";
            Operator[Operator["MINU"] = 3] = "MINU";
            Operator[Operator["FACT"] = 4] = "FACT";
        })(Operator = E.Operator || (E.Operator = {}));
    })(E = GameBase.E || (GameBase.E = {}));
    var Side;
    (function (Side) {
        Side[Side["LEFT"] = 0] = "LEFT";
        Side[Side["RIGHT"] = 1] = "RIGHT";
    })(Side = GameBase.Side || (GameBase.Side = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
var GameBase;
(function (GameBase) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, body, id, value) {
            var _this = _super.call(this, game, body) || this;
            _this.identification = 0;
            _this.value = 0;
            _this.ui = new GameBase.ui.Enemy(_this.game, _this);
            _this.identification = id;
            _this.value = value;
            GameBase.Enemy.enemies.push(_this);
            return _this;
        }
        Enemy.prototype.create = function () {
            _super.prototype.create.call(this);
            this.ui.create();
        };
        return Enemy;
    }(GameBase.Char));
    Enemy.enemies = [];
    GameBase.Enemy = Enemy;
    var E;
    (function (E) {
        var EnemyEvent;
        (function (EnemyEvent) {
            EnemyEvent.OnHeroSelected = "OnHeroSelected";
            EnemyEvent.OnHeroDeselect = "OnHeroDeselect";
        })(EnemyEvent = E.EnemyEvent || (E.EnemyEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
var GameBase;
(function (GameBase) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game, body, id) {
            var _this = _super.call(this, game, body) || this;
            _this.identification = 0;
            _this.energyType = E.EnergyType.STAMINA;
            _this.ui = new GameBase.ui.Hero(_this.game, _this);
            _this.uiAttack = new GameBase.ui.Attack(_this.game, _this);
            _this.identification = id;
            GameBase.Hero.heroes.push(_this);
            return _this;
        }
        Hero.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.ui.create();
            this.uiAttack.create();
            this.body.events.onInputDown.add(function () {
                // deselect all others
                GameBase.Hero.heroes.forEach(function (hero) {
                    if (hero.identification != _this.identification)
                        hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
                    //
                });
                // this.openAttacks();
                _this.event.dispatch(GameBase.E.HeroEvent.OnHeroSelected);
            }, this);
        };
        Hero.prototype.setBody = function (body) {
            _super.prototype.setBody.call(this, body);
            // mouse over check
            this.body.inputEnabled = true;
            this.body.input.useHandCursor = true;
        };
        return Hero;
    }(GameBase.Char));
    Hero.heroes = [];
    GameBase.Hero = Hero;
    var E;
    (function (E) {
        var EnergyType;
        (function (EnergyType) {
            EnergyType[EnergyType["STAMINA"] = 0] = "STAMINA";
            EnergyType[EnergyType["MANA"] = 1] = "MANA";
        })(EnergyType = E.EnergyType || (E.EnergyType = {}));
        var HeroEvent;
        (function (HeroEvent) {
            HeroEvent.OnHeroSelected = "OnHeroSelected";
            HeroEvent.OnHeroDeselect = "OnHeroDeselect";
        })(HeroEvent = E.HeroEvent || (E.HeroEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Druid = (function (_super) {
        __extends(Druid, _super);
        function Druid(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 150, 249), 1) || this;
            // energy type
            _this.energyType = GameBase.E.EnergyType.MANA;
            // operator
            _this.operator = GameBase.E.Operator.MULT;
            return _this;
        }
        Druid.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 3;
            attack1.value = 2;
            this.addAttack(attack1);
            var attack2 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack2.energyCost = 4;
            attack2.value = 3;
            this.addAttack(attack2);
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 4;
            this.addAttack(attack3);
            _super.prototype.create.call(this);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'idle');
            aniSprite.y += 26; // padding sprite adjust
        };
        return Druid;
    }(GameBase.Hero));
    GameBase.Druid = Druid;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Knight = (function (_super) {
        __extends(Knight, _super);
        function Knight(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 184, 189), 4) || this;
            // energy type
            _this.energyType = GameBase.E.EnergyType.STAMINA;
            // operator
            _this.operator = GameBase.E.Operator.PLUS;
            return _this;
        }
        Knight.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 1;
            this.addAttack(attack1);
            var attack2 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack2.energyCost = 3;
            attack2.value = 5;
            this.addAttack(attack2);
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 15;
            this.addAttack(attack3);
            _super.prototype.create.call(this);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'iddle');
            aniSprite.y += 28; // padding sprite adjust
            // this.animationIdle.play(10, true);
            this.playAnimation('iddle', 10);
        };
        return Knight;
    }(GameBase.Hero));
    GameBase.Knight = Knight;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
/// <reference path='./base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Priest = (function (_super) {
        __extends(Priest, _super);
        function Priest(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 84, 220), 3) || this;
            // energy type
            _this.energyType = GameBase.E.EnergyType.MANA;
            // operator
            _this.operator = GameBase.E.Operator.DIVI;
            return _this;
        }
        Priest.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 3;
            attack1.value = 2;
            this.addAttack(attack1);
            var attack2 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack2.energyCost = 4;
            attack2.value = 3;
            this.addAttack(attack2);
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 4;
            this.addAttack(attack3);
            _super.prototype.create.call(this);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'idle');
            aniSprite.y += 16;
        };
        return Priest;
    }(GameBase.Hero));
    GameBase.Priest = Priest;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
/// <reference path='./base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Thief = (function (_super) {
        __extends(Thief, _super);
        function Thief(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 125, 145), 2) || this;
            // energy type
            _this.energyType = GameBase.E.EnergyType.STAMINA;
            // operator
            _this.operator = GameBase.E.Operator.MINU;
            return _this;
        }
        Thief.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 1;
            this.addAttack(attack1);
            var attack2 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack2.energyCost = 3;
            attack2.value = 5;
            this.addAttack(attack2);
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 15;
            this.addAttack(attack3);
            _super.prototype.create.call(this);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'idle');
            aniSprite.y += 28; // padding sprite adjust
        };
        return Thief;
    }(GameBase.Hero));
    GameBase.Thief = Thief;
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Lizzard = (function (_super) {
        __extends(Lizzard, _super);
        function Lizzard(game) {
            return _super.call(this, game, new Phaser.Rectangle(0, 0, 273, 372), 1, 42) || this;
        }
        Lizzard.prototype.create = function () {
            _super.prototype.create.call(this);
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster' + this.identification + '-idle'), 'idle');
            aniSprite.y += 69; // padding sprite adjust
        };
        return Lizzard;
    }(GameBase.Enemy));
    GameBase.Lizzard = Lizzard;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Intro = (function (_super) {
        __extends(Intro, _super);
        function Intro() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.padding = 30;
            _this.boxs = new Array();
            _this.boxsIndex = 0;
            _this.boxsDelay = 5000;
            return _this;
        }
        Intro.prototype.create = function () {
            // change state bg
            this.game.stage.backgroundColor = "#000";
            // add boxs
            this.boxs.push(new GameBase.IntroBox(this.game, this.add.sprite(0, 0, 'intro-1'), "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."));
            this.boxs.push(new GameBase.IntroBox(this.game, this.add.sprite(0, 0, 'intro-2'), "Nor again is there anyone sit who loves or pursues or desires to obtain pain of itself, because it is pain."));
            this.boxs.push(new GameBase.IntroBox(this.game, this.add.sprite(0, 0, 'intro-3'), "Ut enim ad minima veniam, exercitationem ullam laboriosam, nisi ut aliquid ex ea commodi consequatur?"));
            // pos boxs
            for (var i in this.boxs) {
                var b = this.boxs[i];
                // pos
                b.x = this.game.world.centerX - (b.width / 2); // center
                b.y += this.padding; // padding
            }
            // audio
            this.musicBG = this.game.add.audio('intro-sound');
            this.musicBG.onDecoded.add(this.playSound, this); // load
            // on sound complete
            this.musicBG.onStop.add(this.end, this);
            // skip "button" text
            this.skipButton = new Pk.PkElement(this.game);
            var skipText = this.game.add.text(0, // x
            0, // y
            "Skip >>" // text
            , {
                // font details
                font: "12px Arial",
                fill: "#fff"
            });
            skipText.align = "left";
            // add in object
            this.skipButton.add(skipText);
            // enable input and hand cursor
            this.skipButton.setAll('inputEnabled', true);
            this.skipButton.setAll('input.useHandCursor', true);
            // position
            this.skipButton.x = this.game.width - this.skipButton.width - this.padding;
            this.skipButton.y = this.padding;
            // skip action
            this.skipButton.callAll('events.onInputUp.add', 'events.onInputUp', this.end, this);
            // skipp button show delay
            this.game.add.tween(this.skipButton).from({
                y: this.skipButton.height * (-1)
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            true, // auto start
            1500 // delay | 1.5 sec
            );
            // play boxes
            this.playBoxs();
        };
        Intro.prototype.playBoxs = function () {
            var _this = this;
            // if has no boxes
            if (!this.boxs.length)
                return;
            //
            // next ones
            this.boxsInterval = setInterval(function () {
                _this.playBox();
            }, this.boxsDelay);
            this.playBox();
        };
        Intro.prototype.playBox = function () {
            var _this = this;
            // finish last box
            if (this.boxsIndex > 0)
                this.boxs[this.boxsIndex - 1].out();
            // 
            // if last box
            if (this.boxsIndex == this.boxs.length) {
                setTimeout(function () {
                    _this.end();
                }, 1500);
                return;
            }
            // play
            this.boxs[this.boxsIndex].in(500);
            // next
            this.boxsIndex++;
        };
        Intro.prototype.end = function () {
            // change state
            clearInterval(this.boxsInterval);
            this.transition.change('Menu');
        };
        Intro.prototype.playSound = function () {
            // play music
            this.musicBG.fadeIn(1000, false);
        };
        // calls when leaving state
        Intro.prototype.shutdown = function () {
            if (this.musicBG.isPlaying)
                this.musicBG.stop();
            //
        };
        return Intro;
    }(Pk.PkState));
    GameBase.Intro = Intro;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.charPadding = 15;
            _this.padding = 20;
            return _this;
        }
        Main.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
        };
        Main.prototype.create = function () {
            var _this = this;
            // change state bg
            this.game.stage.backgroundColor = "#938da0";
            // prevent stop update when focus out
            this.stage.disableVisibilityChange = true;
            // get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // when press the key...
            this.enterKey.onDown.add(function () {
                // this.transition.change('Menu', 1111, 'text', {a:true, b:[1, 2]});  // return with some foo/bar args
            }, this);
            // add layers
            this.addLayer('stage-back-1');
            this.addLayer('stage-back-2');
            this.addLayer('stage-back-3');
            this.addLayer('chars');
            this.addLayer('stage-front-1');
            this.addLayer('ui');
            // scenario sprites
            var mainBg = this.game.add.sprite(0, 0, 'main-bg');
            var mainBridgeBack = this.game.add.sprite(0, 0, 'main-bridge-back');
            var mainBridgeFront = this.game.add.sprite(0, 0, 'main-bridge-front');
            // set characters group / element
            this.heroes = new Pk.PkElement(this.game);
            // create heroes
            var druid = new GameBase.Druid(this.game);
            druid.create();
            var thief = new GameBase.Thief(this.game);
            thief.create();
            var priest = new GameBase.Priest(this.game);
            priest.create();
            var knight = new GameBase.Knight(this.game);
            knight.create();
            // add
            this.heroes.add(druid);
            this.heroes.add(thief);
            this.heroes.add(priest);
            this.heroes.add(knight);
            // create a enemy
            var lizzard = new GameBase.Lizzard(this.game);
            lizzard.create();
            lizzard.x = this.game.world.width - lizzard.width;
            lizzard.y = 200;
            lizzard.ui.updatePosition();
            var i = 0;
            this.heroes.forEach(function (hero) {
                // pos
                hero.x = _this.padding;
                if (i > 0) {
                    var lastHero = _this.heroes.getAt(i - 1);
                    hero.x = lastHero.x + lastHero.body.width + _this.charPadding;
                }
                hero.y = _this.game.height - hero.body.height - _this.padding - 145;
                // pos ui
                hero.ui.x = 170 * i;
                hero.ui.y = hero.y + 45;
                hero.ui.setAsInitialCords();
                hero.y += 10 * i; // stars style
                // pos ui
                hero.uiAttack.x = 140 * i;
                hero.uiAttack.y = hero.y - hero.uiAttack.height + 50;
                hero.uiAttack.setAsInitialCords();
                // add ui to layer
                _this.addToLayer('ui', hero.ui);
                _this.addToLayer('ui', hero.uiAttack);
                // next node
                i++;
            }, this);
            // ????
            knight.ui.x -= 75;
            knight.ui.setAsInitialCords();
            // add chars to layer
            this.addToLayer('chars', this.heroes);
            this.addToLayer('chars', lizzard);
            // monster ui
            this.addToLayer('ui', lizzard.ui);
            // scenario position
            mainBridgeBack.y = 443;
            mainBridgeFront.y = 540;
            this.addToLayer('stage-back-1', mainBg);
            this.addToLayer('stage-back-2', mainBridgeBack);
            this.addToLayer('stage-front-1', mainBridgeFront);
            // transition
            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
        };
        Main.prototype.render = function () {
            // this.game.debug.text('(Main Screen) Press [ENTER] to Menu', 35, 35);
        };
        return Main;
    }(Pk.PkState));
    GameBase.Main = Main;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Menu.prototype.init = function (param1, param2, param3) {
            _super.prototype.init.call(this); // if whant override init, you need this line!
            console.log('Menu init');
        };
        Menu.prototype.create = function () {
            var _this = this;
            console.log('Menu create');
            // change state bg
            this.game.stage.backgroundColor = "#89aca6";
            // get the keyboard
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // when press the key...
            this.enterKey.onDown.add(function () {
                _this.transition.change('Main'); // change to state Main
            }, this);
            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
        };
        Menu.prototype.render = function () {
            this.game.debug.text('(Menu Screen) Press [ENTER] to Main', 35, 35);
        };
        return Menu;
    }(Pk.PkState));
    GameBase.Menu = Menu;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Transitions;
    (function (Transitions) {
        var Alpha = (function () {
            function Alpha(game) {
                this.event = new Pk.PkEvent('Transitions.Alpha', this);
                this.changeTime = 500; // ms
                this.game = game;
            }
            Alpha.prototype.start = function () {
                var _this = this;
                // create a full screen black retangle alpha 0
                this.retangle = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height, "#000000");
                this.retangle.alpha = 0;
                // create a tween animation
                // tween samples: http://phaser.io/examples/v2/category/tweens
                var t = this.game.add.tween(this.retangle).to({ alpha: 1 }, this.changeTime, "Linear");
                t.onComplete.add(function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(Pk.E.OnTransitionEndStart);
                }, this);
                t.start(); // play tween
            };
            Alpha.prototype.end = function () {
                var _this = this;
                // create a full screen black retangle alpha 1. Revert previous transition
                var retangle = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height, "#000000");
                // create a tween animation
                // tween samples: http://phaser.io/examples/v2/category/tweens
                var t = this.game.add.tween(retangle).to({ alpha: 0 }, this.changeTime, "Linear");
                t.onComplete.add(function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(Pk.E.OnTransitionEndEnd);
                }, this);
                t.start(); // play tween
            };
            return Alpha;
        }());
        Transitions.Alpha = Alpha;
    })(Transitions = GameBase.Transitions || (GameBase.Transitions = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Transitions;
    (function (Transitions) {
        var Slide = (function () {
            function Slide(game) {
                this.event = new Pk.PkEvent('Transitions.Slide', this);
                this.changeTime = 500; // ms
                this.game = game;
            }
            Slide.prototype.start = function () {
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                    new Phaser.Point((this.game.world.width / 2) * (-1), 0),
                    new Phaser.Point(this.game.world.width, 0),
                    new Phaser.Point(this.game.world.width, this.game.world.height),
                    new Phaser.Point(0, this.game.world.height) // 3
                ]);
                var bg = this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                bg.x = bg.width;
                var slideTween = this.game.add.tween(bg);
                slideTween.to({
                    x: 0
                }, this.changeTime);
                slideTween.onComplete.add(function (obj) {
                    // dispatch end transition | mandatory
                    this.event.dispatch(Pk.E.OnTransitionEndStart);
                }, this);
                slideTween.start();
            };
            Slide.prototype.end = function () {
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                    new Phaser.Point(0, 0),
                    new Phaser.Point(this.game.world.width, 0),
                    new Phaser.Point(this.game.world.width + (this.game.world.width / 2), this.game.world.height),
                    new Phaser.Point(0, this.game.world.height) // 3
                ]);
                var bg = this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                // bg.width; // phaser
                var slideTween = this.game.add.tween(bg);
                slideTween.to({
                    x: bg.width * (-1)
                }, this.changeTime);
                slideTween.onComplete.add(function (obj) {
                    // dispatch end transition | mandatory
                    console.log('terminou animação');
                    this.event.dispatch(Pk.E.OnTransitionEndEnd);
                }, this);
                slideTween.start();
            };
            return Slide;
        }());
        Transitions.Slide = Slide;
    })(Transitions = GameBase.Transitions || (GameBase.Transitions = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var ui;
    (function (ui) {
        var Attack = (function (_super) {
            __extends(Attack, _super);
            function Attack(game, hero) {
                var _this = _super.call(this, game) || this;
                _this.textStyleValues = {
                    font: "48px StrangerBack",
                    fill: "#e5d4c5"
                };
                _this.textStyleEnergy = {
                    font: "32px StrangerBack",
                    fill: "#fff"
                };
                _this.hero = hero;
                _this.attackBoxes = new Pk.PkElement(game);
                return _this;
            }
            Attack.prototype.create = function () {
                var _this = this;
                // bg
                this.attackBg = this.game.add.sprite(0, 0, 'ui-hero-attacks-bg-1');
                var reloadBox = this.game.add.sprite(0, 0, 'reload-box');
                this.hero.attacks.forEach(function (attack, i) {
                    // bg
                    var bg = _this.game.add.sprite(0, 0, 'ui-hero-attack-bg');
                    // value
                    var textValue = _this.game.add.text(0, 0, attack.value.toString(), // text
                    _this.textStyleValues // font style
                    );
                    textValue.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
                    textValue.align = "right";
                    textValue.anchor.x = 1;
                    // energy
                    var textEnergy = _this.game.add.text(0, 0, attack.energyCost.toString(), // text
                    _this.textStyleEnergy // font style
                    );
                    textEnergy.setShadow(3, 3, 'rgba(0,0,0,0.5)', 1);
                    textEnergy.align = "center";
                    textEnergy.anchor.x = 0.5;
                    // operator
                    var operatorIcon = _this.game.add.sprite(0, 0, 'ui-hero-operator-' + attack.operator);
                    // add
                    _this.attackBoxes.add(bg);
                    _this.attackBoxes.add(textValue);
                    _this.attackBoxes.add(textEnergy);
                    _this.attackBoxes.add(operatorIcon);
                    // input events
                    _this.attackBoxes.setAll('inputEnabled', true);
                    _this.attackBoxes.setAll('input.useHandCursor', true);
                    // pos
                    bg.x = (bg.width + 5) * i;
                    operatorIcon.x = bg.x + bg.width - 10;
                    operatorIcon.y -= 10;
                    textValue.x = operatorIcon.x + 2;
                    textValue.y = bg.y - 10;
                    textEnergy.x = bg.x + 17;
                    textEnergy.y = bg.y + bg.width - textEnergy.height + 10;
                });
                this.attackBoxes.x = this.attackBg.width / 2 - this.attackBoxes.width / 2;
                this.attackBoxes.y += 32;
                // reload box pos
                reloadBox.x = this.attackBg.x + this.attackBg.width - reloadBox.width;
                reloadBox.y = this.attackBg.y + this.attackBg.height;
                // add  
                this.add(this.attackBg);
                this.add(this.attackBoxes);
                this.add(reloadBox);
                this.setAsInitialCords();
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);
                this.visible = false;
            };
            Attack.prototype.setAsInitialCords = function () {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            };
            Attack.prototype.heroDeselect = function () {
                this.visible = false;
            };
            Attack.prototype.heroSelectd = function () {
                this.visible = true;
                this.resetAttrs();
                // this.bg.loadTexture('ui-hero-'+this.hero.identification+'-on');
            };
            Attack.prototype.resetAttrs = function () {
                this.alpha = 1;
                this.x = this.initialPosition.x;
                this.y = this.initialPosition.y;
                this.rotation = this.initialRotation;
            };
            return Attack;
        }(Pk.PkElement));
        ui.Attack = Attack;
    })(ui = GameBase.ui || (GameBase.ui = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var ui;
    (function (ui) {
        var Enemy = (function (_super) {
            __extends(Enemy, _super);
            function Enemy(game, enemy) {
                var _this = _super.call(this, game) || this;
                _this.textStyleValues = {
                    font: "58px StrangerBack",
                    fill: "#643b35"
                };
                _this.enemy = enemy;
                return _this;
            }
            Enemy.prototype.create = function () {
                // bg
                this.bg = this.game.add.sprite(0, 0, 'ui-enemy-value-bg');
                // value
                var textValue = this.game.add.text(0, 0, this.enemy.value.toString(), // text
                this.textStyleValues // font style
                );
                textValue.align = "center";
                textValue.anchor.set(0.5);
                textValue.x = this.bg.width / 2;
                textValue.y = this.bg.height / 2;
                // add 
                this.add(this.bg);
                this.add(textValue);
                // pos
                this.updatePosition();
            };
            Enemy.prototype.updatePosition = function () {
                // put on head 
                this.x = this.enemy.x;
                this.y = this.enemy.y - this.height;
                this.setAsInitialCords();
            };
            Enemy.prototype.setAsInitialCords = function () {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            };
            return Enemy;
        }(Pk.PkElement));
        ui.Enemy = Enemy;
    })(ui = GameBase.ui || (GameBase.ui = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Gaude = (function (_super) {
        __extends(Gaude, _super);
        function Gaude() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.icons = [];
            _this.iconEven = true;
            _this.padding = 3;
            return _this;
        }
        Gaude.prototype.addIcon = function (icon) {
            icon.create();
            // icon.animation.setFrame( this.iconEven ? 1 : 2);
            // this.iconEven = !this.iconEven;
            // save icon ref
            this.icons.push(icon);
            // add on gaude
            this.add(icon);
            // organize icons pos
            for (var i = 0; i < this.icons.length; i++)
                this.icons[i].x = (this.icons[i].width + this.padding) * i;
            //
            // console.log('add icon:', this.icons);
            // 
        };
        return Gaude;
    }(Pk.PkElement));
    GameBase.Gaude = Gaude;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var ui;
    (function (ui) {
        var Hero = (function (_super) {
            __extends(Hero, _super);
            function Hero(game, hero) {
                var _this = _super.call(this, game) || this;
                _this.gaudePadding = 10;
                _this.gaudeHeroPadding = 25;
                _this.hero = hero;
                _this.hero.body.events.onInputOver.add(_this.inputOver, _this);
                _this.hero.body.events.onInputOut.add(_this.resetAttrs, _this);
                return _this;
            }
            Hero.prototype.create = function () {
                // bg
                this.bg = this.game.add.sprite(0, 0, 'ui-hero-' + this.hero.identification + '-off');
                // gaudes
                this.healthGaude = new GameBase.Gaude(this.game);
                this.energiGaude = new GameBase.Gaude(this.game);
                // add on hero 
                this.add(this.bg);
                this.add(this.healthGaude);
                this.add(this.energiGaude);
                // add heath icons
                for (var i = 0; i < this.hero.healthMax; i++)
                    this.healthGaude.addIcon(new GameBase.Icon(this.game, 'heath-icon'));
                //
                // select energy icon
                var energyIconKey = '';
                switch (this.hero.energyType) {
                    case GameBase.E.EnergyType.MANA:
                        energyIconKey = 'mana-icon';
                        break;
                    case GameBase.E.EnergyType.STAMINA:
                        energyIconKey = 'stamina-icon';
                        break;
                }
                // add energy icons
                for (var i = 0; i < this.hero.energyMax; i++)
                    this.energiGaude.addIcon(new GameBase.Icon(this.game, energyIconKey));
                //
                // pos 
                this.bg.y = this.hero.body.height;
                this.bg.anchor.x = .5;
                this.bg.x = this.hero.body.width / 2;
                this.healthGaude.x = this.bg.x - this.bg.width / 2;
                this.healthGaude.x += 65;
                this.healthGaude.y = this.bg.y + 40;
                this.energiGaude.x = this.healthGaude.x;
                this.energiGaude.y = this.healthGaude.y + this.gaudePadding;
                this.setAsInitialCords();
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);
            };
            Hero.prototype.setAsInitialCords = function () {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            };
            Hero.prototype.heroDeselect = function () {
                this.bg.loadTexture('ui-hero-' + this.hero.identification + '-off');
            };
            Hero.prototype.heroSelectd = function () {
                this.resetAttrs();
                this.bg.loadTexture('ui-hero-' + this.hero.identification + '-on');
            };
            Hero.prototype.inputOver = function () {
                this.y -= 10;
            };
            Hero.prototype.resetAttrs = function () {
                this.alpha = 1;
                this.x = this.initialPosition.x;
                this.y = this.initialPosition.y;
                this.rotation = this.initialRotation;
            };
            return Hero;
        }(Pk.PkElement));
        ui.Hero = Hero;
    })(ui = GameBase.ui || (GameBase.ui = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Icon = (function (_super) {
        __extends(Icon, _super);
        function Icon(game, iconKey) {
            var _this = _super.call(this, game) || this;
            _this.inOutTime = 500;
            _this.iconKey = iconKey;
            return _this;
        }
        Icon.prototype.create = function (startShow) {
            if (startShow === void 0) { startShow = true; }
            this.body = this.game.add.sprite(0, 0, this.iconKey);
            this.add(this.body);
            if (startShow)
                this.in();
            //
        };
        Icon.prototype.playAnimation = function (frameRate) {
            // default Values
            // animation
            this.animation = this.body.animations.add('pulse');
            this.animation.play(frameRate, true); // start pulse animation
        };
        Icon.prototype.in = function () {
            this.addTween(this).from({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.In, true);
        };
        Icon.prototype.out = function () {
            this.addTween(this).to({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.Out, true);
        };
        return Icon;
    }(Pk.PkElement));
    GameBase.Icon = Icon;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var SelectedIcon = (function (_super) {
        __extends(SelectedIcon, _super);
        function SelectedIcon(game, target) {
            var _this = _super.call(this, game) || this;
            _this.inOutTime = 200;
            _this.padding = 10;
            _this.target = target;
            return _this;
        }
        SelectedIcon.prototype.create = function () {
            // get create 4 squares | 2 top, 2 down
            this.topIcons = this.game.add.group();
            this.botIcons = this.game.add.group();
            // create
            var topLeft = this.game.add.sprite(0, 0, 'selected-icon');
            var topRight = this.game.add.sprite(0, 0, 'selected-icon');
            var botLeft = this.game.add.sprite(0, 0, 'selected-icon');
            var botRight = this.game.add.sprite(0, 0, 'selected-icon');
            // animation
            topLeft.animations.add('pulse').play(10, true);
            topRight.animations.add('pulse').play(10, true);
            botLeft.animations.add('pulse').play(10, true);
            botRight.animations.add('pulse').play(10, true);
            // pos
            botRight.scale.x = topRight.scale.x = -1;
            botRight.x = topRight.x = this.target.width + this.padding;
            this.topIcons.add(topLeft);
            this.topIcons.add(topRight);
            this.botIcons.add(botLeft);
            this.botIcons.add(botRight);
            // pos above char
            this.topIcons.y -= this.topIcons.height / 2;
            this.botIcons.x = this.topIcons.x = this.target.width / 2 - (this.topIcons.width / 2);
            // pos below char
            this.botIcons.y = this.target.height;
            this.botIcons.y -= this.padding;
            // save init cords
            this.initialPosTop = new Phaser.Point(this.topIcons.x, this.topIcons.y);
            this.initialPosBot = new Phaser.Point(this.botIcons.x, this.botIcons.y);
            this.add(this.topIcons);
            this.add(this.botIcons);
            this.alpha = 0;
        };
        SelectedIcon.prototype.in = function () {
            this.alpha = 1;
            this.addTween(this).from({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.In, true);
            this.topIcons.position.y = this.initialPosTop.y;
            this.addTween(this.topIcons).from({
                y: this.initialPosTop.y - 10
            }, this.inOutTime, Phaser.Easing.Back.In, true);
            this.botIcons.position.y = this.initialPosBot.y;
            this.addTween(this.botIcons).from({
                y: this.initialPosBot.y + 10
            }, this.inOutTime, Phaser.Easing.Back.In, true);
        };
        SelectedIcon.prototype.out = function () {
            this.addTween(this).to({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.Out, true);
            this.addTween(this.topIcons).to({
                y: this.initialPosTop.y - 10
            }, this.inOutTime, Phaser.Easing.Back.Out, true);
            this.addTween(this.botIcons).to({
                y: this.initialPosBot.y + 10
            }, this.inOutTime, Phaser.Easing.Back.Out, true);
        };
        return SelectedIcon;
    }(Pk.PkElement));
    GameBase.SelectedIcon = SelectedIcon;
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
var Pk;
(function (Pk) {
    var PkLayer = (function (_super) {
        __extends(PkLayer, _super);
        function PkLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.distance = 1; // use for parallax effect
            return _this;
        }
        return PkLayer;
    }(Pk.PkElement));
    Pk.PkLayer = PkLayer;
})(Pk || (Pk = {}));
/// <reference path='../event/PkEvent.ts' />
/// <reference path='../PkGame.ts' />
/// <reference path='PkLayer.ts' />
var Pk;
(function (Pk) {
    var PkParallax = (function () {
        function PkParallax(state) {
            this.layers = [];
            this.state = state;
        }
        PkParallax.prototype.add = function (element, distance, cameraLock) {
            if (cameraLock === void 0) { cameraLock = true; }
            // if using TileSprite, distance is mandatary
            if (element instanceof Phaser.TileSprite && !distance)
                throw new Error("If you use TileSprite for parallax, distance param is mandatory");
            //
            if (element instanceof Pk.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof Pk.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof Phaser.TileSprite && cameraLock)
                element.fixedToCamera = true;
            //
            this.layers.push({
                tileElement: element instanceof Phaser.TileSprite ? element : null,
                layerElement: element instanceof Pk.PkLayer ? element : null,
                distance: element instanceof Pk.PkLayer ? element.distance : distance
            });
        };
        PkParallax.prototype.update = function () {
            for (var i in this.layers) {
                // if is tile sprite element
                if (this.layers[i].tileElement) {
                    var posX = 1 / this.layers[i].distance;
                    this.layers[i].tileElement.tilePosition.x = -this.state.game.camera.x * posX;
                    this.layers[i].tileElement.tilePosition.y = -this.state.game.camera.y * posX;
                }
                // if is layer
                if (this.layers[i].layerElement) {
                    // @todo
                }
            }
            ;
        };
        return PkParallax;
    }());
    Pk.PkParallax = PkParallax;
})(Pk || (Pk = {}));
//# sourceMappingURL=app.js.map