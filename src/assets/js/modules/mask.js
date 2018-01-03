export default class Mask{
  constructor(webgl, obj){
    this.webgl = webgl;
    this.obj = obj;
    this.init();
  }

  init(){
    this.maskRatio = 1.5;

    this.width = this.webgl.width * this.maskRatio;
    this.height = this.webgl.height * this.maskRatio;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, .01, 10000 );
    this.scene.add( this.camera );

    var cameraZ = (this.height / 2) / Math.tan((45 * Math.PI / 180) / 2);
    this.camera.position.set(0.0, 0.0, cameraZ);
    this.camera.lookAt(this.scene.position);
    
    var renderTargetParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    };

    this.fbo = new THREE.WebGLRenderTarget( this.width, this.height, renderTargetParameters );
    this.fbo.texture.format = THREE.RGBAFormat;

    this.texCount = 0;

    this.createPlane();
  }


  createPlane(){
    var g = new THREE.PlaneBufferGeometry(this.width, this.height);

    this.uniforms = {
      tDiffuse: {type: "t", value: this.obj.fbo.texture},
      tEffect: {type: "t", value: this.webgl.images[2]},
      // isVideoActive: {type: "f", value: -1},
      isFadeOut: {type: "f", value: -1},
      uTick: {type: "f", value: 0},
      uProgress: {type: "f", value: 0},
      uBgProgress: {type: "f", value: 0},
      uSize: {type: "v2", value: new THREE.Vector2(this.width, this.height)}
    }

    var m = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: this.webgl.vertShader[2],
      fragmentShader: this.webgl.fragShader[2],
      transparent: true,
    } );

    var mesh = new THREE.Mesh(g, m);
    this.scene.add(mesh);

    this.plane = mesh;
  }

  opening(){
    
  }

  fadeIn(){
    this.uniforms.isFadeOut.value = -1;

    var tl = new TimelineMax({
      onComplete: () => {
        this.plane.visible = false;
        this.webgl.fadeInComp();
      }.bind(this)
    });

    tl
    .fromTo(this.uniforms.uProgress, 4, {value: 0}, {value: 1}, 0)
    .to(this.uniforms.uBgProgress, 2, {value: 1, ease: Power4.easeOut}, 0)
  }

  

  fadeOut(){
    this.uniforms.isFadeOut.value = 1;

    // var isTextAnim = false;

    this.plane.visible = true;
    var tl;
    tl = new TimelineMax({
      onComplete: () => {
      }.bind(this)
    });

    tl
    .add("start", 3.5)
    .fromTo(this.uniforms.uProgress, 4, {value: 0}, {value: 1}, "start")
    .fromTo(this.uniforms.uBgProgress, 1, {value: 1}, {value: 0, delay: 0.4, ease: Power4.easeIn}, "start")

  }


  render(time){
    

    if(this.webgl.renderCount % 4 === 0){
      this.uniforms.uTick.value = time;
      this.texCount++;
      this.texCount = this.texCount % 3;
      this.uniforms.tEffect.value = this.webgl.images[this.texCount * 3 + 2]
    }

    // this.webgl.renderer.render(this.obj.scene, this.obj.camera, this.obj.fbo);
    this.webgl.renderer.render(this.scene, this.camera, this.fbo, false);
  }

}