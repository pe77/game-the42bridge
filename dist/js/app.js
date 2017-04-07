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
            // default
            this.load.spritesheet('char1', 'assets/default/images/char1.jpg', 58, 96, 5);
            this.load.spritesheet('char2', 'assets/default/images/char2.jpg', 58, 96, 5);
            this.load.spritesheet('char3', 'assets/default/images/char3.jpg', 58, 96, 5);
            this.load.spritesheet('char4', 'assets/default/images/char4.jpg', 58, 96, 5);
            this.load.spritesheet('heath-icon', 'assets/default/images/heath-icon.png', 15, 15, 2);
            this.load.spritesheet('stamina-icon', 'assets/default/images/stamina-icon.png', 15, 15, 2);
            this.load.spritesheet('mana-icon', 'assets/default/images/mana-icon.png', 15, 15, 2);
            // state level 1
            this.load.image('level1-bg', 'assets/states/level1/images/bg.png');
            this.load.audio('level1-sound', 'assets/states/level1/sounds/sound-test.mp3');
            // state main
            this.load.image('titlepage', 'assets/states/main/images/titlepage.jpg');
        };
        Loader.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        return Loader;
    }(Pk.PkLoader));
    GameBase.Loader = Loader;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Char = (function (_super) {
        __extends(Char, _super);
        function Char(game, body) {
            var _this = _super.call(this, game) || this;
            _this.energyMax = 5;
            _this.healthMax = 5;
            _this.side = Side.RIGHT; // sprite side
            _this.setBody(body);
            return _this;
        }
        Char.prototype.create = function () {
            // animation
            this.animationIdle = this.body.animations.add('idle');
            this.animationIdle.play(10, true); // start idle animation
        };
        Char.prototype.setBody = function (body) {
            this.body = body;
            this.add(this.body);
        };
        return Char;
    }(Pk.PkElement));
    GameBase.Char = Char;
    var Operator;
    (function (Operator) {
        Operator[Operator["MULT"] = 0] = "MULT";
        Operator[Operator["DIVI"] = 1] = "DIVI";
        Operator[Operator["PLUS"] = 2] = "PLUS";
        Operator[Operator["MINU"] = 3] = "MINU";
        Operator[Operator["FACT"] = 4] = "FACT";
    })(Operator = GameBase.Operator || (GameBase.Operator = {}));
    var Side;
    (function (Side) {
        Side[Side["LEFT"] = 0] = "LEFT";
        Side[Side["RIGHT"] = 1] = "RIGHT";
    })(Side = GameBase.Side || (GameBase.Side = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.gaudePadding = 5;
            _this.energyType = E.EnergyType.STAMINA;
            return _this;
        }
        Hero.prototype.create = function () {
            _super.prototype.create.call(this);
            // gaudes
            this.healthGaude = new GameBase.Gaude(this.game);
            this.energiGaude = new GameBase.Gaude(this.game);
            // add on hero 
            this.add(this.healthGaude);
            this.add(this.energiGaude);
            // add heath icons
            for (var i = 0; i < this.healthMax; i++)
                this.healthGaude.addIcon(new GameBase.Icon(this.game, 'heath-icon'));
            //
            // select energy icon
            var energyIconKey = '';
            switch (this.energyType) {
                case E.EnergyType.MANA:
                    energyIconKey = 'mana-icon';
                    break;
                case E.EnergyType.STAMINA:
                    energyIconKey = 'stamina-icon';
                    break;
            }
            // add energy icons
            for (var i = 0; i < this.energyMax; i++)
                this.energiGaude.addIcon(new GameBase.Icon(this.game, energyIconKey));
            //
            // pos gaudes
            this.healthGaude.y = this.body.height + this.gaudePadding;
            this.energiGaude.y = this.healthGaude.y + (this.healthGaude.height / 4) + this.gaudePadding;
            this.energiGaude.x += this.gaudePadding;
            console.log('heat gaude create');
        };
        return Hero;
    }(GameBase.Char));
    GameBase.Hero = Hero;
    var E;
    (function (E) {
        var EnergyType;
        (function (EnergyType) {
            EnergyType[EnergyType["STAMINA"] = 0] = "STAMINA";
            EnergyType[EnergyType["MANA"] = 1] = "MANA";
        })(EnergyType = E.EnergyType || (E.EnergyType = {}));
    })(E = GameBase.E || (GameBase.E = {}));
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
            _this.charPadding = 10;
            _this.padding = 20;
            return _this;
        }
        Main.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
            console.log('Main init', args);
        };
        Main.prototype.create = function () {
            var _this = this;
            // change state bg
            this.game.stage.backgroundColor = "#938da0";
            // get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // when press the key...
            this.enterKey.onDown.add(function () {
                _this.transition.change('Menu', 1111, 'text', { a: true, b: [1, 2] }); // return with some foo/bar args
            }, this);
            // set characters group / element
            this.heroes = new Pk.PkElement(this.game);
            // create
            var druid = new GameBase.Hero(this.game, this.game.add.sprite(0, 0, 'char1'));
            druid.energyType = GameBase.E.EnergyType.MANA;
            druid.create();
            var priest = new GameBase.Hero(this.game, this.game.add.sprite(0, 0, 'char2'));
            priest.energyType = GameBase.E.EnergyType.MANA;
            priest.create();
            var thief = new GameBase.Hero(this.game, this.game.add.sprite(0, 0, 'char3'));
            thief.energyType = GameBase.E.EnergyType.STAMINA;
            thief.create();
            var knight = new GameBase.Hero(this.game, this.game.add.sprite(0, 0, 'char4'));
            knight.energyType = GameBase.E.EnergyType.STAMINA;
            knight.create();
            // add
            this.heroes.add(druid);
            this.heroes.add(priest);
            this.heroes.add(thief);
            this.heroes.add(knight);
            var i = 0;
            this.heroes.forEach(function (hero) {
                // pos
                hero.x = (hero.width + _this.charPadding) * i;
                // start from diferents frames
                hero.animationIdle.setFrame(_this.game.rnd.integerInRange(1, 5));
                i++;
            }, this);
            // pos char group
            this.heroes.x += this.padding;
            this.heroes.y = this.game.height - this.heroes.height - this.padding - 100;
        };
        Main.prototype.render = function () {
            this.game.debug.text('(Main Screen) Press [ENTER] to Menu', 35, 35);
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
            console.log('params:', param1, param2, param3);
        };
        Menu.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            console.log('Menu create');
            // change state bg
            this.game.stage.backgroundColor = "#89aca6";
            // get the keyboard
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // when press the key...
            this.enterKey.onDown.add(function () {
                _this.transition.change('Main'); // change to state Main
            }, this);
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
    var Gaude = (function (_super) {
        __extends(Gaude, _super);
        function Gaude() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.icons = [];
            _this.iconEven = true;
            _this.padding = 5;
            return _this;
        }
        Gaude.prototype.addIcon = function (icon) {
            icon.create();
            // icon.animation.setFrame( this.iconEven ? 1 : 2);
            // this.iconEven = !this.iconEven;
            console.log('icon:' + icon.width);
            // save icon ref
            this.icons.push(icon);
            // add on gaude
            this.add(icon);
            // organize icons pos
            for (var i = 0; i < this.icons.length; i++)
                this.icons[i].x = (this.icons[i].width - this.padding) * i;
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
    var Icon = (function (_super) {
        __extends(Icon, _super);
        function Icon(game, iconKey) {
            var _this = _super.call(this, game) || this;
            _this.inOutTime = 500;
            _this.iconKey = iconKey;
            return _this;
        }
        Icon.prototype.create = function () {
            this.body = this.game.add.sprite(0, 0, this.iconKey);
            this.add(this.body);
            // animation
            this.animation = this.body.animations.add('pulse');
            // this.animation.play(3, true); // start pulse animation
            this.in();
        };
        Icon.prototype.in = function () {
            this.addTween(this).from({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.In, true);
        };
        Icon.prototype.out = function () {
            this.addTween(this).to({
                alpha: 0
            }, this.inOutTime, Phaser.Easing.Back.In, true);
        };
        return Icon;
    }(Pk.PkElement));
    GameBase.Icon = Icon;
})(GameBase || (GameBase = {}));
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