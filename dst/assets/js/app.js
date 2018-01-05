/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _utilsResize = __webpack_require__(1);

	var _utilsResize2 = _interopRequireDefault(_utilsResize);

	var _modulesWebgl = __webpack_require__(2);

	var _modulesWebgl2 = _interopRequireDefault(_modulesWebgl);

	window.onload = function () {
	  var webgl = new _modulesWebgl2["default"]();
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Resize = (function () {
	  function Resize() {
	    _classCallCheck(this, Resize);

	    this.width = null;
	    this.height = null;
	    this.width_old = null;
	    this.height_old = null;
	    this.aspect = null;
	    this.observer = [];
	    this.measure();
	    this.init();
	  }

	  _createClass(Resize, [{
	    key: "init",
	    value: function init() {

	      window.onresize = this.resize.bind(this);
	    }
	  }, {
	    key: "resize",
	    value: function resize() {
	      if (this.timer) clearTimeout(this.timer);
	      this.update();
	      this.timer = setTimeout(this.update.bind(this), 200);
	    }
	  }, {
	    key: "update",
	    value: function update() {
	      this.measure();

	      for (var i = 0; i < this.observer.length; i++) {
	        var observer = this.observer[i];
	        observer.resizeUpdate();
	      }
	    }
	  }, {
	    key: "register",
	    value: function register(observer) {
	      this.observer.push(observer);
	    }
	  }, {
	    key: "measure",
	    value: function measure() {
	      if (this.width) this.width_old = this.width;
	      if (this.height) this.height_old = this.height;

	      this.width = document.body.clientWidth;
	      this.height = window.innerHeight;

	      this.aspect = this.width / this.height;
	    }
	  }]);

	  return Resize;
	})();

	window.ResizeWatch = new Resize();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _loading = __webpack_require__(3);

	var _loading2 = _interopRequireDefault(_loading);

	var _objs = __webpack_require__(4);

	var _objs2 = _interopRequireDefault(_objs);

	var Webgl = (function () {
	  function Webgl() {
	    _classCallCheck(this, Webgl);

	    this.width = 1400;
	    this.height = 1400;
	    this.aspect = this.width / this.height;

	    this.isLoaded = false;
	    this.isMouseStop = true;

	    this.mousemove_timer = null;

	    this.init();
	    // this.audio = new Audio(this);
	    this.loading = new _loading2["default"](this);
	  }

	  _createClass(Webgl, [{
	    key: "init",
	    value: function init() {
	      ResizeWatch.register(this);

	      this.setProps();

	      this.renderer = new THREE.WebGLRenderer({
	        antialias: false,
	        alpha: true
	      });

	      // renderer.setPixelRatio( window.devicePixelRatio );
	      this.renderer.setSize(ResizeWatch.width, ResizeWatch.height);
	      this.renderer.setClearColor(0x000000, 0);
	      this.props.parent.appendChild(this.renderer.domElement);

	      this.renderer.setPixelRatio(1.0);

	      this.scene = new THREE.Scene();

	      this.camera = new THREE.PerspectiveCamera(this.props.fov, this.props.aspect, this.props.near, this.props.far);
	      var cameraZ = this.props.height / 2 / Math.tan(this.props.fov * Math.PI / 180 / 2);
	      this.camera.position.set(0, 0, cameraZ);
	      this.camera.lookAt(this.scene.position);

	      this.renderCount = 0;
	      this.texCount = 0;

	      this.setPlayEvent();
	      TweenLite.ticker.addEventListener("tick", this.render.bind(this));
	    }
	  }, {
	    key: "setProps",
	    value: function setProps() {
	      var width = ResizeWatch.width;
	      var height = ResizeWatch.height;
	      var aspect = width / height;

	      this.props = {
	        width: width,
	        height: height,
	        aspect: aspect,
	        fov: 45,
	        left: -width / 2,
	        right: width / 2,
	        top: height / 2,
	        bottom: -height / 2,
	        near: 0.1,
	        far: 10000,
	        parent: document.getElementById("wrapper"),
	        text: document.getElementById("text")
	        // playEle: document.getElementById("play"),
	        // creditEle: document.getElementById("credits")
	      };
	    }
	  }, {
	    key: "setPlayEvent",
	    value: function setPlayEvent() {
	      if (Useragnt.pc) {
	        document.body.addEventListener("mousemove", this.mousemove.bind(this));
	      } else {
	        window.addEventListener("deviceorientation", this.orientation.bind(this));
	      }
	    }
	  }, {
	    key: "orientation",
	    value: function orientation(e) {
	      var x = e.beta / 90;
	      var y = e.gamma / 90;

	      // x = Math.min(0.25, Math.max(-0.25, x));
	      // y = Math.min(0.25, Math.max(-0.25, y));

	      this.isMouseStop = false;

	      if (this.objs) this.objs.moveCamera(x, y);
	    }
	  }, {
	    key: "mousemove",
	    value: function mousemove(e) {
	      // (-1.0,  1.0)  ( 1.0, 1.0)
	      // (-1.0, -1.0)  (-1.0, 1.0)

	      var windowSize = Math.max(ResizeWatch.width, ResizeWatch.height);

	      var x = e.clientX - ResizeWatch.width / 2;
	      var y = e.clientY - ResizeWatch.height / 2;

	      x /= windowSize / 2;
	      y /= -windowSize / 2;

	      x = Math.min(0.2, Math.max(-0.2, x));
	      y = Math.min(0.2, Math.max(-0.2, y));

	      // this.mouse.x = x;
	      // this.mouse.y = y;

	      // this.objs.cameraEase = 0.04;
	      this.isMouseStop = false;

	      if (this.objs) this.objs.moveCamera(x, y);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var delta = 1 / 50;
	      var time = this.renderCount * delta;

	      this.renderCount++;

	      if (this.output) {
	        if (this.renderCount % 10 === 0) {
	          this.texCount++;
	          this.texCount = this.texCount % 3;
	          this.uniforms.tex.value = this.images[this.texCount];
	        }
	      }

	      if (this.renderCount % 3 === 0) {

	        if (this.objs) this.objs.render(time, delta);

	        if (this.output) this.uniforms.uTick.value = time;

	        this.renderer.render(this.scene, this.camera);
	      }
	    }
	  }, {
	    key: "resizeUpdate",
	    value: function resizeUpdate() {
	      this.setProps();
	      this.renderer.setSize(this.props.width, this.props.height);
	      this.camera.aspect = this.props.aspect;

	      var cameraZ = this.props.height / 2 / Math.tan(this.props.fov * Math.PI / 180 / 2);

	      this.camera.position.set(0, 0, cameraZ);
	      this.camera.lookAt(this.scene.position);

	      this.camera.updateProjectionMatrix();

	      if (ResizeWatch.aspect > this.aspect) {
	        var scale = ResizeWatch.width / this.width;
	      } else {
	        var scale = ResizeWatch.height / this.height;
	      }

	      if (this.output) {
	        this.output.scale.x = scale;
	        this.output.scale.y = scale;
	      }
	    }
	  }, {
	    key: "createOutput",
	    value: function createOutput() {
	      var g = new THREE.PlaneBufferGeometry(this.width, this.height);

	      this.uniforms = {
	        tex: { type: "t", value: this.images[0] },

	        tObjs: { type: "t", value: this.objs.fbo.texture },
	        uTick: { type: "f", value: 0 },
	        uSize: { type: "v2", value: new THREE.Vector2(this.width, this.height) }
	      };

	      this.material = new THREE.ShaderMaterial({
	        vertexShader: this.vertShader[0],
	        fragmentShader: this.fragShader[0],
	        uniforms: this.uniforms,
	        transparent: true
	      });

	      var mesh = new THREE.Mesh(g, this.material);
	      this.scene.add(mesh);

	      this.output = mesh;

	      if (ResizeWatch.aspect > this.aspect) {
	        var scale = ResizeWatch.width / this.width;
	      } else {
	        var scale = ResizeWatch.height / this.height;
	      }

	      this.output.scale.x = scale;
	      this.output.scale.y = scale;
	    }
	  }, {
	    key: "compLoading",
	    value: function compLoading() {
	      this.objs = new _objs2["default"](this);
	      this.createOutput();
	      this.isLoaded = true;

	      var textEle = document.getElementById("text");
	      textEle.classList.remove("isHidden");
	    }
	  }]);

	  return Webgl;
	})();

	exports["default"] = Webgl;
	module.exports = exports["default"];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Loading = (function () {
	  function Loading(webgl) {
	    _classCallCheck(this, Loading);

	    this.webgl = webgl;
	    // this.opening = this.webgl.opening;

	    // this.isIE11 = (Useragnt.userAgent.indexOf('trident') != -1) ? true : false; //useragntで調べる
	    // console.log(this.isIE11, "ie11");

	    this.images = [
	    /* 00 */"assets/img/tex0.jpg",
	    /* 01 */"assets/img/tex1.jpg",
	    /* 02 */"assets/img/tex2.jpg"];

	    this.texts = [];

	    this.audios = [];

	    this.jsons = [];

	    this.vertShader = [
	    /* 00 */"assets/glsl/output.vert",
	    /* 01 */"assets/glsl/obj.vert"];

	    this.fragShader = [
	    /* 00 */"assets/glsl/output.frag",
	    /* 01 */"assets/glsl/obj-face.frag",
	    /* 02 */"assets/glsl/obj-edge.frag",
	    /* 03 */"assets/glsl/simulation-def.frag",
	    /* 04 */"assets/glsl/simulation-vel.frag",
	    /* 05 */"assets/glsl/simulation-pos.frag"];

	    this.videos = [];

	    this.loadingCount = 0;
	    this.wholeLoadingNum = this.texts.length + this.audios.length + this.images.length + this.vertShader.length + this.fragShader.length + this.videos.length + this.jsons.length;

	    if (this.images.length > 0) {
	      this.initImage();
	    }

	    if (this.audios.length > 0) {
	      this.initAudio();
	    }

	    if (this.vertShader.length > 0) {
	      this.initShader();
	    }

	    if (this.videos.length > 0) {
	      this.initVideo();
	    }

	    if (this.jsons.length > 0) {
	      this.initJson();
	    }

	    if (this.texts.length > 0) {
	      this.initTextTexture();
	    }
	  }

	  _createClass(Loading, [{
	    key: "initTextTexture",
	    value: function initTextTexture() {
	      this.textsLength = this.texts.length;
	      this.textsCount = 0;
	      this.isTextComplete = false;

	      for (var i = 0; i < this.textsLength; i++) {
	        this.createTextTexture(i);
	      }
	    }
	  }, {
	    key: "createTextTexture",
	    value: function createTextTexture(i) {
	      var _texture = new THREE.TextureLoader().load(this.texts[i].src, (function (texture) {
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;

	        // console.log("loading img", texture);

	        texture.needsUpdate = true;
	        this.textsCount++;
	        this.loadingCount++;

	        var ratio = 0.5;

	        this.texts[i] = {
	          texture: _texture,
	          width: _texture.image.width * ratio,
	          height: _texture.image.height * ratio,
	          top: this.texts[i].top * ratio,
	          isMask: this.texts[i].mask
	        };

	        if (this.textsCount === this.textsLength) {
	          this.isTextComplete = true;
	          console.log("comp img");

	          this.completeLoadingAll();
	        }
	      }).bind(this));
	    }
	  }, {
	    key: "initJson",
	    value: function initJson() {
	      this.jsonsLength = this.jsons.length;
	      // this.jsonsCount = 0;
	      this.isJsonComplete = false;

	      for (var i = 0; i < this.jsonsLength; i++) {
	        this.importJson(i);
	      }
	    }
	  }, {
	    key: "importJson",
	    value: function importJson(i) {

	      var _this = this;

	      $.ajax({
	        type: 'GET',
	        url: this.jsons[i],
	        dataType: 'json',
	        cache: false,
	        success: function success(data) {
	          var data = data;

	          _this.jsons[i] = data;

	          _this.loadingCount++;

	          // _this.isImageComplete = true;
	          // console.log("comp img");

	          _this.completeLoadingAll();
	        }
	      });
	    }
	  }, {
	    key: "initImage",
	    value: function initImage() {

	      this.imagesLength = this.images.length;
	      this.imagesCount = 0;
	      this.isImageComplete = false;

	      for (var i = 0; i < this.imagesLength; i++) {
	        this.createTexture(i);
	      }
	    }
	  }, {
	    key: "createTexture",
	    value: function createTexture(i) {

	      var _texture = new THREE.TextureLoader().load(this.images[i], (function (texture) {
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;

	        // console.log("loading img", texture);

	        texture.needsUpdate = true;
	        this.imagesCount++;
	        this.loadingCount++;

	        var ratio = 0.8;

	        this.images[i] = _texture;
	        // console.log("img");

	        if (this.imagesCount === this.imagesLength) {
	          this.isImageComplete = true;
	          console.log("comp img");

	          this.completeLoadingAll();
	        }
	      }).bind(this));
	    }
	  }, {
	    key: "initAudio",
	    value: function initAudio() {
	      this.audiosLength = this.audios.length;
	      this.audiosCount = 0;

	      for (var i = 0; i < this.audios.length; i++) {
	        this.audios[i] = this.importAudio(i);
	      }
	    }
	  }, {
	    key: "importAudio",
	    value: function importAudio(i) {
	      var request = new XMLHttpRequest();

	      request.open('GET', this.audios[i], true);
	      request.responseType = 'arraybuffer';

	      var _this = this;

	      request.onload = function () {
	        // _this.audioContext.decodeAudioData(request.response, function(buffer){
	        _this.audios[i] = request.response;
	        _this.audiosCount++;
	        _this.loadingCount++;
	        if (_this.audiosLength === _this.audiosCount) {
	          _this.isAudioComplete = true;
	          console.log("comp audio");

	          _this.completeLoadingAll();
	        }
	        // });
	      };

	      request.send();
	    }
	  }, {
	    key: "initShader",
	    value: function initShader() {

	      this.shaderLength = this.vertShader.length + this.fragShader.length;
	      this.shaderCount = 0;

	      this.isShaderComplete = false;

	      for (var i = 0; i < this.vertShader.length; i++) {
	        this.importShader_vert(i);
	      }

	      for (var i = 0; i < this.fragShader.length; i++) {
	        this.importShader_frag(i);
	      }
	    }
	  }, {
	    key: "initVideo",
	    value: function initVideo() {
	      // dom

	      //

	      // ie11用、videoの代わりに再生
	      this.canvases = [];

	      this.masks = [];

	      this.videoLength = this.videos.length;
	      this.videoCount = 0;
	      this.isVideoComplete = false;

	      for (var i = 0; i < this.videoLength; i++) {
	        var video = this.createVideo(this.videos[i], i);
	        this.videos[i] = video; // video url -> video element

	        this.videos[i + this.videoLength] = video; // video url -> video element

	        video.isFirstCanplaythrough = false;
	        video.oncanplaythrough = (function (_i, _video) {
	          if (_video.isFirstCanplaythrough) return;
	          _video.isFirstCanplaythrough = true;
	          _video.width = _video.videoWidth;
	          _video.height = _video.videoHeight;

	          // if(Useragnt.ios) _video.tween = this.maskTween(_video);

	          // if(this.isIE11){
	          //  var _canvas = this.createCanvas(_video);
	          //  this.masks[_i] = this.setCanvasTexture(_canvas);
	          // } else {
	          this.masks[_i] = this.setVideoTexture(_video);
	          // }

	          this.videoCount++;
	          this.loadingCount++;
	          if (this.videoCount === this.videoLength) {
	            this.isVideoComplete = true;
	            console.log("comp video");

	            this.completeLoadingAll();
	          }
	        }).bind(this, i, video);
	      }
	    }
	  }, {
	    key: "createVideo",
	    value: function createVideo(src, i) {
	      // var videoWrapper = document.getElementById("dammyVideo_wrap");
	      // console.log(videoWrapper);
	      var video = document.createElement("video");
	      video.setAttribute("playsinline", "");
	      video.setAttribute("muted", "");

	      // video.preload = "auto";
	      video.autoplay = false;
	      video.loop = false;
	      video.src = src;
	      // video.playsinline = true;
	      video.load();
	      video.num = i; // videoそのものの番号
	      video.isPlaying = false;
	      // console.log(video);
	      // videoWrapper.appendChild(video)

	      video.onended = (function (i) {
	        console.log("videoEnd", video.isPlaying, video.currentTime);
	        if (!video.isPlaying) return;

	        video.currentTime = 0;

	        video.isPlaying = false;
	        // video.isEnd.value = 1;

	        if (Useragnt.ie) {
	          video.pause();
	        }

	        console.log(Useragnt);
	        if (!Useragnt.safari || Useragnt.ios) {
	          this.webgl.endVideo(); // maskが再生され終わったら他を非表示にする。
	        }
	      }).bind(this, i);

	      video.onpause = (function () {
	        console.log("pause");
	        // if(!video.isPlaying) return;

	        if (Useragnt.safari && !Useragnt.ios) {
	          if (video.currentTime === video.duration) {
	            video.isPlaying = false;
	            video.currentTime = 0;

	            this.webgl.endVideo();
	            video.pause();
	          }
	        }

	        if (video.isPlaying && video.currentTime !== video.duration) {
	          video.play();
	        }
	      }).bind(this);

	      video.onplaying = function () {
	        console.log("playing");
	      };

	      video.onplay = (function () {
	        console.log("videoPlay", video.isPlaying);

	        if (Useragnt.firefox) video.currentTime = 0;

	        video.isPlaying = true;
	      }).bind(this);

	      return video;
	    }
	  }, {
	    key: "createCanvas",
	    value: function createCanvas(_video) {
	      var canvas = document.createElement("canvas");
	      canvas.width = _video.width;
	      canvas.height = _video.height;
	      var context = canvas.getContext("2d");

	      var c = {
	        canvas: canvas,
	        context: context,
	        video: _video
	      };

	      this.canvases.push(c);

	      return c;
	    }
	  }, {
	    key: "setCanvasTexture",
	    value: function setCanvasTexture(_mat) {
	      var canvas = _mat.canvas;
	      var texture = new THREE.Texture(canvas);
	      texture.minFilter = THREE.LinearFilter;
	      texture.magFilter = THREE.LinearFilter;
	      _mat.texture = texture;

	      return texture;
	    }
	  }, {
	    key: "setVideoTexture",
	    value: function setVideoTexture(_mat) {
	      var texture = new THREE.VideoTexture(_mat);
	      texture.minFilter = THREE.LinearFilter;
	      texture.magFilter = THREE.LinearFilter;
	      texture.format = THREE.RGBFormat;

	      return texture;
	    }
	  }, {
	    key: "maskTween",

	    // ios用のvideo再生tween
	    value: function maskTween(_video) {
	      var duration = _video.duration;
	      var rate = 25;
	      var stepTime = 1000 / rate;
	      var stepNum = Math.ceil(duration * rate);

	      var tl = new TimelineLite({
	        paused: true,
	        onStart: function onStart() {
	          console.log(_video.isPlaying);
	        },
	        onUpdate: function onUpdate() {
	          console.log(_video.isPlaying);
	          // if(!_video.isPlaying)
	          //  tl.kill();
	        },
	        onComplete: (function () {
	          this.webgl.endVideo();

	          _video.isPlaying = false;
	          // _video.isEnd.value = 1;
	          tl.time(0);
	          tl.pause();
	        }).bind(this)
	      });

	      tl.fromTo(_video, _video.duration, { currentTime: 0 }, { currentTime: _video.duration, ease: SteppedEase.config(stepNum) });

	      return tl;
	    }
	  }, {
	    key: "rendering_canvas",
	    value: function rendering_canvas() {
	      if (!this.isIE11) return;

	      for (var i = 0, len = this.canvases.length; i < len; i++) {
	        var ctx = this.canvases[i].context;
	        var can = this.canvases[i].canvas;
	        var video = this.canvases[i].video;
	        var tex = this.canvases[i].texture;
	        if (video.isPlaying) {
	          tex.needsUpdate = true;
	          // ctx.clearRect(0, 0, can.width, can.height);
	          ctx.drawImage(video, 0, 0);
	        } else {
	          ctx.clearRect(0, 0, can.width, can.height);
	        }
	      }
	    }
	  }, {
	    key: "importShader_vert",
	    value: function importShader_vert(i) {

	      var myRequest = new XMLHttpRequest();

	      var _this = this;
	      myRequest.onreadystatechange = function () {
	        if (myRequest.readyState === 4) {
	          _this.vertShader[i] = myRequest.response;
	          _this.completeShaderLoad();
	        }
	      };

	      myRequest.open("GET", this.vertShader[i], true);
	      myRequest.send();
	    }
	  }, {
	    key: "importShader_frag",
	    value: function importShader_frag(i) {

	      var myRequest = new XMLHttpRequest();

	      var _this = this;
	      myRequest.onreadystatechange = function () {
	        if (myRequest.readyState === 4) {
	          _this.fragShader[i] = myRequest.response;

	          _this.completeShaderLoad();
	        }
	      };

	      myRequest.open("GET", this.fragShader[i], true);
	      myRequest.send();
	    }
	  }, {
	    key: "completeShaderLoad",
	    value: function completeShaderLoad() {
	      this.shaderCount++;
	      this.loadingCount++;

	      if (this.shaderCount === this.shaderLength) {
	        this.isShaderComplete = true;
	        console.log("comp shader");
	        this.completeLoadingAll();
	      }
	    }
	  }, {
	    key: "completeLoadingAll",
	    value: function completeLoadingAll() {
	      console.log(this.loadingCount, this.wholeLoadingNum);
	      // this.webgl.textDom.updateLoadingBar(this.loadingCount / this.wholeLoadingNum);
	      if (this.loadingCount !== this.wholeLoadingNum) return;

	      console.log("loading --- comp", this);

	      this.webgl.vertShader = this.vertShader;
	      this.webgl.fragShader = this.fragShader;
	      this.webgl.videos = this.videos;
	      this.webgl.canvases = this.canvases;
	      this.webgl.masks = this.masks;
	      this.webgl.images = this.images;
	      this.webgl.audios = this.audios;
	      this.webgl.jsons = this.jsons;
	      this.webgl.texts = this.texts;
	      console.log(this.jsons);

	      this.webgl.compLoading();
	    }
	  }]);

	  return Loading;
	})();

	exports["default"] = Loading;
	module.exports = exports["default"];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _simulation = __webpack_require__(5);

	var _simulation2 = _interopRequireDefault(_simulation);

	var Objs = (function () {
	  function Objs(webgl) {
	    _classCallCheck(this, Objs);

	    this.webgl = webgl;
	    this.size = 26;
	    this.objNum = this.size * this.size;
	    this.objTypeNum = 3;
	    this.objNum_2 = Math.floor(this.objNum / this.objTypeNum);
	    this.width = this.webgl.width;
	    this.height = this.webgl.height;

	    this.objType = [new THREE.ConeBufferGeometry(15, 20, 3), new THREE.TorusBufferGeometry(30, 4, 5, 3), new THREE.BoxBufferGeometry(14, 2, 14)];

	    this.colorPallete = [new THREE.Color(0x111111), new THREE.Color(0x222222), new THREE.Color(0x444444), new THREE.Color(0x555555)];

	    this.init();
	  }

	  _createClass(Objs, [{
	    key: "init",
	    value: function init() {
	      this.scene = new THREE.Scene();
	      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
	      this.scene.add(this.camera);
	      this.camera.position.set(0, 2, 6);
	      this.camera.lookAt(this.scene.position);

	      // const position
	      this.cameraDef = {
	        x: 0,
	        y: 2
	      };

	      // target offset position
	      this.cameraOffset = {
	        x: 0,
	        y: 0
	      };

	      this.cameraEase = 0.04;
	      this.cameraEase2 = 0;

	      // this.camera.lookAt(this.scene.position);
	      var renderTargetParameters = {
	        minFilter: THREE.LinearFilter,
	        magFilter: THREE.LinearFilter,
	        format: THREE.RGBAFormat
	      };

	      var ratio = 1.5;

	      this.fbo = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);
	      this.fbo.texture.format = THREE.RGBAFormat;

	      this.sim = new _simulation2["default"](this.webgl, this.size);

	      this.group = new THREE.Group();
	      this.scene.add(this.group);

	      this.face = [];
	      this.edge = [];

	      for (var i = 0; i < this.objTypeNum; i++) {
	        var originalG = this.objType[i];
	        this.face[i] = this.createFace(originalG, i);
	        // this.edge[i] = this.createEdge(originalG, i);
	      }
	    }
	  }, {
	    key: "createFace",
	    value: function createFace(originalG, num) {
	      var geometry = new THREE.InstancedBufferGeometry();
	      var vertices = originalG.attributes.position.clone();

	      geometry.addAttribute("position", vertices);

	      var normals = originalG.attributes.normal.clone();
	      geometry.addAttribute("normal", normals);

	      // uv
	      var uvs = originalG.attributes.uv.clone();
	      geometry.addAttribute("uv", uvs);

	      // index
	      var indices = originalG.index.clone();
	      geometry.setIndex(indices);

	      geometry.maxInstancedCount = this.objNum_2;

	      var nums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum_2 * 1), 1, 1);

	      for (var i = 0; i < nums.count; i++) {
	        nums.setX(i, i + this.objNum_2 * num);
	      }

	      geometry.addAttribute("aNum", nums);

	      var material_face = new THREE.ShaderMaterial({
	        uniforms: {
	          posMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
	          velMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
	          uSize: { type: "f", value: this.sim.size },
	          uTick: { type: 'f', value: 0 },
	          uScale: { type: 'f', value: 0.7 * 0.99 },
	          uColorArray: { type: "v3v", value: this.colorPallete }
	        },

	        vertexShader: this.webgl.vertShader[1],
	        fragmentShader: this.webgl.fragShader[1],
	        shading: THREE.FlatShading
	      });

	      // side: THREE.DoubleSide,

	      var mesh = new THREE.Mesh(geometry, material_face);

	      this.group.add(mesh);

	      return mesh;
	    }
	  }, {
	    key: "createEdge",
	    value: function createEdge(originalG, num) {
	      // var originalG = new THREE.OctahedronBufferGeometry(1, 0);

	      this.edgesOriginalG = new THREE.EdgesGeometry(originalG);

	      var geometry = new THREE.InstancedBufferGeometry();
	      var vertices = this.edgesOriginalG.attributes.position.clone();

	      geometry.addAttribute("position", vertices);

	      // const normals = this.edgesOriginalG.attributes.normal.clone();
	      // geometry.addAttribute("normal", normals);

	      //   // uv
	      // const uvs = this.edgesOriginalG.attributes.uv.clone();
	      // geometry.addAttribute("uv", uvs);

	      // index
	      // const indices = this.edgesOriginalG.index.clone();
	      // geometry.setIndex(indices);

	      geometry.maxInstancedCount = this.objNum_2;

	      var nums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum_2 * 1), 1, 1);

	      // var randoms = new THREE.InstancedBufferAttribute(new Float32Array(this.sim.size * this.sim.size * 1), 1, 1);

	      for (var i = 0; i < nums.count; i++) {
	        nums.setX(i, i + this.objNum_2 * num);
	      }

	      geometry.addAttribute("aNum", nums);

	      var material_edge = new THREE.ShaderMaterial({
	        uniforms: {
	          posMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
	          velMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
	          uSize: { type: "f", value: this.sim.size },

	          uTick: { type: 'f', value: 0 },
	          uScale: { type: 'f', value: 0.7 },
	          uColorArray: { type: "v3v", value: this.colorPallete }
	        },

	        vertexShader: this.webgl.vertShader[1],
	        fragmentShader: this.webgl.fragShader[2]
	      });

	      var mesh = new THREE.LineSegments(geometry, material_edge);
	      this.group.add(mesh);
	      mesh.visible = false;

	      return mesh;
	    }
	  }, {
	    key: "moveCamera",
	    value: function moveCamera(x, y) {
	      this.cameraOffset.x = x * 8;
	      this.cameraOffset.y = y * 8;
	    }
	  }, {
	    key: "render",
	    value: function render(time, delta) {
	      this.group.rotation.x += delta * 0.1;
	      this.group.rotation.y -= delta * 0.08;

	      // camera
	      var currentCamera = {
	        x: this.camera.position.x,
	        y: this.camera.position.y
	      };

	      var dx = this.cameraDef.x + this.cameraOffset.x - currentCamera.x;
	      var dy = this.cameraDef.y + this.cameraOffset.y - currentCamera.y;

	      this.cameraEase2 += 0.04;
	      this.cameraEase2 = Math.min(1.0, this.cameraEase2);

	      var ease = this.cameraEase * this.cameraEase2;

	      this.camera.position.x += dx * ease;
	      this.camera.position.y += dy * ease;

	      // simulation
	      this.sim.velUniforms.timer.value = time;
	      this.sim.velUniforms.delta.value = delta * 8.0;

	      this.sim.gpuCompute.compute();

	      for (var i = 0; i < this.objTypeNum; i++) {
	        this.face[i].material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
	        this.face[i].material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

	        // this.edge[i].material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
	        // this.edge[i].material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

	        // timer
	        // this.edge[i].material.uniforms.uTick.value = this.face[i].material.uniforms.uTick.value = time;
	        this.face[i].material.uniforms.uTick.value = time;
	      }

	      this.webgl.renderer.render(this.scene, this.camera, this.fbo);
	    }
	  }]);

	  return Objs;
	})();

	exports["default"] = Objs;
	module.exports = exports["default"];

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Simulation = (function () {
	  function Simulation(webgl, size) {
	    _classCallCheck(this, Simulation);

	    this.webgl = webgl;
	    this.renderer = this.webgl.renderer;
	    this.size = size;
	    this.init();
	  }

	  _createClass(Simulation, [{
	    key: "init",
	    value: function init() {
	      this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

	      this.dataPos = this.gpuCompute.createTexture();
	      this.dataVel = this.gpuCompute.createTexture();
	      this.dataDef = this.gpuCompute.createTexture();

	      var posArray = this.dataPos.image.data;
	      var velArray = this.dataVel.image.data;
	      var defArray = this.dataDef.image.data;

	      for (var i = 0, il = posArray.length; i < il; i += 4) {

	        var phi = Math.random() * 2 * Math.PI;
	        var theta = Math.random() * Math.PI;
	        var r = (1.2 + Math.random() * 2) * 1.2;

	        defArray[i + 0] = posArray[i + 0] = r * Math.sin(theta) * Math.cos(phi);
	        defArray[i + 1] = posArray[i + 1] = r * Math.sin(theta) * Math.sin(phi) * 1.4;
	        defArray[i + 2] = posArray[i + 2] = r * Math.cos(theta);
	        defArray[i + 3] = posArray[i + 3] = Math.random() * 0.5;

	        velArray[i + 3] = Math.random() * 100; // frames life
	      }

	      this.def = this.gpuCompute.addVariable("defTex", this.webgl.fragShader[3], this.dataDef);
	      this.vel = this.gpuCompute.addVariable("velTex", this.webgl.fragShader[4], this.dataVel);
	      this.pos = this.gpuCompute.addVariable("posTex", this.webgl.fragShader[5], this.dataPos);

	      this.gpuCompute.setVariableDependencies(this.def, [this.pos, this.vel, this.def]);
	      this.gpuCompute.setVariableDependencies(this.vel, [this.pos, this.vel, this.def]);
	      this.gpuCompute.setVariableDependencies(this.pos, [this.pos, this.vel, this.def]);

	      // var posUniforms = this.pos.material.uniforms;
	      this.velUniforms = this.vel.material.uniforms;

	      this.velUniforms.timer = { value: 0.0 };
	      this.velUniforms.delta = { value: 0.0 };
	      this.velUniforms.speed = { value: 0.3 };
	      this.velUniforms.factor = { value: 0.5 };
	      this.velUniforms.evolution = { value: 0.5 };
	      this.velUniforms.radius = { value: 3.0 };

	      var error = this.gpuCompute.init();
	      if (error !== null) {
	        console.error(error);
	      }
	    }
	  }]);

	  return Simulation;
	})();

	exports["default"] = Simulation;
	module.exports = exports["default"];

/***/ })
/******/ ]);