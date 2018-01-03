class Resize{
  constructor(){
    this.width = null;
    this.height = null;
    this.width_old = null;
    this.height_old = null;
    this.aspect = null;
    this.observer = [];
    this.measure();
    this.init();
  }

  init(){

    window.onresize = this.resize.bind(this);

  };


  resize(){
    if(this.timer) clearTimeout(this.timer);
    this.update();
    this.timer = setTimeout(this.update.bind(this), 200);
  };

  update(){
    this.measure();

    for(var i = 0; i < this.observer.length; i++){
      var observer = this.observer[i];
      observer.resizeUpdate();
    }
  }


  register(observer){
    this.observer.push(observer);
  };


  measure(){
    if(this.width) this.width_old = this.width;
    if(this.height) this.height_old = this.height;
    
    this.width = document.body.clientWidth;
    this.height = window.innerHeight;

    this.aspect = this.width / this.height;
  };
}

window.ResizeWatch = new Resize();