import Loading from "./loading";
import Objs from "./objs";

export default class Webgl{
  constructor(){
    this.width = 1400;
    this.height = 1400;
    this.aspect = this.width / this.height;

    this.isLoaded = false;
    this.isMouseStop = true;

    this.mousemove_timer = null;

    this.init();
    // this.audio = new Audio(this);
    this.loading = new Loading(this);
  }

  init(){
    ResizeWatch.register(this);
    
    this.setProps();

    this.renderer = new THREE.WebGLRenderer( { 
      antialias: false,
      alpha: true
    } );

    // renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( ResizeWatch.width, ResizeWatch.height );
    this.renderer.setClearColor( 0x000000, 0 );
    this.props.parent.appendChild( this.renderer.domElement );

    this.renderer.setPixelRatio(1.0);


    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(this.props.fov, this.props.aspect, this.props.near, this.props.far);
    var cameraZ = (this.props.height / 2) / Math.tan((this.props.fov * Math.PI / 180) / 2);
    this.camera.position.set(0, 0, cameraZ);
    this.camera.lookAt(this.scene.position);
    

    this.renderCount = 0;
    this.texCount = 0;

    this.setPlayEvent();
    TweenLite.ticker.addEventListener("tick", this.render.bind(this));
  }

  setProps(){
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

  setPlayEvent(){
    if(Useragnt.pc){
      document.body.addEventListener("mousemove", this.mousemove.bind(this));
    } else {
      window.addEventListener("deviceorientation", this.orientation.bind(this));
    }
  }

  orientation(e){
    let x = e.beta / 90;
    let y = e.gamma / 90;

    // x = Math.min(0.25, Math.max(-0.25, x));
    // y = Math.min(0.25, Math.max(-0.25, y));

    this.isMouseStop = false;

    if(this.objs) this.objs.moveCamera(x, y);
  }

  mousemove(e){
    // (-1.0,  1.0)  ( 1.0, 1.0)
    // (-1.0, -1.0)  (-1.0, 1.0)

    const windowSize = Math.max(ResizeWatch.width, ResizeWatch.height);

    let x = e.clientX - ResizeWatch.width/2;
    let y = e.clientY - ResizeWatch.height/2;

    x /= windowSize/2;
    y /= -windowSize/2;

    x = Math.min(0.2, Math.max(-0.2, x));
    y = Math.min(0.2, Math.max(-0.2, y));

    // this.mouse.x = x;
    // this.mouse.y = y;

    // this.objs.cameraEase = 0.04;
    this.isMouseStop = false;

    if(this.objs) this.objs.moveCamera(x, y);
  }


  render(){
    var delta = 1/50;
    var time = this.renderCount * delta;

    this.renderCount++;

    if(this.output){
      if(this.renderCount % 10 === 0){
        this.texCount++;
        this.texCount = this.texCount % 3;
        this.uniforms.tex.value = this.images[this.texCount]
      }
    }

    if(this.renderCount % 3 === 0){
      
      if(this.objs) this.objs.render(time, delta);

      if(this.output) this.uniforms.uTick.value = time;

      this.renderer.render( this.scene, this.camera);
    }
  }


  resizeUpdate(){
    this.setProps();
    this.renderer.setSize(this.props.width, this.props.height);
    this.camera.aspect = this.props.aspect;

    var cameraZ = (this.props.height / 2) / Math.tan((this.props.fov * Math.PI / 180) / 2);

    this.camera.position.set(0, 0, cameraZ);
    this.camera.lookAt(this.scene.position);

    this.camera.updateProjectionMatrix();

    if(ResizeWatch.aspect > this.aspect){
      var scale = ResizeWatch.width / this.width;
    } else {
      var scale = ResizeWatch.height / this.height;
    }

    if(this.output) {
      this.output.scale.x = scale;
      this.output.scale.y = scale;
    }
  }


  createOutput(){
    const g = new THREE.PlaneBufferGeometry(this.width, this.height);

    this.uniforms = {
      tex: {type: "t", value: this.images[0]},

      tObjs: {type: "t", value: this.objs.fbo.texture},
      uTick: {type: "f", value: 0},
      uSize: {type: "v2", value: new THREE.Vector2(this.width, this.height)}
    };


    this.material = new THREE.ShaderMaterial({
      vertexShader: this.vertShader[0],
      fragmentShader: this.fragShader[0],
      uniforms: this.uniforms,
      transparent: true
    });

    const mesh = new THREE.Mesh(g, this.material);
    this.scene.add(mesh);

    this.output = mesh;

    if(ResizeWatch.aspect > this.aspect){
      var scale = ResizeWatch.width / this.width;
    } else {
      var scale = ResizeWatch.height / this.height;
    }

    this.output.scale.x = scale;
    this.output.scale.y = scale;
  }


  compLoading(){
    this.objs = new Objs(this);
    this.createOutput();
    this.isLoaded = true;

    const textEle = document.getElementById("text");
    textEle.classList.remove("isHidden");

  }


}