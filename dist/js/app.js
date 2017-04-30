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
            Pk.PkEvent.events.push(this);
        }
        PkEvent.ignoreContext = function (context) {
            for (var i = 0; i < Pk.PkEvent.events.length; i++) {
                var event = Pk.PkEvent.events[i];
                var listeners = Pk.PkEvent.events[i].listeners;
                var tmpListeners = [];
                for (var j = 0; j < listeners.length; j++) {
                    var listener = listeners[j];
                    if (!listener.context.event) {
                        tmpListeners.push(listener);
                        continue;
                    }
                    if (listener.context.event.id !== context.event.id) {
                        tmpListeners.push(listener);
                    }
                    else {
                        // console.debug('ignore context:', context)
                    }
                }
                Pk.PkEvent.events[i].listeners = tmpListeners;
            }
        };
        PkEvent.prototype.add = function (key, callBack, context) {
            var context = context || {};
            var exist = false;
            // verifica se já não foi add
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].callBack.toString() === callBack.toString()
                    &&
                        this.listeners[i].context === context) {
                    exist = true;
                    break;
                }
            }
            ;
            if (!exist)
                this.listeners.push({ key: key, callBack: callBack, context: context });
            //
        };
        PkEvent.prototype.clear = function (key) {
            // clear all
            if (!key) {
                this.listeners = [];
            }
            else {
                var tmpListeners = [];
                for (var i = 0; i < this.listeners.length; i++) {
                    if (key != this.listeners[i].key) {
                        tmpListeners.push(this.listeners[i]);
                    }
                }
                this.listeners = tmpListeners;
                return;
            }
        };
        PkEvent.prototype.dispatch = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.target.name == 'Lizzard') {
                // console.debug('dispath lizzard event:', key)
            }
            for (var i = 0; i < this.listeners.length; i++) {
                if (key == this.listeners[i].key) {
                    var data = {
                        target: this.target // ho dispatch the event
                    };
                    // se houver contexto, manda pelo contexto
                    if (this.listeners[i].context) {
                        (_a = this.listeners[i].callBack).call.apply(_a, [this.listeners[i].context, data].concat(args));
                        continue;
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
    PkEvent.events = [];
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
            // stop all tweens
            for (var i = this.tweens.length - 1; i >= 0; i--)
                this.tweens[i].stop();
            //
            // clear all events propagation many-to-many
            this.event.clear();
            Pk.PkEvent.ignoreContext(this);
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
        PkState.prototype.getLayer = function (layerName) {
            for (var i = 0; i < this.layers.length; i++)
                if (this.layers[i].name == layerName)
                    return this.layers[i];
            //
            return null;
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
            _this.state.add('GameOver', GameBase.GameOver);
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
            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js');
            // intro
            this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            this.load.image('intro-1', 'assets/states/intro/images/1.jpg');
            this.load.image('intro-2', 'assets/states/intro/images/2.jpg');
            this.load.image('intro-3', 'assets/states/intro/images/3.jpg');
            // battle :: ANW2683_06_Runway-To-Ignition.mp3
            this.load.audio('battle-sound', 'assets/states/main/audio/battle.mp3');
            // sounds fx
            this.load.audio('a-hero-selected', 'assets/default/audio/fx/a_selecao.wav');
            this.load.audio('a-hero-menu', 'assets/default/audio/fx/a_menuchar.wav');
            this.load.audio('a-hero-attack-selected', 'assets/default/audio/fx/a_selGolpe.wav');
            this.load.audio('a-enemy-die', 'assets/default/audio/fx/a_golpe.wav');
            // particles
            this.load.image('particle-1', 'assets/states/main/images/particles/p1.png');
            this.load.image('particle-2', 'assets/states/main/images/particles/p2.png');
            this.load.image('particle-3', 'assets/states/main/images/particles/p3.png');
            this.load.image('particle-4', 'assets/states/main/images/particles/p4.png');
            this.load.image('particle-5', 'assets/states/main/images/particles/p5.png');
            // chars
            this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
            this.load.spritesheet('char2-idle', 'assets/default/images/chars/heroes/2/iddle.png', 138, 166, 12);
            this.load.spritesheet('char3-idle', 'assets/default/images/chars/heroes/3/iddle.png', 180, 245, 12);
            this.load.spritesheet('char4-idle', 'assets/default/images/chars/heroes/4/iddle.png', 211, 204, 12);
            // icons
            this.load.image('heath-icon', 'assets/default/images/ui/ico-health.png');
            this.load.image('health-icon-large', 'assets/default/images/ui/ico-health-large.png');
            this.load.image('stamina-icon', 'assets/default/images/ui/ico-stamina.png');
            this.load.image('stamina-icon-large', 'assets/default/images/ui/ico-stamina-large.png');
            this.load.image('mana-icon', 'assets/default/images/ui/ico-mana.png');
            this.load.image('mana-icon-large', 'assets/default/images/ui/ico-mana-large.png');
            // ui hero
            this.load.image('ui-hero-1-on', 'assets/default/images/chars/heroes/1/ui-on.png');
            this.load.image('ui-hero-2-on', 'assets/default/images/chars/heroes/2/ui-on.png');
            this.load.image('ui-hero-3-on', 'assets/default/images/chars/heroes/3/ui-on.png');
            this.load.image('ui-hero-4-on', 'assets/default/images/chars/heroes/4/ui-on.png');
            this.load.image('ui-hero-1-selected', 'assets/default/images/chars/heroes/1/selected.png');
            this.load.image('ui-hero-2-selected', 'assets/default/images/chars/heroes/2/selected.png');
            this.load.image('ui-hero-3-selected', 'assets/default/images/chars/heroes/3/selected.png');
            this.load.image('ui-hero-4-selected', 'assets/default/images/chars/heroes/4/selected.png');
            this.load.image('ui-hero-1-off', 'assets/default/images/chars/heroes/1/ui-off.png');
            this.load.image('ui-hero-2-off', 'assets/default/images/chars/heroes/2/ui-off.png');
            this.load.image('ui-hero-3-off', 'assets/default/images/chars/heroes/3/ui-off.png');
            this.load.image('ui-hero-4-off', 'assets/default/images/chars/heroes/4/ui-off.png');
            this.load.image('ui-hero-revive', 'assets/default/images/ui/a-blessed.png');
            // ui hero attacks
            this.load.image('ui-hero-attacks-bg-1', 'assets/default/images/ui/b-large-bg.png');
            this.load.image('ui-hero-attack-bg-' + GameBase.E.AttributeType.MANA, 'assets/default/images/ui/b-spell-bg-mana.png');
            this.load.image('ui-hero-attack-bg-' + GameBase.E.AttributeType.STAMINA, 'assets/default/images/ui/b-spell-bg-stamina.png');
            this.load.image('ui-hero-attack-calculate', 'assets/default/images/ui/s-calculate.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.DIVI, 'assets/default/images/ui/b-i-div.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MULT, 'assets/default/images/ui/b-i-multi.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.PLUS, 'assets/default/images/ui/b-i-soma.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MINU, 'assets/default/images/ui/b-i-sub.png');
            this.load.image('ui-enemy-value-bg', 'assets/default/images/ui/b-monster-bg.png');
            this.load.image('reload-box', 'assets/default/images/ui/reload-box.png');
            // monster
            this.load.spritesheet('monster1-idle', 'assets/default/images/chars/enemies/1/idle.png', 350, 480, 1);
            this.load.spritesheet('monster2-idle', 'assets/default/images/chars/enemies/2/idle.png', 588, 392, 15);
            this.load.spritesheet('monster3-idle', 'assets/default/images/chars/enemies/3/idle.png', 300, 500, 1);
            this.load.spritesheet('monster4-idle', 'assets/default/images/chars/enemies/4/idle.png', 500, 550, 1);
            // battle
            this.load.image('level-flag', 'assets/default/images/ui/d-flag.png');
            this.load.image('endturn-button', 'assets/default/images/ui/d-bg-over.png');
            // main
            this.load.image('main-bg', 'assets/states/main/images/bg/s-background.png');
            this.load.image('main-bridge-back', 'assets/states/main/images/bg/s-bridge-back.png');
            this.load.image('main-bridge-front', 'assets/states/main/images/bg/s-bridge-front.png');
            // op icons
            // this.load.spritesheet('operator-icon-' + E.Operator.MULT, 'assets/default/images/operator-icon-mult.png', 15, 15, 3);
            // this.load.spritesheet('operator-icon-' + E.Operator.PLUS, 'assets/default/images/operator-icon-plus.png', 15, 15, 3);
            // this.load.spritesheet('operator-icon-' + E.Operator.MINU, 'assets/default/images/operator-icon-min.png', 15, 15, 3);
            // this.load.spritesheet('operator-icon-' + E.Operator.DIVI, 'assets/default/images/operator-icon-div.png', 15, 15, 3);
        };
        Loader.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        return Loader;
    }(Pk.PkLoader));
    GameBase.Loader = Loader;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Attack = (function () {
        function Attack(game, value, energyCost, operator, energyType, name, description, icon) {
            if (name === void 0) { name = "Attack Name"; }
            if (description === void 0) { description = "Attack description. Bla Bla Bla Bla"; }
            if (icon === void 0) { icon = null; }
            // values
            this.name = name;
            this.value = value;
            this.energyCost = energyCost;
            this.operator = operator;
            // meta info
            this.description = description;
            this.icon = icon;
            this.energyType = energyType;
        }
        return Attack;
    }());
    GameBase.Attack = Attack;
    var E;
    (function (E) {
        var AttackEvent;
        (function (AttackEvent) {
            AttackEvent.OnAttackResolve = "OnAttackResolve";
        })(AttackEvent = E.AttackEvent || (E.AttackEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
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
            return Regular;
        }(GameBase.Attack));
        Attacks.Regular = Regular;
    })(Attacks = GameBase.Attacks || (GameBase.Attacks = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Battle = (function () {
        function Battle(game, state, level) {
            this.turn = 1;
            this.heroes = [];
            this.enemies = [];
            this.finished = false;
            this.game = game;
            this.level = level;
            this.state = state;
            this.event = new Pk.PkEvent('element-event-battle', this);
        }
        Battle.prototype.create = function (uiLayerKey, blockLayerKey) {
            var _this = this;
            // level flag
            this.levelFlag = new GameBase.LevelFlag(this.game);
            this.levelFlag.create();
            // end turn button
            this.endTurnButton = new GameBase.EndTurnButton(this.game);
            this.endTurnButton.create();
            this.endTurnButton.event.add(GameBase.E.ButtonEvent.OnClick, function () {
                _this.endTurn();
            }, this);
            // create a blank sprite for block input
            this.blockBg = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height);
            this.blockBg.alpha = 0;
            this.blockBg.inputEnabled = true;
            this.blockBg.visible = false;
            // add to layers
            this.state.addToLayer(uiLayerKey, this.levelFlag);
            this.state.addToLayer(uiLayerKey, this.endTurnButton);
            this.state.addToLayer(blockLayerKey, this.blockBg);
        };
        // init battle
        Battle.prototype.start = function () {
            var _this = this;
            // show level flag
            this.levelFlag.show(this.level);
            console.log('start battle level:', this.level);
            this.heroes.forEach(function (hero) {
                // show heroes
                hero.ui.visible = hero.visible = true;
                // set targets :: temp
                if (_this.enemies.length) {
                    hero.target = _this.enemies[0];
                    _this.enemies[0].targets.push(hero);
                }
                // event handlers
                hero.event.add(GameBase.E.HeroEvent.OnHeroAttack, function (event, a, e) {
                    var hero = event.target;
                    var attack = a;
                    var enemy = e;
                    _this.playHeroAttack(hero, attack, enemy);
                }, _this);
                hero.event.add(GameBase.E.HeroEvent.OnHeroReload, function (event) {
                    // if all move, auto click end turn button
                    _this.checkIfAllHeroesMove();
                }, _this);
            });
            // show enemies
            this.enemies.forEach(function (enemy) {
                enemy.ui.visible = enemy.visible = true;
                enemy.event.add(GameBase.E.EnemyEvent.OnEnemyResolve, function () {
                    _this.checkEndBattle();
                }, _this);
            });
            // show turn button
            this.endTurnButton.in();
            this.event.add(GameBase.E.BattleEvent.OnEndTurn, this.nextTurn, this);
        };
        Battle.prototype.playHeroAttack = function (hero, attack, enemy) {
            var _this = this;
            // create calculation splash
            var hac = new GameBase.HeroAttackCalculation(this.game, attack, enemy);
            hac.create();
            this.blockBg.visible = true;
            // event
            hac.event.add(GameBase.E.HeroAttackCalculation.End, function () {
                if (!enemy.alive) {
                    console.log('play dead animation--');
                    enemy.playDeadAnimation();
                    enemy.event.add(GameBase.E.EnemyEvent.OnEnemyDieAnimationEnd, function () {
                        _this.blockBg.visible = false;
                        if (_this.checkEndBattle())
                            return;
                        //
                        // if all move, auto click end turn button
                        _this.checkIfAllHeroesMove();
                    }, _this);
                }
                else {
                    _this.blockBg.visible = false;
                    if (_this.checkEndBattle())
                        return;
                    //
                    // if all move, auto click end turn button
                    _this.checkIfAllHeroesMove();
                }
            }, this);
            // play animation
            setTimeout(function () {
                hac.show();
                //
            }, 700);
        };
        Battle.prototype.addHero = function (hero) {
            hero.ui.visible = hero.visible = false;
            this.heroes.push(hero);
        };
        Battle.prototype.addEnemy = function (enemy) {
            enemy.ui.visible = enemy.visible = false;
            this.enemies.push(enemy);
        };
        Battle.prototype.checkEndBattle = function () {
            var allEnemiesDie = true;
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i].alive) {
                    allEnemiesDie = false;
                    break;
                }
            }
            if (allEnemiesDie) {
                // last param is win/lost battle
                this.endBattle(true);
                return true;
            }
            var allHeroesDie = true;
            for (var i = 0; i < this.heroes.length; i++) {
                if (this.heroes[i].alive) {
                    allHeroesDie = false;
                    break;
                }
            }
            if (allHeroesDie) {
                // last param is win/lost battle
                this.endBattle(false);
                return true;
            }
            return false;
        };
        Battle.prototype.checkIfAllHeroesMove = function () {
            // if all heroes move
            var allHeroesMove = true;
            for (var i = 0; i < this.heroes.length; i++)
                if (!this.heroes[i].turnMove)
                    return;
            //
            this.endTurnButton.event.dispatch(GameBase.E.ButtonEvent.OnClick);
        };
        Battle.prototype.endBattle = function (win) {
            // remove enemy hero target
            this.heroes.forEach(function (hero) {
                // hide heroes
                hero.visible = false;
                // remove hero target
                hero.target = null;
                // reset heroes move, if alive 
                if (hero.alive)
                    hero.setTurnMove(false);
                //
            });
            // remove enemies and heores
            /*
            for (var i = 0; i < this.enemies.length; i++)
                this.enemies[i].destroy();
            //
            */
            // remove nextTurn button
            this.endTurnButton.out();
            this.finished = true;
            // dispatch end battle event
            this.event.dispatch(GameBase.E.BattleEvent.OnBattleEnd, win);
            // block events
            this.event.clear();
            Pk.PkEvent.ignoreContext(this);
        };
        Battle.prototype.endTurn = function () {
            // hide end turn button
            this.endTurnButton.out();
            // enemies move
            this.enemiesMove();
            this.heroes.forEach(function (hero) {
                // check turn move for all
                hero.setTurnMove(true);
                hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
            });
        };
        Battle.prototype.nextTurn = function () {
            console.log('---- next turn ----');
            // reset moves
            this.enemies.forEach(function (enemy) {
                enemy.setTurnMove(false);
            });
            this.heroes.forEach(function (hero) {
                // if has health
                if (hero.ui.getHealth())
                    hero.setTurnMove(false);
                else
                    hero.dieResolve();
                //
            });
            // add turn counter
            this.turn++;
            // show turn end button
            this.endTurnButton.in();
        };
        Battle.prototype.enemiesMove = function () {
            var _this = this;
            // check if has any enemy
            if (!this.enemies.length) {
                this.event.dispatch(GameBase.E.BattleEvent.OnEndTurn);
                return;
            }
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                // if not move yet, attack
                if (!enemy.turnMove) {
                    // wait for atack and call next one
                    enemy.event.add(GameBase.E.EnemyEvent.OnEnemyResolve, function () {
                        // call next
                        _this.enemiesMove();
                    }, this);
                    enemy.attack();
                    return;
                }
            }
            // if all move
            this.event.dispatch(GameBase.E.BattleEvent.OnEndTurn);
        };
        Battle.prototype.reset = function () {
            // reset turn
            this.turn = 1;
            // reset heroes
            // reset enemies 
        };
        return Battle;
    }());
    GameBase.Battle = Battle;
    var E;
    (function (E) {
        var BattleEvent;
        (function (BattleEvent) {
            BattleEvent.OnBattleStart = "OnBattleStart";
            BattleEvent.OnBattleEnd = "OnBattleEnd";
            BattleEvent.OnEndTurn = "OnEndTurn";
        })(BattleEvent = E.BattleEvent || (E.BattleEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
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
            _this.turnMove = false;
            _this.side = Side.RIGHT; // sprite side
            _this.animations = [];
            _this.selected = false;
            _this.attacks = [];
            _this.attackOpenDelay = 100;
            var bodySprite = Pk.PkUtils.createSquare(game, body.width, body.height);
            bodySprite.alpha = .0;
            _this.setBody(bodySprite);
            // saturation filter
            _this.saturationFilter = _this.game.add.filter('Gray');
            _this.saturationFilter.uniforms.gray.value = 0.0; // default: no filter intensit 
            return _this;
        }
        Char.prototype.addAnimation = function (sprite, animationKey, fps) {
            if (fps === void 0) { fps = 10; }
            var a = sprite.animations.add(animationKey);
            // this.body.addChild(sprite);
            this.add(sprite);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;
            sprite.x = this.body.width / 2;
            sprite.y = this.body.height; // + 40; 
            // add saturation filter
            // sprite.filters = [this.saturationFilter];
            this.animations.push({
                animation: a,
                sprite: sprite
            });
            if (!this.currentAnimation) {
                this.currentAnimation = this.animations[0];
            }
            return sprite;
        };
        Char.prototype.playAnimation = function (key, fps, loop) {
            var _this = this;
            if (fps === void 0) { fps = 10; }
            if (loop === void 0) { loop = true; }
            this.animations.forEach(function (element) {
                element.animation.stop();
                element.sprite.alpha = 0;
                if (element.animation.name == key) {
                    element.animation.play(fps, loop);
                    // element.animation.restart();
                    element.sprite.alpha = 1;
                    _this.currentAnimation = element;
                }
            });
        };
        Char.prototype.create = function () {
            this.selectedIcon = new GameBase.SelectedIcon(this.game, this.body);
            this.selectedIcon.create();
            this.add(this.selectedIcon);
        };
        Char.prototype.setBody = function (body) {
            this.body = body;
            this.add(this.body);
        };
        Char.prototype.addAttack = function (attack) {
            // add attack
            this.attacks.push(attack);
        };
        Char.prototype.setTurnMove = function (v) {
            this.turnMove = v;
            this.event.dispatch(GameBase.E.CharEvent.OnCharTurnMove, this.turnMove);
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
        var CharEvent;
        (function (CharEvent) {
            CharEvent.OnCharTurnMove = "OnCharTurnMove";
        })(CharEvent = E.CharEvent || (E.CharEvent = {}));
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
            _this.lastValue = 0;
            _this.level = 1;
            _this.targets = [];
            _this.ui = new GameBase.ui.Enemy(_this.game, _this);
            _this.identification = id;
            _this.lastValue = _this.value = value;
            GameBase.Enemy.enemies.push(_this);
            return _this;
        }
        Enemy.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.ui.create();
            // attack resolve handler
            this.event.add(GameBase.E.AttackEvent.OnAttackResolve, function (target, h, a) {
                var hero = h;
                var attack = a;
                _this.resolveAttack(hero, attack);
            }, this);
            // audio
            this.audioDie = this.game.add.audio('a-enemy-die');
        };
        Enemy.prototype.resolveAttack = function (hero, attack) {
            console.log('hero[' + hero.name + '] attack [' + this.name + ']');
            switch (attack.operator) {
                case GameBase.E.Operator.PLUS:
                    this.setValue(this.value + attack.value);
                    break;
                case GameBase.E.Operator.MINU:
                    this.setValue(this.value - attack.value);
                    break;
                case GameBase.E.Operator.DIVI:
                    this.setValue(this.value / attack.value);
                    break;
                case GameBase.E.Operator.MULT:
                    this.setValue(this.value * attack.value);
                    break;
            }
            // check if die
            if (this.value == 42)
                this.die(false);
            //
        };
        Enemy.prototype.playDeadAnimation = function (dispatchDieEvent) {
            var _this = this;
            if (dispatchDieEvent === void 0) { dispatchDieEvent = true; }
            this.currentAnimation.animation.stop();
            //
            // "remove" ui
            this.addTween(this.ui).to({ alpha: 0, y: -15 }, 100).start();
            var step = { v: 0 };
            var t = this.addTween(step).to({
                v: 100
            }, 400, Phaser.Easing.Default, true);
            // tint to black
            var startColor = 0xffffff;
            var endColor = 0x000000;
            t.onUpdateCallback(function () {
                _this.currentAnimation.sprite.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, step.v);
            }, this);
            // bug fix
            t.onComplete.add(function () {
                _this.currentAnimation.sprite.tint = endColor;
            }, this);
            // final value text
            var finalText = this.game.add.text(0, 0, this.value.toString(), {
                font: "138px StrangerBack",
                fill: "#edddd0"
            });
            // pos / add
            finalText.anchor.set(.5, .5);
            finalText.x = this.body.width / 2;
            finalText.y = this.body.height / 2;
            this.add(finalText);
            finalText.scale.set(3, 3);
            // splash nunber
            this.addTween(finalText.scale).to({
                x: 1,
                y: 1,
            }, 600, Phaser.Easing.Elastic.Out, true).onComplete.add(function () {
                // camera shake
                _this.game.camera.shake(0.03, 100);
                // play fx
                _this.audioDie.play();
                _this.addTween(_this).to({ alpha: 0 }, 300, Phaser.Easing.Default, true).onComplete.add(function () {
                    // dispatch dead event
                    if (dispatchDieEvent)
                        _this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyDieAnimationEnd);
                    //
                    _this.destroy();
                }, _this);
            }, this);
        };
        Enemy.prototype.die = function (playDeadAnimation) {
            if (playDeadAnimation === void 0) { playDeadAnimation = true; }
            // set as dead
            this.alive = false;
            if (playDeadAnimation) {
                this.playDeadAnimation(true);
                return;
            }
            // dispatch dead event
            this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyDie);
        };
        Enemy.prototype.attack = function () {
            var _this = this;
            this.setTurnMove(true);
            // attack only living heroes
            var standHeroes = [];
            this.targets.forEach(function (hero) {
                // check if is alive
                if (hero.ui.getHealth())
                    standHeroes.push(hero);
                //
            });
            // if all heroes die, pass turn
            if (!standHeroes.length) {
                // wait a little time
                setTimeout(function () {
                    _this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve);
                }, 1500);
                return;
            }
            // select a random hero
            var hero = standHeroes[this.game.rnd.integerInRange(0, standHeroes.length - 1)];
            var damage = this.game.rnd.integerInRange(1, (this.level + 2));
            var damageType;
            // damage = 5;// temp
            // sort damage type
            switch (this.game.rnd.integerInRange(1, 5)) {
                case 1:
                case 2:
                case 3:
                case 4:
                    damageType = GameBase.E.AttackType.HEATH;
                    break;
                case 5:
                    damageType = GameBase.E.AttackType.ENERGY;
                    break;
            }
            // for now all damage on health
            damageType = GameBase.E.AttackType.HEATH;
            // if hero has no energy, change type to heath
            if (damageType == GameBase.E.AttackType.ENERGY
                &&
                    hero.ui.getEnergy() <= 0) {
                damageType = GameBase.E.AttackType.HEATH;
            }
            // cause a random damage
            hero.event.dispatch(GameBase.E.AttackEvent.OnAttackResolve, this, damage, damageType);
            // wait a little and dispatch event
            setTimeout(function () {
                _this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve, damage, damageType, hero);
            }, 1500);
        };
        Enemy.prototype.setValue = function (v) {
            this.lastValue = this.value;
            this.value = Math.round(v);
            this.ui.updateValue();
        };
        Enemy.prototype.destroy = function () {
            // destroy ui
            this.ui.destroy();
            // remove enemies
            this.targets = [];
            _super.prototype.destroy.call(this);
        };
        return Enemy;
    }(GameBase.Char));
    Enemy.enemies = [];
    GameBase.Enemy = Enemy;
    var E;
    (function (E) {
        var EnemyEvent;
        (function (EnemyEvent) {
            EnemyEvent.OnEnemySelected = "OnEnemySelected";
            EnemyEvent.OnEnemyDeselect = "OnEnemyDeselect";
            EnemyEvent.OnEnemyResolve = "OnEnemyResolve";
            EnemyEvent.OnEnemyDie = "OnEnemyDie";
            EnemyEvent.OnEnemyDieAnimationEnd = "OnEnemyDieAnimationEnd";
        })(EnemyEvent = E.EnemyEvent || (E.EnemyEvent = {}));
        var AttackType;
        (function (AttackType) {
            AttackType[AttackType["HEATH"] = 0] = "HEATH";
            AttackType[AttackType["ENERGY"] = 1] = "ENERGY";
        })(AttackType = E.AttackType || (E.AttackType = {}));
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
            _this.selected = false;
            _this.energyType = E.EnergyType.STAMINA;
            _this.target = null;
            _this.dieWaiting = 0;
            _this.dieTime = 5; // qtn of turn hero will wait die
            _this.reviveHealthPoints = 2; // qtn of heath when revive
            _this.reloadEnergyQtn = 2; // how much on reload energy move
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
            // add saturation filter over ui's
            this.ui.filters = [this.saturationFilter];
            this.uiAttack.filters = [this.saturationFilter];
            // selected sprite
            this.selectedSprite = this.game.add.sprite(0, 0, 'ui-hero-' + this.identification + '-selected');
            this.add(this.selectedSprite);
            this.selectedSprite.visible = false;
            // events
            this.body.events.onInputDown.add(function () {
                // deselect all others
                GameBase.Hero.heroes.forEach(function (hero) {
                    if (hero.identification != _this.identification) {
                        hero.selected = false;
                        hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
                    }
                });
                _this.selected = true;
                _this.event.dispatch(GameBase.E.HeroEvent.OnHeroSelected);
            }, this);
            this.event.add(GameBase.E.HeroEvent.OnHeroReloadClick, this.reload, this);
            this.event.add(GameBase.E.HeroEvent.OnHeroAttackClick, function (target, attack) {
                _this.attack(attack);
            }, this);
            // hero end turn
            this.event.add(GameBase.E.CharEvent.OnCharTurnMove, function (t, turnMove) {
                if (turnMove) {
                    // this.body.inputEnabled = this.body.visible = false;
                    _this.saturationFilter.uniforms.gray.value = 0.8;
                }
                else {
                    _this.saturationFilter.uniforms.gray.value = 0.0;
                    // this.body.inputEnabled = this.body.visible = true;
                }
            }, this);
            // attack resolve handler
            this.event.add(GameBase.E.AttackEvent.OnAttackResolve, function (e, enemy, damage, damageType) {
                _this.resolveAttack(enemy, damage, damageType);
            }, this);
            this.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
            this.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);
            this.body.events.onInputOver.add(this.inputOver, this);
            this.body.events.onInputOut.add(this.inputOut, this);
            this.updatePosition();
            // audio
            this.audioOver = this.game.add.audio('a-hero-selected');
        };
        Hero.prototype.updatePosition = function () {
            this.selectedSprite.y = this.body.height - this.selectedSprite.height + 11;
        };
        Hero.prototype.setBody = function (body) {
            _super.prototype.setBody.call(this, body);
            // mouse over check
            this.body.inputEnabled = true;
        };
        Hero.prototype.inputOut = function () {
            if (!this.selected)
                this.selectedSprite.visible = false;
            //
        };
        Hero.prototype.inputOver = function () {
            this.selectedSprite.visible = true;
            this.audioOver.play();
        };
        Hero.prototype.heroDeselect = function () {
            this.selectedSprite.visible = false;
        };
        Hero.prototype.heroSelectd = function () {
            this.selectedSprite.visible = true;
        };
        Hero.prototype.die = function () {
            // make sure hero is realy dead
            if (this.ui.getHealth())
                this.ui.removeHealth(this.healthMax);
            //
            // set turn move
            if (!this.turnMove)
                this.setTurnMove(true);
            //
            // play die animation 
            // ...
            // qtn of turn hero will wait die
            this.dieWaiting += this.dieTime;
            this.alive = false;
            console.log('[' + this.name + '] DIE.. waiting for [' + this.dieTime + '] turns for revive!');
            // dispatch die event
            this.event.dispatch(GameBase.E.HeroEvent.OnHeroDie);
        };
        // if die, wait for 2 turns and return with 2 health points
        Hero.prototype.dieResolve = function () {
            if (!this.dieWaiting) {
                this.revive();
                return;
            }
            // count
            this.dieWaiting--;
        };
        Hero.prototype.revive = function () {
            console.log('[' + this.name + '] revive with [' + this.reviveHealthPoints + '] health points');
            this.setTurnMove(false);
            this.ui.addHealth(this.reviveHealthPoints);
            this.alive = true;
        };
        Hero.prototype.attack = function (attack) {
            // check turn move
            if (this.turnMove)
                return;
            //
            // check target
            if (!this.target)
                return;
            //
            this.target.event.dispatch(GameBase.E.AttackEvent.OnAttackResolve, this, attack);
            // remove attack energy
            this.ui.removeEnergy(attack.energyCost);
            this.setTurnMove(true);
            // play attack animation
            this.playAttack(attack, this.target);
        };
        Hero.prototype.playAttack = function (attack, enemy) {
            // play hero attack
            // @todo
            // call move/attack events
            this.event.dispatch(GameBase.E.HeroEvent.OnHeroMove);
            this.event.dispatch(GameBase.E.HeroEvent.OnHeroAttack, attack, this.target);
        };
        Hero.prototype.resolveAttack = function (enemy, damage, damageType) {
            // cause damage
            console.log('enemy[' + enemy.name + '] attack [' + this.name + ']');
            switch (damageType) {
                case GameBase.E.AttackType.HEATH:
                    console.log('cause [' + damage + '] damage on [health]');
                    this.ui.removeHealth(damage);
                    break;
                case GameBase.E.AttackType.ENERGY:
                    console.log('cause [' + damage + '] damage on [energy]');
                    this.ui.removeEnergy(damage);
                    break;
            }
            // if has no health points
            if (!this.ui.getHealth())
                this.die();
            //
        };
        Hero.prototype.reload = function () {
            // check turn move
            if (this.turnMove)
                return;
            //
            // reload energy
            this.ui.addEnergy(this.reloadEnergyQtn);
            this.setTurnMove(true);
            // call move/attack events
            this.event.dispatch(GameBase.E.HeroEvent.OnHeroMove);
            this.event.dispatch(GameBase.E.HeroEvent.OnHeroReload);
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
        var AttributeType;
        (function (AttributeType) {
            AttributeType[AttributeType["STAMINA"] = 0] = "STAMINA";
            AttributeType[AttributeType["MANA"] = 1] = "MANA";
            AttributeType[AttributeType["HEALTH"] = 2] = "HEALTH";
        })(AttributeType = E.AttributeType || (E.AttributeType = {}));
        var HeroEvent;
        (function (HeroEvent) {
            HeroEvent.OnHeroSelected = "OnHeroSelected";
            HeroEvent.OnHeroDeselect = "OnHeroDeselect";
            HeroEvent.OnHeroMove = "OnHeroMove";
            HeroEvent.OnHeroDie = "OnHeroDie";
            HeroEvent.OnHeroAttackClick = "OnHeroAttackClick";
            HeroEvent.OnHeroReloadClick = "OnHeroReloadClick";
            HeroEvent.OnHeroAttack = "OnHeroAttack";
            HeroEvent.OnHeroReload = "OnHeroReload";
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
            // name
            _this.name = "Druid";
            // die turns
            _this.dieTime = 8;
            // revive health
            _this.reviveHealthPoints = 3;
            _this.reloadEnergyQtn = 3;
            return _this;
        }
        Druid.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 2;
            var attack2 = new GameBase.Attacks.Regular(this.game, GameBase.E.Operator.MINU, this.energyType);
            attack2.energyCost = 4;
            attack2.value = 2;
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 3;
            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'iddle');
            // aniSprite.y+=26; // padding sprite adjust
            this.playAnimation('iddle', 11);
            this.currentAnimation.animation.frame = 2;
            _super.prototype.create.call(this);
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
            // name
            _this.name = "Knight";
            // die turns
            _this.dieTime = 2;
            // revive health
            _this.reviveHealthPoints = 4;
            _this.reloadEnergyQtn = 2;
            return _this;
        }
        Knight.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 1;
            var attack2 = new GameBase.Attacks.Regular(this.game, GameBase.E.Operator.MINU, this.energyType);
            attack2.energyCost = 4;
            attack2.value = 3;
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 15;
            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'iddle');
            aniSprite.y += 18; // padding sprite adjust
            this.playAnimation('iddle', 12);
            this.currentAnimation.animation.frame = 6;
            _super.prototype.create.call(this);
        };
        return Knight;
    }(GameBase.Hero));
    GameBase.Knight = Knight;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Priest = (function (_super) {
        __extends(Priest, _super);
        function Priest(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 84, 230), 3) || this;
            // energy type
            _this.energyType = GameBase.E.EnergyType.MANA;
            // operator
            _this.operator = GameBase.E.Operator.DIVI;
            // name
            _this.name = "Priest";
            // die turns
            _this.dieTime = 9;
            // revive health
            _this.reviveHealthPoints = 2;
            _this.reloadEnergyQtn = 4;
            return _this;
        }
        Priest.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 3;
            attack1.value = 2;
            var attack2 = new GameBase.Attacks.Regular(this.game, GameBase.E.Operator.PLUS, this.energyType);
            attack2.energyCost = 4;
            attack2.value = 2;
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 3;
            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'iddle');
            // aniSprite.y+=16;
            this.playAnimation('iddle', 9);
            this.currentAnimation.animation.frame = 7;
            _super.prototype.create.call(this);
        };
        return Priest;
    }(GameBase.Hero));
    GameBase.Priest = Priest;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Thief = (function (_super) {
        __extends(Thief, _super);
        function Thief(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 154, 163), 2) || this;
            // energy type
            _this.energyType = GameBase.E.EnergyType.STAMINA;
            // operator
            _this.operator = GameBase.E.Operator.MINU;
            // name
            _this.name = "Thief";
            // die turns
            _this.dieTime = 4;
            // revive health
            _this.reviveHealthPoints = 1;
            _this.reloadEnergyQtn = 4;
            return _this;
        }
        Thief.prototype.create = function () {
            // add attacks
            var attack1 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 1;
            var attack2 = new GameBase.Attacks.Regular(this.game, GameBase.E.Operator.PLUS, this.energyType);
            attack2.energyCost = 4;
            attack2.value = 3;
            var attack3 = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 15;
            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char' + this.identification + '-idle'), 'iddle');
            // aniSprite.y+=18; // padding sprite adjust
            this.playAnimation('iddle', 16);
            this.currentAnimation.animation.frame = 10;
            _super.prototype.create.call(this);
        };
        return Thief;
    }(GameBase.Hero));
    GameBase.Thief = Thief;
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Devil = (function (_super) {
        __extends(Devil, _super);
        function Devil(game) {
            var _this = 
            // /4, -15, +5 = 42
            _super.call(this, game, new Phaser.Rectangle(0, 0, 409, 444), 4, 208) || this;
            // name
            _this.name = "Devil";
            _this.level = 4;
            return _this;
        }
        Devil.prototype.create = function () {
            _super.prototype.create.call(this);
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster' + this.identification + '-idle'), 'idle');
            aniSprite.y += 71; // padding sprite adjust
        };
        return Devil;
    }(GameBase.Enemy));
    GameBase.Devil = Devil;
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Ghost = (function (_super) {
        __extends(Ghost, _super);
        function Ghost(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 220, 371), 3, 73) || this;
            // name
            _this.name = "Ghost";
            _this.level = 3;
            return _this;
        }
        Ghost.prototype.create = function () {
            _super.prototype.create.call(this);
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster' + this.identification + '-idle'), 'idle');
            aniSprite.y += 102; // padding sprite adjust
        };
        return Ghost;
    }(GameBase.Enemy));
    GameBase.Ghost = Ghost;
})(GameBase || (GameBase = {}));
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Lizzard = (function (_super) {
        __extends(Lizzard, _super);
        function Lizzard(game) {
            var _this = 
            // 22 - +1 | x2 = 42
            _super.call(this, game, new Phaser.Rectangle(0, 0, 273, 372), 1, 41) || this;
            // name
            _this.name = "Lizzard";
            _this.level = 1;
            return _this;
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
/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
var GameBase;
(function (GameBase) {
    var Wolf = (function (_super) {
        __extends(Wolf, _super);
        function Wolf(game) {
            var _this = _super.call(this, game, new Phaser.Rectangle(0, 0, 561, 366), 2, 22) || this;
            // name
            _this.name = "Wolf";
            _this.level = 2;
            return _this;
        }
        Wolf.prototype.create = function () {
            _super.prototype.create.call(this);
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster' + this.identification + '-idle'), 'iddle');
            this.playAnimation('iddle', 15);
            aniSprite.y += 10; // padding sprite adjust
        };
        return Wolf;
    }(GameBase.Enemy));
    GameBase.Wolf = Wolf;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameOver.prototype.create = function () {
            console.log('GameOver create');
            // change state bg
            this.game.stage.backgroundColor = "#89aca6";
            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
        };
        GameOver.prototype.render = function () {
            this.game.debug.text('GAME OVER -- press F5 to play again', 35, 35);
        };
        return GameOver;
    }(Pk.PkState));
    GameBase.GameOver = GameOver;
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
            _this.battles = [];
            _this.battleCount = 0;
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
            this.addLayer('block');
            // scene particles
            var front_emitter = this.game.add.emitter(this.game.world.width, -32, 600);
            front_emitter.makeParticles('particle-1');
            front_emitter.maxParticleScale = 0.3;
            front_emitter.minParticleScale = 0.1;
            front_emitter.setYSpeed(20, 60);
            front_emitter.setXSpeed(-20, -100);
            front_emitter.gravity = 0;
            front_emitter.width = this.game.world.width * 1.5;
            front_emitter.minRotation = 0;
            front_emitter.maxRotation = 40;
            front_emitter.start(false, 14000, 60);
            var back_emitter = this.game.add.emitter(this.game.world.width, -32, 600);
            back_emitter.makeParticles('particle-2');
            back_emitter.maxParticleScale = 0.6;
            back_emitter.minParticleScale = 0.1;
            back_emitter.setYSpeed(20, 30);
            back_emitter.setXSpeed(-10, -50);
            back_emitter.gravity = 0;
            back_emitter.width = this.game.world.width * 2.5;
            back_emitter.minRotation = 0;
            back_emitter.maxRotation = 60;
            back_emitter.start(false, 24000, 350);
            // audio
            this.musicBG = this.game.add.audio('battle-sound');
            this.musicBG.onDecoded.add(this.playSound, this); // load
            // stage sprites
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
            // create a enemies
            var lizzard = new GameBase.Lizzard(this.game);
            lizzard.create();
            lizzard.x = this.game.world.width - lizzard.width;
            lizzard.y = 170;
            lizzard.ui.updatePosition();
            var wolf = new GameBase.Wolf(this.game);
            wolf.create();
            wolf.x = this.game.world.width - wolf.body.width;
            wolf.y = 230;
            wolf.ui.updatePosition();
            var ghost = new GameBase.Ghost(this.game);
            ghost.create();
            ghost.x = this.game.world.width - ghost.width;
            ghost.y = 170;
            ghost.ui.updatePosition();
            var devil = new GameBase.Devil(this.game);
            devil.create();
            devil.x = this.game.world.width - devil.width;
            devil.y = 120;
            devil.ui.updatePosition();
            var i = 0;
            this.heroes.forEach(function (hero) {
                // pos
                hero.x = _this.padding;
                if (i > 0) {
                    var lastHero = _this.heroes.getAt(i - 1);
                    hero.x = lastHero.x + lastHero.body.width + _this.charPadding;
                }
                hero.y = _this.game.height - hero.body.height - 195 + (i * 5);
                // pos ui
                if (i > 0)
                    hero.ui.x = lastHero.ui.x + lastHero.ui.width - 10; // WORK
                //
                hero.ui.y = _this.game.world.height - hero.ui.height - _this.padding;
                hero.ui.setAsInitialCords();
                // pos ui
                hero.uiAttack.x = 160 * i - (10 * i);
                hero.uiAttack.y = hero.y - hero.uiAttack.height + 50;
                hero.uiAttack.setAsInitialCords();
                hero.updatePosition();
                // next node
                i++;
            }, this);
            // ???? 
            /*
            druid.ui.x = 0; druid.ui.setAsInitialCords();
            thief.ui.x = 168; thief.ui.setAsInitialCords();
            priest.ui.x = 356; priest.ui.setAsInitialCords();
            knight.ui.x = 454; knight.ui.setAsInitialCords();
            */
            // add chars to layer
            this.addToLayer('chars', this.heroes);
            this.addToLayer('chars', lizzard);
            this.addToLayer('chars', wolf);
            this.addToLayer('chars', ghost);
            this.addToLayer('chars', devil);
            // add hero ui
            this.heroes.forEach(function (hero) {
                _this.addToLayer('ui', hero.ui);
                _this.addToLayer('ui', hero.uiAttack);
            }, this);
            // monster ui
            this.addToLayer('ui', lizzard.ui);
            this.addToLayer('ui', wolf.ui);
            this.addToLayer('ui', ghost.ui);
            this.addToLayer('ui', devil.ui);
            // scenario position
            mainBridgeBack.y = 413;
            mainBridgeFront.y = 510;
            this.addToLayer('stage-back-1', mainBg);
            this.addToLayer('stage-back-2', back_emitter);
            this.addToLayer('stage-back-2', mainBridgeBack);
            this.addToLayer('stage-front-1', mainBridgeFront);
            this.addToLayer('stage-front-1', front_emitter);
            // transition
            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
            // create battles
            var battle1 = new GameBase.Battle(this.game, this, 1);
            battle1.create('ui', 'block');
            // add heroes and enemies
            this.heroes.forEach(function (hero) {
                battle1.addHero(hero);
            }, this);
            battle1.addEnemy(lizzard);
            var battle2 = new GameBase.Battle(this.game, this, 2);
            battle2.create('ui', 'block');
            // add heroes and enemies
            this.heroes.forEach(function (hero) {
                battle2.addHero(hero);
            }, this);
            battle2.addEnemy(wolf);
            var battle3 = new GameBase.Battle(this.game, this, 3);
            battle3.create('ui', 'block');
            // add heroes and enemies
            this.heroes.forEach(function (hero) {
                battle3.addHero(hero);
            }, this);
            battle3.addEnemy(ghost);
            var battle4 = new GameBase.Battle(this.game, this, 4);
            battle4.create('ui', 'block');
            // add heroes and enemies
            this.heroes.forEach(function (hero) {
                battle4.addHero(hero);
            }, this);
            battle4.addEnemy(devil);
            // add battles
            this.battles.push(battle1);
            this.battles.push(battle2);
            this.battles.push(battle3);
            this.battles.push(battle4);
            // start calling battles
            this.callNextBattle();
            setTimeout(function () {
                // lizzard.die();
            }, 1500);
        };
        Main.prototype.playSound = function () {
            // play music
            this.musicBG.fadeIn(1000, true);
        };
        Main.prototype.callNextBattle = function () {
            var _this = this;
            // check if is play all battles
            if (this.battleCount >= this.battles.length) {
                alert('You win all battles!');
                this.transition.change('GameOver');
                return;
            }
            // call next one
            var battle = this.battles[this.battleCount];
            battle.event.add(GameBase.E.BattleEvent.OnBattleEnd, function (event, win) {
                // if win/lose
                if (win) {
                    // add count, call next
                    _this.battleCount++;
                    _this.callNextBattle();
                }
                else {
                    // game over screen
                    _this.transition.change('GameOver');
                }
            }, this);
            // start battle
            battle.start();
        };
        Main.prototype.render = function () {
            // this.game.debug.text('(Main Screen) Press [ENTER] to Menu', 35, 35);
        };
        // calls when leaving state
        Main.prototype.shutdown = function () {
            if (this.musicBG.isPlaying)
                this.musicBG.stop();
            //
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
                    var bg = _this.game.add.sprite(0, 0, 'ui-hero-attack-bg-' + _this.hero.energyType);
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
                    var attackBox = new GameBase.AttackBox(_this.game);
                    // add
                    attackBox.attack = attack;
                    attackBox.add(bg);
                    attackBox.add(textValue);
                    attackBox.add(textEnergy);
                    attackBox.add(operatorIcon);
                    attackBox.setInputElement(bg);
                    attackBox.event.add(GameBase.E.AttackBoxEvent.OnAttackSelect, function () {
                        // if hero already move, ignore action
                        if (_this.hero.turnMove)
                            return;
                        //
                        _this.audioSelect.play();
                        _this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroAttackClick, attack);
                        _this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
                    }, _this);
                    _this.attackBoxes.add(attackBox);
                    // pos
                    attackBox.x = (bg.width + 5) * i;
                    operatorIcon.x = bg.x + bg.width - 10;
                    operatorIcon.y -= 10;
                    textValue.x = operatorIcon.x + 2;
                    textValue.y = bg.y - 10;
                    textEnergy.x = bg.x + 17;
                    textEnergy.y = bg.y + bg.width - textEnergy.height + 10;
                });
                // input events
                reloadBox.inputEnabled = true;
                reloadBox.events.onInputDown.add(function () {
                    // if hero already move, ignore action
                    if (_this.hero.turnMove)
                        return;
                    //
                    _this.audioSelect.play();
                    _this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroReloadClick);
                    _this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
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
                // audio
                this.audioOpen = this.game.add.audio('a-hero-menu');
                this.audioSelect = this.game.add.audio('a-hero-attack-selected');
            };
            Attack.prototype.setAsInitialCords = function () {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            };
            Attack.prototype.heroDeselect = function () {
                this.visible = false;
                this.hero.selected = false;
            };
            Attack.prototype.heroSelectd = function () {
                this.updateView();
                this.visible = true;
                this.resetAttrs();
                this.audioOpen.play();
            };
            Attack.prototype.updateView = function () {
                var _this = this;
                // check attack boxes avaliable
                this.attackBoxes.forEach(function (element) {
                    var attackBox = element;
                    if (attackBox.attack.energyCost > _this.hero.ui.getEnergy()) {
                        attackBox.alpha = 0.5;
                        attackBox.blockInput();
                    }
                    else {
                        attackBox.alpha = 1;
                        attackBox.releaseInput();
                    }
                }, this);
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
                this.textValue = this.game.add.text(0, 0, this.enemy.value.toString(), // text
                this.textStyleValues // font style
                );
                this.textValue.align = "center";
                this.textValue.anchor.set(0.5);
                this.textValue.x = this.bg.width / 2;
                this.textValue.y = this.bg.height / 2;
                // add 
                this.add(this.bg);
                this.add(this.textValue);
                // pos
                this.updatePosition();
            };
            Enemy.prototype.updatePosition = function () {
                // put on head 
                this.x = this.enemy.x;
                this.y = this.enemy.y - this.height;
                this.setAsInitialCords();
            };
            Enemy.prototype.updateValue = function () {
                this.textValue.text = this.enemy.value.toString();
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
        Gaude.prototype.addIcon = function (icon, delay) {
            if (delay === void 0) { delay = 0; }
            icon.create(false);
            // save icon ref
            this.icons.push(icon);
            // add on gaude
            this.add(icon);
            // organize icons pos
            for (var i = 0; i < this.icons.length; i++)
                this.icons[i].x = (this.icons[i].width + this.padding) * i;
            //
            icon.in(delay);
            this.valueMax = this.icons.length;
        };
        Gaude.prototype.getVal = function () {
            return this.icons.length;
        };
        // subtract value
        Gaude.prototype.subVal = function (val) {
            // check
            if (!this.getVal())
                return;
            //
            val = val > this.getVal() ? this.getVal() : val;
            for (var i = 0; i < val; i++)
                this.icons.pop().out(i * 180);
            //
        };
        // add value
        Gaude.prototype.addVal = function (val) {
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
                var _this = this;
                // bg
                this.bg = this.game.add.sprite(0, 0, 'ui-hero-' + this.hero.identification + '-off');
                // gaudes
                this.healthGaude = new GameBase.Gaude(this.game);
                this.energiGaude = new GameBase.Gaude(this.game);
                // add on hero 
                this.add(this.bg);
                this.add(this.healthGaude);
                this.add(this.energiGaude);
                // add bla
                this.addHealth(this.hero.healthMax);
                this.addEnergy(this.hero.energyMax);
                // pos 
                /*
                this.bg.y = this.hero.body.height;
                this.bg.anchor.x = .5;
                this.bg.x = this.hero.body.width / 2;
                */
                // this.healthGaude.x += this.healthGaude.width / 2;
                this.healthGaude.x += 65;
                this.healthGaude.y = this.bg.y + 40;
                this.energiGaude.x = this.healthGaude.x;
                this.energiGaude.y = this.healthGaude.y + this.gaudePadding;
                this.setAsInitialCords();
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);
                // hero end turn
                this.hero.event.add(GameBase.E.CharEvent.OnCharTurnMove, function (t, turnMove) {
                    // if finish turn
                    if (turnMove)
                        _this.heroDeselect();
                    //
                }, this);
            };
            Hero.prototype.addEnergy = function (v) {
                // check energy max 
                if (v + this.energiGaude.getVal() > this.hero.energyMax)
                    v = this.hero.energyMax - this.energiGaude.getVal();
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
                for (var i = 0; i < v; i++)
                    this.energiGaude.addIcon(new GameBase.GaudeIcon(this.game, energyIconKey), i * 80);
                //
                var attrChange = new GameBase.AttributeChange(this.game, this.hero, v, this.hero.energyType, true);
                attrChange.create();
                attrChange.show();
                this.hero.uiAttack.updateView();
            };
            Hero.prototype.addHealth = function (v) {
                // check energy max 
                if (v + this.healthGaude.getVal() > this.hero.energyMax)
                    v = this.hero.healthMax - this.healthGaude.getVal();
                //
                // add heath icons
                for (var i = 0; i < v; i++)
                    this.healthGaude.addIcon(new GameBase.GaudeIcon(this.game, 'heath-icon'), i * 70);
                //
                var attrChange = new GameBase.AttributeChange(this.game, this.hero, v, GameBase.E.AttributeType.HEALTH, true);
                attrChange.create();
                attrChange.show();
                this.hero.uiAttack.updateView();
            };
            Hero.prototype.removeEnergy = function (val) {
                this.energiGaude.subVal(val);
                var attrChange = new GameBase.AttributeChange(this.game, this.hero, val, this.hero.energyType, false);
                attrChange.create();
                attrChange.show();
                this.hero.uiAttack.updateView();
            };
            Hero.prototype.getEnergy = function () {
                return this.energiGaude.getVal();
            };
            Hero.prototype.removeHealth = function (val) {
                this.healthGaude.subVal(val);
                var attrChange = new GameBase.AttributeChange(this.game, this.hero, val, GameBase.E.AttributeType.HEALTH, false);
                attrChange.create();
                attrChange.show();
                this.hero.uiAttack.updateView();
            };
            Hero.prototype.getHealth = function () {
                return this.healthGaude.getVal();
            };
            Hero.prototype.setAsInitialCords = function () {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            };
            Hero.prototype.heroDeselect = function () {
                this.bg.loadTexture('ui-hero-' + this.hero.identification + '-off');
            };
            Hero.prototype.heroSelectd = function () {
                // if hero already move
                if (this.hero.turnMove)
                    return;
                //
                this.resetAttrs();
                this.bg.loadTexture('ui-hero-' + this.hero.identification + '-on');
            };
            Hero.prototype.inputOver = function () {
                // if hero already move
                if (this.hero.turnMove)
                    return;
                //
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
            return;
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
var GameBase;
(function (GameBase) {
    var AttackBox = (function (_super) {
        __extends(AttackBox, _super);
        function AttackBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AttackBox.prototype.setInputElement = function (sprite) {
            var _this = this;
            this.inputElement = sprite;
            this.releaseInput();
            this.inputElement.events.onInputDown.add(function () {
                _this.event.dispatch(GameBase.E.AttackBoxEvent.OnAttackSelect);
            }, this);
        };
        AttackBox.prototype.blockInput = function () {
            this.inputElement.inputEnabled = false;
            this.inputElement.input.useHandCursor = false;
        };
        AttackBox.prototype.releaseInput = function () {
            this.inputElement.inputEnabled = true;
        };
        return AttackBox;
    }(Pk.PkElement));
    GameBase.AttackBox = AttackBox;
    var E;
    (function (E) {
        var AttackBoxEvent;
        (function (AttackBoxEvent) {
            AttackBoxEvent.OnAttackSelect = "OnAttackSelect";
        })(AttackBoxEvent = E.AttackBoxEvent || (E.AttackBoxEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var EndTurnButton = (function (_super) {
        __extends(EndTurnButton, _super);
        function EndTurnButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.inOutTime = 500;
            _this.showTime = 3000;
            return _this;
        }
        EndTurnButton.prototype.create = function () {
            var _this = this;
            this.buttonBack = this.game.add.sprite(0, 0, 'endturn-button');
            this.text = this.game.add.text(0, 0, 'End turn', // text
            {
                font: "40px StrangerBack",
                fill: "#202b3d"
            } // font style
            );
            this.text.anchor.x = 0.5;
            this.text.x = this.buttonBack.width / 2;
            this.text.y += 10;
            this.add(this.buttonBack);
            this.add(this.text);
            this.x = this.game.width - this.width - 20;
            this.y = this.game.height - this.height - 30;
            // set click event
            this.buttonBack.events.onInputDown.add(function () {
                _this.event.dispatch(GameBase.E.ButtonEvent.OnClick);
            });
            // this.buttonBack.events.onInputOut.dispatch();
            this.visible = false;
        };
        EndTurnButton.prototype.in = function () {
            this.visible = true;
            this.buttonBack.inputEnabled = true;
            this.alpha = 1;
            var tween = this.addTween(this).from({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.In, true);
            tween.onComplete.add(function () {
                // this.visible = false;
            }, this);
        };
        EndTurnButton.prototype.out = function () {
            var _this = this;
            // this.buttonBack.input.useHandCursor = false;
            this.buttonBack.inputEnabled = false;
            var tween = this.addTween(this).to({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.Out, true);
            tween.onComplete.add(function () {
                _this.visible = false;
            }, this);
        };
        return EndTurnButton;
    }(Pk.PkElement));
    GameBase.EndTurnButton = EndTurnButton;
    var E;
    (function (E) {
        var ButtonEvent;
        (function (ButtonEvent) {
            ButtonEvent.OnClick = "OnClick";
        })(ButtonEvent = E.ButtonEvent || (E.ButtonEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var HeroAttackCalculation = (function (_super) {
        __extends(HeroAttackCalculation, _super);
        function HeroAttackCalculation(game, attack, enemy) {
            var _this = _super.call(this, game) || this;
            _this.attack = attack;
            _this.enemy = enemy;
            _this.lastValue = _this.enemy.lastValue;
            _this.result = _this.enemy.value;
            _this.enemy.setValue(_this.enemy.lastValue);
            return _this;
        }
        HeroAttackCalculation.prototype.create = function () {
            this.textBox = this.game.add.group();
            // text bg
            this.textBg = this.game.add.sprite(0, 0, 'ui-hero-attack-calculate');
            // bg bg! // same world size
            this.bg = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#000");
            this.bg.alpha = .3;
            this.attackText = this.game.add.text(0, 0, '', {
                font: "108px StrangerBack",
                fill: "#833716"
            } // font style
            );
            this.resultText = this.game.add.text(0, 0, this.enemy.value.toString(), // text
            {
                font: "161px StrangerBack",
                fill: "#303f49"
            } // font style
            );
            this.texts = this.game.add.group();
            this.texts.add(this.attackText);
            this.texts.add(this.resultText);
            // text calcs
            this.updateCalcTexts();
            // pos
            this.updatePos();
            this.textBox.add(this.textBg);
            this.textBox.add(this.texts);
            this.add(this.bg);
            this.add(this.textBox);
            this.visible = false;
        };
        HeroAttackCalculation.prototype.updatePos = function () {
            this.textBg.anchor.set(.5, .5);
            this.textBg.x = this.game.world.centerX;
            this.textBg.y = this.game.world.centerY;
            this.resultText.x = this.attackText.width + 2;
            this.resultText.y -= 20;
            this.texts.x = this.textBg.x - this.texts.width / 2 - 20;
            this.texts.y = this.textBg.y - this.texts.height / 2 + 55;
            this.texts.rotation -= 0.14;
        };
        HeroAttackCalculation.prototype.updateCalcTexts = function () {
            var operator = '+';
            switch (this.attack.operator) {
                case GameBase.E.Operator.PLUS:
                    operator = '+';
                    break;
                case GameBase.E.Operator.MINU:
                    operator = '-';
                    break;
                case GameBase.E.Operator.DIVI:
                    operator = ' / ';
                    break;
                case GameBase.E.Operator.MULT:
                    operator = 'x';
                    break;
            }
            this.attackText.text = this.lastValue.toString() + operator + this.attack.value.toString() + '=';
            this.resultText.text = this.result.toString();
        };
        HeroAttackCalculation.prototype.show = function () {
            var _this = this;
            // hold value
            this.visible = true;
            var tween = this.addTween(this).from({
                result: this.lastValue
            }, 2000, Phaser.Easing.Elastic.Out, false);
            tween.onUpdateCallback(function () {
                // release value
                _this.result = Math.round(_this.result);
                // text calcs
                _this.updateCalcTexts();
            }, this);
            tween.onComplete.add(function () {
                _this.enemy.setValue(_this.result);
                var tweenBoxOut = _this.addTween(_this.textBox).to({
                    x: _this.textBox.x + 150,
                    alpha: 0
                }, 200, Phaser.Easing.Cubic.In, true);
                _this.addTween(_this.bg).to({
                    alpha: 0
                }, 200, Phaser.Easing.Cubic.Out, true);
                tweenBoxOut.onComplete.add(function () {
                    _this.event.dispatch(GameBase.E.HeroAttackCalculation.End);
                    _this.destroy();
                }, _this);
            }, this);
            // anime boxs and back
            this.addTween(this.textBox).from({
                x: this.textBox.x - 150,
                alpha: 0
            }, 200, Phaser.Easing.Cubic.Out, true);
            this.addTween(this.bg).from({
                alpha: 0
            }, 200, Phaser.Easing.Cubic.Out, true);
            tween.start();
        };
        return HeroAttackCalculation;
    }(Pk.PkElement));
    GameBase.HeroAttackCalculation = HeroAttackCalculation;
    var E;
    (function (E) {
        var HeroAttackCalculation;
        (function (HeroAttackCalculation) {
            HeroAttackCalculation.End = "HeroAttackCalculationEnd";
        })(HeroAttackCalculation = E.HeroAttackCalculation || (E.HeroAttackCalculation = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var LevelFlag = (function (_super) {
        __extends(LevelFlag, _super);
        function LevelFlag() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.inOutTime = 500;
            _this.showTime = 5000;
            return _this;
        }
        LevelFlag.prototype.create = function () {
            var flagSprite = this.game.add.sprite(0, 0, 'level-flag');
            this.flagText = this.game.add.text(0, 0, 'Chapter X', // text
            {
                font: "52px StrangerBack",
                fill: "#e5d4c5"
            } // font style
            );
            this.flagText.anchor.x = 0.5;
            this.flagText.x = flagSprite.width / 2;
            this.flagText.y += 35;
            this.add(flagSprite);
            this.add(this.flagText);
            this.x = this.game.width / 2 - this.width / 2;
            this.y -= 10;
            // this.fixedToCamera = true;
            this.visible = false;
        };
        LevelFlag.prototype.show = function (level) {
            var _this = this;
            this.addTween(this).from({
                y: this.height * (-1)
            }, this.inOutTime, Phaser.Easing.Back.Out, true);
            this.flagText.text = 'Chapter ' + level;
            this.visible = true;
            setTimeout(function () {
                var tween = _this.addTween(_this).to({
                    y: _this.height * (-1)
                }, _this.inOutTime, Phaser.Easing.Back.In, false);
                tween.onComplete.add(function () {
                    _this.event.dispatch(GameBase.E.LevelFlagEvent.OnEndShow);
                }, _this);
                tween.start();
            }, this.showTime - this.inOutTime);
        };
        return LevelFlag;
    }(Pk.PkElement));
    GameBase.LevelFlag = LevelFlag;
    var E;
    (function (E) {
        var LevelFlagEvent;
        (function (LevelFlagEvent) {
            LevelFlagEvent.OnEndShow = "OnEndShow";
        })(LevelFlagEvent = E.LevelFlagEvent || (E.LevelFlagEvent = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var AttributeChange = (function (_super) {
        __extends(AttributeChange, _super);
        function AttributeChange(game, target, value, type, sum) {
            var _this = _super.call(this, game) || this;
            _this.sum = true;
            _this.value = value;
            _this.type = type;
            _this.target = target;
            _this.sum = sum;
            return _this;
        }
        AttributeChange.prototype.create = function () {
            var iconKeyType = 'stamina';
            switch (this.type) {
                case GameBase.E.AttributeType.HEALTH:
                    iconKeyType = 'health';
                    break;
                case GameBase.E.AttributeType.STAMINA:
                    iconKeyType = 'stamina';
                    break;
                case GameBase.E.AttributeType.MANA:
                    iconKeyType = 'mana';
                    break;
            }
            this.icon = this.game.add.sprite(0, 0, iconKeyType + '-icon-large');
            this.icon.alpha = 0.7;
            var operator = this.sum ? '+' : '-';
            this.text = this.game.add.text(0, 0, operator + '' + this.value, {
                font: "42px StrangerBack",
                fill: "#fff"
            } // font style
            );
            this.text.setShadow(3, 3, 'rgba(0,0,0,0.9)', 2);
            this.add(this.icon);
            this.add(this.text);
            this.text.anchor.x = 0.5;
            this.text.x = this.icon.width / 2;
            this.text.y = 0;
            // pos
            this.x = this.target.ui.x + this.target.body.width / 2;
            this.y = this.target.ui.y - this.target.ui.height;
            this.visible = false;
        };
        AttributeChange.prototype.show = function () {
            var _this = this;
            this.visible = true;
            var tweenIn = this.addTween(this).from({
                y: this.y + 30,
                alpha: 0
            }, 300, Phaser.Easing.Back.In, true);
            tweenIn.onComplete.add(function () {
                var tweenOut = _this.addTween(_this).to({
                    y: _this.y - 30,
                    alpha: 0
                }, 300, Phaser.Easing.Back.Out, true, 1500);
                tweenOut.onComplete.add(function () {
                    _this.destroy();
                }, _this);
            }, this);
        };
        return AttributeChange;
    }(Pk.PkElement));
    GameBase.AttributeChange = AttributeChange;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var GaudeIcon = (function (_super) {
        __extends(GaudeIcon, _super);
        function GaudeIcon() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.inOutTime = 300;
            return _this;
        }
        GaudeIcon.prototype.in = function (delay) {
            if (delay === void 0) { delay = 0; }
            this.addTween(this).from({
                alpha: 0,
                x: this.x + 20,
                y: this.y - 10,
            }, this.inOutTime, Phaser.Easing.Back.In, true, delay);
        };
        GaudeIcon.prototype.out = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 0; }
            var tween = this.addTween(this).to({
                alpha: 0,
                y: this.y - 10,
            }, this.inOutTime, Phaser.Easing.Back.Out, false, delay);
            tween.onComplete.add(function () {
                _this.destroy();
            }, this);
            tween.start();
        };
        return GaudeIcon;
    }(GameBase.Icon));
    GameBase.GaudeIcon = GaudeIcon;
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