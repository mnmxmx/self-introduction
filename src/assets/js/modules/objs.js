import Simulation from "./simulation";

export default class Objs{
  constructor(webgl){
    this.webgl = webgl;
    this.size = 22;
    this.objNum = this.size * this.size;
    this.objTypeNum = 3;
    this.objNum_2 = Math.floor(this.objNum / this.objTypeNum);
    this.width = this.webgl.width;
    this.height = this.webgl.height;

    this.objType = [
      new THREE.ConeBufferGeometry( 15, 20, 3 ),
      new THREE.TorusBufferGeometry(30, 4, 5, 3),
      new THREE.BoxBufferGeometry(14, 2, 14)
    ];

    this.colorPallete = [
      new THREE.Color(0x111111),
      new THREE.Color(0x222222),
      new THREE.Color(0x444444),
      new THREE.Color(0x555555)
    ];
    
    this.init();
  }

  init(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
    this.scene.add( this.camera );
    this.camera.position.set(0, 2, 6);
    this.camera.lookAt(this.scene.position);

    // const position
    this.cameraDef = {
      x: 0,
      y: 2
    }

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

    this.fbo = new THREE.WebGLRenderTarget( this.width, this.height, renderTargetParameters );
    this.fbo.texture.format = THREE.RGBAFormat;


    this.sim = new Simulation(this.webgl, this.size);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.face = [];
    this.edge = [];

    for(let i = 0; i < this.objTypeNum; i++){
      var originalG = this.objType[i];
      this.face[i] = this.createFace(originalG, i);
      // this.edge[i] = this.createEdge(originalG, i);
    }


    
  }

  createFace(originalG, num){
    const geometry = new THREE.InstancedBufferGeometry();
    const vertices = originalG.attributes.position.clone();

    geometry.addAttribute("position", vertices);

    const normals = originalG.attributes.normal.clone();
    geometry.addAttribute("normal", normals);

      // uv
    const uvs = originalG.attributes.uv.clone();
    geometry.addAttribute("uv", uvs);

      // index
    const indices = originalG.index.clone();
    geometry.setIndex(indices);


    geometry.maxInstancedCount = this.objNum_2;

    const nums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum_2 * 1), 1, 1);

    for(let i = 0; i < nums.count; i++){
      nums.setX(i, i + this.objNum_2 * num);
    }


    geometry.addAttribute("aNum", nums);


    const material_face = new THREE.ShaderMaterial( {
      uniforms: {
        posMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
        velMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
        uSize: { type: "f", value: this.sim.size },
        uTick: { type: 'f', value: 0 },
        uScale: { type: 'f', value: 0.7 * 0.99, },
        uColorArray: {type: "v3v", value: this.colorPallete}
      },

      vertexShader: this.webgl.vertShader[1],
      fragmentShader: this.webgl.fragShader[1],
      shading: THREE.FlatShading,
      // side: THREE.DoubleSide,

    } );

    const mesh = new THREE.Mesh(geometry, material_face);

    this.group.add( mesh );

    return mesh;
  };


  createEdge(originalG, num){
    // var originalG = new THREE.OctahedronBufferGeometry(1, 0);

    this.edgesOriginalG = new THREE.EdgesGeometry(originalG);

    const geometry = new THREE.InstancedBufferGeometry();
    const vertices = this.edgesOriginalG.attributes.position.clone();

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

    const nums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum_2 * 1), 1, 1);


    // var randoms = new THREE.InstancedBufferAttribute(new Float32Array(this.sim.size * this.sim.size * 1), 1, 1);

    for(let i = 0; i < nums.count; i++){
      nums.setX(i, i + this.objNum_2 * num);
    }


    geometry.addAttribute("aNum", nums);


    const material_edge = new THREE.ShaderMaterial( {
      uniforms: {
        posMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
        velMap: { type: "t", value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
        uSize: { type: "f", value: this.sim.size },

        uTick: { type: 'f', value: 0 },
        uScale: { type: 'f', value: 0.7 },
        uColorArray: {type: "v3v", value: this.colorPallete}
      },

      vertexShader: this.webgl.vertShader[1],
      fragmentShader: this.webgl.fragShader[2]
    } );


    const mesh = new THREE.LineSegments(geometry, material_edge);
    this.group.add( mesh );
    mesh.visible = false;

    return mesh;
  }


  moveCamera(x, y){
    this.cameraOffset.x = x * 8;
    this.cameraOffset.y = y * 8;
  }

  render(time, delta){
    this.group.rotation.x += delta * 0.1;
    this.group.rotation.y -= delta * 0.08;

    // camera
    let currentCamera = {
      x: this.camera.position.x,
      y: this.camera.position.y
    };

    let dx = (this.cameraDef.x + this.cameraOffset.x) - currentCamera.x;
    let dy = (this.cameraDef.y + this.cameraOffset.y) - currentCamera.y;

    this.cameraEase2 += 0.04;
    this.cameraEase2 = Math.min(1.0, this.cameraEase2);

    var ease = this.cameraEase * this.cameraEase2;

    this.camera.position.x += dx * ease;
    this.camera.position.y += dy * ease;


    // simulation
    this.sim.velUniforms.timer.value = time;
    this.sim.velUniforms.delta.value = delta * 8.0;

    this.sim.gpuCompute.compute();

    for(let i = 0; i < this.objTypeNum; i++){
      this.face[i].material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
      this.face[i].material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

      // this.edge[i].material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
      // this.edge[i].material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

      // timer
      // this.edge[i].material.uniforms.uTick.value = this.face[i].material.uniforms.uTick.value = time;
      this.face[i].material.uniforms.uTick.value = time;
    }

    

    this.webgl.renderer.render( this.scene, this.camera, this.fbo);
  }


}