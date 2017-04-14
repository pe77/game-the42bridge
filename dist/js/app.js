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
            this.load.spritesheet('char1-idle', 'assets/default/images/chars/1/idle.png', 200, 300, 1);
            this.load.spritesheet('char2-idle', 'assets/default/images/chars/2/idle.png', 150, 200, 1);
            this.load.spritesheet('char3-idle', 'assets/default/images/chars/3/idle.png', 150, 250, 1);
            this.load.spritesheet('char4-idle', 'assets/default/images/chars/4/idle.png', 250, 250, 1);
            // icons
            this.load.image('heath-icon', 'assets/default/images/ui/ico-health.png');
            this.load.image('stamina-icon', 'assets/default/images/ui/ico-stamina.png');
            this.load.image('mana-icon', 'assets/default/images/ui/ico-mana.png');
            this.load.spritesheet('selected-icon', 'assets/default/images/selectable-icon.png', 22, 16, 3);
            // ui hero
            this.load.image('ui-hero-1-on', 'assets/default/images/chars/1/ui-on.png');
            this.load.image('ui-hero-2-on', 'assets/default/images/chars/2/ui-on.png');
            this.load.image('ui-hero-3-on', 'assets/default/images/chars/3/ui-on.png');
            this.load.image('ui-hero-4-on', 'assets/default/images/chars/4/ui-on.png');
            this.load.image('ui-hero-1-off', 'assets/default/images/chars/1/ui-off.png');
            this.load.image('ui-hero-2-off', 'assets/default/images/chars/2/ui-off.png');
            this.load.image('ui-hero-3-off', 'assets/default/images/chars/3/ui-off.png');
            this.load.image('ui-hero-4-off', 'assets/default/images/chars/4/ui-off.png');
            // main
            this.load.image('main-bg', 'assets/states/main/images/bg/s-background.png');
            this.load.image('main-bridge-back', 'assets/states/main/images/bg/s-bridge-back.png');
            this.load.image('main-bridge-front', 'assets/states/main/images/bg/s-bridge-front.png');
            // attacks icons
            this.load.image('attack-icon-regular', 'assets/default/images/chars/attacks/regular.png');
            this.load.image('attack-icon-tree', 'assets/default/images/chars/attacks/tree.png');
            this.load.image('attack-icon-beast', 'assets/default/images/chars/attacks/beast.png');
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
            this.icon.create(false);
            // TEXTS
            // create attack text :: name
            this.textName = this.game.add.text(0, 0, this.name, // text
            this.textStyleName // font style
            );
            this.textName.align = "left";
            // create attack text :: description
            this.textDescription = this.game.add.text(0, 0, this.description, // text
            this.textStyleDescription // font style
            );
            this.textDescription.align = "left";
            // create attack text :: value
            this.textValue = this.game.add.text(0, 0, this.value.toString(), // text
            this.textStyleDescription // font style
            );
            this.textValue.align = "left";
            // create attack text :: energy
            this.textEnergy = this.game.add.text(0, 0, this.energyCost.toString(), // text
            this.textStyleDescription // font style
            );
            this.textEnergy.align = "left";
            // ICONS
            // select energy icon
            var energyIconKey = '';
            switch (this.energyType) {
                case GameBase.E.EnergyType.MANA:
                    energyIconKey = 'mana-icon';
                    break;
                case GameBase.E.EnergyType.STAMINA:
                    energyIconKey = 'stamina-icon';
                    break;
            }
            this.energyTypeIcon = new GameBase.Icon(this.game, energyIconKey);
            // this.energyTypeIcon.create(false);
            // this.energyTypeIcon.playAnimation(8);
            var operatorIcon = new GameBase.Icon(this.game, 'operator-icon-' + this.operator);
            // operatorIcon.create(false);
            // operatorIcon.playAnimation(10);
            // POS
            this.textName.x = this.icon.width + this.iconPadding;
            this.textDescription.x = this.textName.x;
            this.textDescription.y = this.textName.height + this.textPadding;
            this.textValue.x = this.textName.x;
            this.textValue.y = this.textName.y - this.textValue.height - this.textPadding;
            this.energyTypeIcon.x = this.textDescription.x + this.textDescription.width - this.textEnergy.width;
            this.energyTypeIcon.x = this.textDescription.width < this.textName.width ? this.textName.x + this.textName.width - this.textEnergy.width : this.energyTypeIcon.x;
            this.energyTypeIcon.y = this.textValue.y;
            this.textEnergy.x = this.energyTypeIcon.x - this.textEnergy.width - this.iconPadding / 2;
            this.textEnergy.y = this.textValue.y;
            operatorIcon.x = this.textValue.x + this.textValue.width + this.iconPadding / 2;
            operatorIcon.y = this.textValue.y;
            this.sizeWidth = this.textName.width > this.textDescription.width ? this.textName.width : this.textDescription.width;
            // bgs
            this.textBg = Pk.PkUtils.createSquare(this.game, this.sizeWidth + this.bgPadding, this.textName.y + this.textName.height + this.textDescription.height + this.bgPadding);
            this.textBg.x = this.textName.x - this.bgPadding / 2;
            this.textBg.y = this.textName.y - this.bgPadding / 2;
            this.textBg.alpha = .3;
            this.iconBg = Pk.PkUtils.createSquare(this.game, this.icon.width + this.bgPadding, // x
            this.icon.height + this.bgPadding // y
            );
            this.iconBg.x = this.icon.x - this.bgPadding / 2;
            this.iconBg.y = this.icon.y - this.bgPadding / 2;
            this.iconBg.alpha = .3;
            this.energyBg = Pk.PkUtils.createSquare(this.game, this.textEnergy.width + operatorIcon.width + (this.iconPadding / 2) + this.bgPadding, // x
            operatorIcon.height + this.bgPadding // y
            );
            this.energyBg.x = this.textEnergy.x - this.bgPadding / 2;
            this.energyBg.y = this.textEnergy.y - this.bgPadding / 2;
            this.energyBg.alpha = .3;
            this.valueBg = Pk.PkUtils.createSquare(this.game, this.textValue.width + this.energyTypeIcon.width + (this.iconPadding / 2) + this.bgPadding, // x
            this.energyTypeIcon.height + this.bgPadding // y
            );
            this.valueBg.x = this.textValue.x - this.bgPadding / 2;
            this.valueBg.y = this.textValue.y - this.bgPadding / 2;
            this.valueBg.alpha = .3;
            // add elements
            this.add(this.valueBg);
            this.add(this.energyBg);
            this.add(this.iconBg);
            this.add(this.textBg);
            this.add(this.icon);
            this.add(this.textName);
            this.add(this.textDescription);
            this.add(this.textValue);
            this.add(this.textEnergy);
            this.add(this.energyTypeIcon);
            this.add(operatorIcon);
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
            bodySprite.alpha = .5;
            _this.setBody(bodySprite);
            return _this;
        }
        Char.prototype.addAnimation = function (sprite, animationKey, fps) {
            if (fps === void 0) { fps = 10; }
            var a = sprite.animations.add(animationKey);
            a.play(fps, true);
            // this.body.addChild(sprite);
            this.add(sprite);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;
            sprite.x = this.body.width / 2;
            sprite.y = this.body.height + 40;
            // sprite.anchor.set(.5, .5);
            //sprite.position = this.body.position; 
            // this.body.events.
            // sprite.y = this.body.y;
            this.animations.push({
                animation: a,
                sprite: sprite
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
            // mouse over check
            this.body.inputEnabled = true;
            this.body.input.useHandCursor = true;
            this.body.events.onInputOver.add(this.inputOver, this);
            this.body.events.onInputOut.add(this.inputOut, this);
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
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game, body, id) {
            var _this = _super.call(this, game, body) || this;
            _this.identification = 0;
            _this.energyType = E.EnergyType.STAMINA;
            _this.ui = new GameBase.ui.Hero(_this.game, _this);
            _this.identification = id;
            GameBase.Hero.heroes.push(_this);
            return _this;
        }
        Hero.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
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
/// <reference path='../../pkframe/refs.ts' />
/// <reference path='./base/Hero.ts' />
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
            _super.prototype.create.call(this);
            // add attacks
            this.addAttack(// regular
            new GameBase.Attacks.Regular(this.game, this.operator, this.energyType));
            // custom regular 1
            var regularAttackCustom = new GameBase.Attacks.Regular(this.game, GameBase.E.Operator.PLUS, this.energyType);
            regularAttackCustom.name = "Custom Regular Attack 1";
            regularAttackCustom.description = "Short description";
            regularAttackCustom.energyCost = 3;
            regularAttackCustom.value = 6;
            regularAttackCustom.icon = new GameBase.Icon(this.game, 'attack-icon-beast');
            this.addAttack(regularAttackCustom);
            // custom regular 2
            var regularAttackCustom2 = new GameBase.Attacks.Regular(this.game, GameBase.E.Operator.DIVI, this.energyType);
            regularAttackCustom2.name = "Custom  Regular Attack 2";
            regularAttackCustom2.description = "Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, \nsed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            regularAttackCustom2.icon = new GameBase.Icon(this.game, 'attack-icon-tree');
            regularAttackCustom2.energyCost = 5;
            regularAttackCustom2.value = 3;
            this.addAttack(regularAttackCustom2);
            // animation
            this.addAnimation(this.game.add.sprite(0, 0, 'char1-idle'), 'idle');
        };
        return Druid;
    }(GameBase.Hero));
    GameBase.Druid = Druid;
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
            _this.charPadding = 50;
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
            // prevent stop update when focus out
            this.stage.disableVisibilityChange = true;
            // get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // when press the key...
            this.enterKey.onDown.add(function () {
                _this.transition.change('Menu', 1111, 'text', { a: true, b: [1, 2] }); // return with some foo/bar args
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
            var thief = new GameBase.Hero(this.game, new Phaser.Rectangle(0, 0, 125, 145), 2);
            thief.addAnimation(this.game.add.sprite(0, 0, 'char2-idle'), 'idle');
            thief.energyType = GameBase.E.EnergyType.STAMINA;
            thief.create();
            var priest = new GameBase.Hero(this.game, new Phaser.Rectangle(0, 0, 84, 220), 3);
            priest.addAnimation(this.game.add.sprite(0, 0, 'char3-idle'), 'idle');
            priest.energyType = GameBase.E.EnergyType.MANA;
            priest.create();
            var knight = new GameBase.Hero(this.game, new Phaser.Rectangle(0, 0, 184, 189), 4);
            knight.addAnimation(this.game.add.sprite(0, 0, 'char4-idle'), 'idle');
            knight.energyType = GameBase.E.EnergyType.STAMINA;
            knight.create();
            // add
            this.heroes.add(druid);
            this.heroes.add(thief);
            this.heroes.add(priest);
            this.heroes.add(knight);
            var i = 0;
            this.heroes.forEach(function (hero) {
                // pos
                // hero.x = (hero.body.width + this.charPadding) * i;
                // hero.x += this.padding;
                hero.x = _this.padding;
                if (i > 0) {
                    var lastHero = _this.heroes.getAt(i - 1);
                    hero.x = lastHero.x + lastHero.body.width + _this.charPadding;
                }
                //
                hero.y = _this.game.height - hero.body.height - _this.padding - 135;
                hero.ui.create();
                _this.addToLayer('ui', hero.ui);
                i++;
            }, this);
            this.addToLayer('chars', this.heroes);
            mainBridgeBack.y = 443;
            mainBridgeFront.y = 540;
            this.addToLayer('stage-back-1', mainBg);
            this.addToLayer('stage-back-2', mainBridgeBack);
            this.addToLayer('stage-front-1', mainBridgeFront);
            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
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
                    console.log('terminou animação');
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
                this.x = this.hero.x;
                this.y = this.hero.y;
                this.bg.y = this.hero.body.height;
                this.bg.anchor.x = .5;
                this.bg.x = this.hero.body.width / 2;
                this.healthGaude.x = this.bg.x - this.bg.width / 2;
                this.healthGaude.x += 65;
                this.healthGaude.y = this.bg.y + 40;
                this.energiGaude.x = this.healthGaude.x;
                this.energiGaude.y = this.healthGaude.y + this.gaudePadding;
                // pos bg
                // this.bg.y = this.healthGaude.y - 15;
                // this.bg.x -= 15;
                this.y += 45;
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);
            };
            Hero.prototype.heroDeselect = function () {
                this.bg.loadTexture('ui-hero-' + this.hero.identification + '-off');
            };
            Hero.prototype.heroSelectd = function () {
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