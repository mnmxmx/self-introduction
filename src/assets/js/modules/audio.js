export default class Audio{
  constructor(webgl){
    this.webgl = webgl;
    this.audioContext = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
    // this.isReady = false;
    this.soundData = null;



    if(Useragnt.ios){
      let buf = this.audioContext.createBuffer(1, 1, 22050);
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = buf;
      this.source.connect(this.audioContext.destination);
      this.source.start(0);
    }

    this.offsetTime = null;

    this.bpm = 120 * 4;
    this.beat = 60 / this.bpm;
    this.offsetBeat = (2 + 4 * 2) * this.beat;
    // 小節の数 * 拍, 小節の数、拍
    this.beatCount = [0, 0, 0];

    this.fadeoutStartBeat = 1816;
  }

  init(){
    this.setAudio();
  }

  setAudio(startTime, isResume){
    this.audioContext.decodeAudioData(this.webgl.audios[0].slice(0), function(buffer){
      if(this.source) {
        this.source.stop();
        console.log("init stop");
      }

      console.log(this.webgl.isTabBlur);

      if(!this.webgl.isTabBlur){
        this.connectNode(buffer, startTime);

        if(isResume){
          this.audioContext.resume();
        }
      }

      

      this.webgl.isAudioReady = true;
    }.bind(this));
  };

  pauseAudio(){
    this.audioContext.suspend();
    if(this.source) this.source.stop();
    this.source = null;
    
    console.log("stop");
  }

  resumeAudio(){
    this.setAudio(this.sourceCurrentTime, true);
    console.log("resume");

  }

  connectNode(buffer, startTime){
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = buffer;

    // this.source.onended = function(){
    //   this.webgl.isAudioEnd = true;
    //   if(this.sourceCurrentTime < this.source.buffer.duration){
    //     this.webgl.isAudioEnd = false;
    //   }
    //   console.log("onended", this.source);
    // }.bind(this)


    this.source.connect(this.audioContext.destination);

    if(startTime){
      this.source.start(0, startTime);
      this.webgl.restartRendering();
    } else {
      this.offsetTime = this.audioContext.currentTime;
      console.log(this.source.buffer.duration);
      this.source.start(0);
    }

    this.webgl.isAudioEnd = false;

    // console.log(this.webgl.isAudioEnd, "connect");
  }

  detectFadeout(){
    const beat = this.beatCount[0] - 4;
    if(this.fadeoutStartBeat < beat){
      this.webgl.fadeOut();
    }
  }

  detectEnd(){
    if(!this.webgl.isPlaying) return;
    // console.log(this.webgl.isPlaying, this.sourceCurrentTime > this.source.buffer.duration);
    if(this.sourceCurrentTime > this.source.buffer.duration){
      this.webgl.isPlaying = false;
      this.webgl.reset();
      
    }
  }

  reset(){
    this.beatCount = [0, 0, 0];
  }


  render(){
    var currentTime = this.audioContext.currentTime - this.offsetTime;
    this.sourceCurrentTime = currentTime;
    currentTime -= this.offsetBeat;

    this.detectEnd();

    if(currentTime >= this.beatCount[0] * this.beat && !this.webgl.isAudioEnd){
      this.detectFadeout();
      this.beatCount[0] = Math.floor(currentTime / this.beat) + 1;
      this.beatCount[1] = Math.floor(this.beatCount[0] / 4);
      this.beatCount[2] =  (this.beatCount[0]) % 4;
      return [this.beatCount[0] - 4, this.beatCount[1] - 1, this.beatCount[2]];
    }
  }
}