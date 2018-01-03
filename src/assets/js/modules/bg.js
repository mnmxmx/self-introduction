export default class Bg{
  constructor(webgl, objs){
    this.webgl = webgl;
    this.objs = objs;
    this.width = this.objs.width;
    this.height = this.objs.height;
    this.num = 300;
    this.init();
  }

  init(){
    var originalG = new THREE.BoxBufferGeometry(30, 10, this.height);
    var geometry = new THREE.InstancedBufferGeometry();

    // 頂点
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

    geometry.maxInstancedCount = this.num;

    var nums = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, 1);
    var sizes = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, 1);
    var offsets = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, 1);
    var radians = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, 1); 
    var colors = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    var velocity = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, 1);


    for(var i = 0; i < nums.count; i++){
      // var _color = this.colorPallete[Math.floor(i % this.colorPallete.length)];

      offsets.setX(i, Math.random() * 30000 - 18000);
      radians.setX(i, Math.PI * 2 * i / this.num);
      nums.setX(i, i);
      sizes.setX(i, Math.random() * 0.5 + 0.5);
      velocity.setX(i, Math.random() * 2000 + 400);

      let r = 0.6 + 0.4 * Math.random();
      let g = 0.5 + 0.2 * Math.random();
      let b = 0.8 + 0.2 * Math.random();

      colors.setXYZ(i, r, g, b);
    }


    geometry.addAttribute("aNum", nums);
    geometry.addAttribute("aColor", colors);
    geometry.addAttribute("aOffset", offsets);
    geometry.addAttribute("aRadian", radians);
    geometry.addAttribute("aSize", sizes);
    geometry.addAttribute("aVelocity", velocity);


    this.frequency = geometry.attributes.aFrequency;

    this.uniforms = {
      timer: { type: 'f', value: 0 },
      uLength: {type: "f", value: 80},
      uTheta: {type: "f", value: 0.05},
      uProgress: {type: "f", value: 0},
      uVelocityScale: {type: "f", value: 1.5}
    };


    this.material = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: this.webgl.vertShader[1],
      fragmentShader: this.webgl.fragShader[1],
      // side: THREE.DoubleSide,
      shading: THREE.FlatShading,
      // wireframe: true,
      transparent: true,
    } );

    this.mesh = new THREE.Mesh( geometry, this.material );

    // this.mesh.visible = false;

    this.objs.scene.add( this.mesh );
  }

  fadeIn(){
    TweenMax.to(
      this.uniforms.uProgress, 
      2, 
      {
        value: 6,
        delay: 1,
        ease: Power3.easeInOut,
        onComplete: () => {

        }
      }
    )
  }

  fadeOut(){
    TweenMax.to(
      this.uniforms.uProgress, 
      6, 
      {
        value: 0,
        delay: 0,
        ease: Power3.easeInOut,
        onComplete: () => {

        }
      }
    )
  }

  render(time){
    
    this.material.uniforms.timer.value = time;

  }
} 