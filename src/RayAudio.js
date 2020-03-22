
import castBody from './castBody';

class RayAudio extends HTMLElement {
    constructor(){
        super();
        this.listener;
        this.rayAudio;
        this.audioCtx
        this.analyser
        this.distortion
        this.gainNode
        this.biquadFilter
        this.convolver
        this.oscillator
        this.myAudioSource
        this.waveShaper;
        this.noise 
        this.oscillator1;
        this.oscillator2;
        this.oscillator3;
        this.compressor5;
        this.wetGain;
        this.config;
        this.sourceDBGT
        this.drawVisual;
        this.source;
        this.isCaster;
        this.isCreated = false;
        this.canvas;
        this.WIDTH ;
        this.HEIGHT;
        this.canvasCtx;
        this.myStream;
        this.destination;
        this.mixedStream;
        this.remon;
        this.disableDraw = false;
        this.toggle;
        this.voiceInputListButton;
        this.voiceInputListItem;
        this.audioInputListButton;
        this.audioInputListItem;
    }
    async connectedCallback() {
        this.rayAudio = document.querySelector('ray-audio');
        this.rayAudio.innerHTML = castBody;
        this.canvas = document.querySelector('.visualizer');
        this.canvasCtx = this.canvas.getContext("2d");
        this.toggle       =  document.querySelector('.toggle');
        this.voiceInputListButton = document.querySelector('.voice-input-list-button');
        this.voiceInputListItem = document.querySelectorAll('.voice-input-list-item');
        this.audioInputListButton = document.querySelector('.audio-input-list-button');
        this.audioInputListItem = document.querySelectorAll('.audio-input-list-item');
        this.config = {
            credential: {
                key: this.rayAudio.getAttribute("key")?this.rayAudio.getAttribute("key"):'1234567890',
                serviceId: this.rayAudio.getAttribute("serviceId")?this.rayAudio.getAttribute("serviceId"):'SERVICEID1'
            },
            view: {
              local: "#localVideo",
              localStream : undefined
            },
            media: {
              audio: true,
              video: false
            }
        };
        this.parsingAttr(this.rayAudio);
     

        this.toggle.onclick = () => this.togglePlay();

        this.voiceInputListButton.onclick = () => this.showVoiceInputList();
        
        this.voiceInputListItem.forEach((element) => {
            element.onclick = () => this.updateVoiceInput(element.id);
        })
        
        this.audioInputListButton.onclick = () => this.showAudioInputList();
        
        this.audioInputListItem.forEach((element)=>{
            element.onclick = () => this.updateAudioInput(element.id);
        })
    }
    parsingAttr(rayAudio){
       
        if (rayAudio.getAttribute("listener")){
          this.listener= eval(rayAudio.getAttribute("listener"));
        }
        // this.listener.onStat = this.onStat;
        // this.listener.onAddRemoteStream= this.onAddRemoteStream;
        this.poster= (rayAudio.getAttribute('poster'))? rayAudio.getAttribute('poster'):null;
        let remonBackgroundImage = new Image();
        remonBackgroundImage.src = this.poster? this.poster:null;
        remonBackgroundImage.onload = () => {
            this.canvasCtx.drawImage(remonBackgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    updateVoiceInput(selectedId){
        console.log(selectedId)
        let selected = 'default';
        let beforeSelected = 'default';
        this.voiceInputListItem.forEach((element)=>{
            if(selectedId === element.id && !element.style.background){
                element.style.background = '#007bff'
                selected = element.id;
            }else if(selectedId === element.id && element.style.background){
                element.removeAttribute('style')
                beforeSelected = element.id;
                selected = 'default';
            }else if (selectedId !== element.id && element.style.background){
                element.removeAttribute('style')
                beforeSelected = element.id;
            }
        })
        this.freeVoice(beforeSelected);
        this.changeVoice(selected)
      }
      
    updateAudioInput(selectedId){
    let selected = 'default';
    let beforeSelected = 'default';
    this.audioInputListItem.forEach((element)=>{
        if(selectedId === element.id && !element.style.background){
            element.style.background = '#007bff'
            selected = element.id;
        }else if(selectedId === element.id && element.style.background){
            element.removeAttribute('style')
            beforeSelected = element.id;
            selected = 'default';
        }else if (selectedId !== element.id && element.style.background){
            element.removeAttribute('style')
            beforeSelected = element.id;
        }
    })
    this.freeAudio(beforeSelected);
    this.changeAudio(selected)
    }

    showVoiceInputList(){
        if(!document.querySelector('.voice-input-list').style.display || 
            document.querySelector('.voice-input-list').style.display === 'none')
        {
            document.querySelector('.voice-input-list').style.display="inline";
        }else{
            document.querySelector('.voice-input-list').style.display="";
    
        }
    }
    
    showAudioInputList(){
    if(!document.querySelector('.audio-input-list').style.display || 
        document.querySelector('.audio-input-list').style.display === 'none')
    {
        document.querySelector('.audio-input-list').style.display="inline";
    }else{
        document.querySelector('.audio-input-list').style.display="";
    
    }
    }
    
    togglePlay() {
        if(this.toggle.firstChild.className !== "fas fa-play fa-1x"){
            this.toggle.firstChild.className = "fas fa-play fa-1x";
            this.disableDraw = true;
            this.remon.close();
        }else{
            this.toggle.firstChild.className = "fas fa-stop-circle fa-1x"
            this.initAudioCtx();
            this.visualize();
            this.castStart();
        }
    }
    
    changeVoice(selected){
        switch (selected) {
            case 'default':
            
            break;
            case 'anonymous':
            this.anonymousTransform(this.myAudioSource)
            this.remon.context.audioTransceiver.sender.replaceTrack(
            this.destination.stream.getAudioTracks()[0]
            );
            break;
            case 'troll':
            this.trollTransform(this.myAudioSource)
            this.remon.context.audioTransceiver.sender.replaceTrack(
            this.destination.stream.getAudioTracks()[0]
            );
            break;
            case 'robot':
            this.robot(this.myAudioSource);
            this.remon.context.audioTransceiver.sender.replaceTrack(
            this.destination.stream.getAudioTracks()[0]
            );
            break;
        }
    }
    
    changeAudio(selected){
        switch (selected) {
            case 'DBGT01':
            this.backgroundMusic();
            this.remon.context.audioTransceiver.sender.replaceTrack(
            this.destination.stream.getAudioTracks()[0]
            );
            break;
        }
    }

    freeVoice(beforeSelected){
        switch (beforeSelected) {
            case 'default':
        
            break;
            case 'anonymous':
            this.waveShaper.disconnect(this.audioCtx.destination);
            this.waveShaper.disconnect(this.destination);
            this.noise.disconnect(this.audioCtx.destination);
            this.noise.disconnect(this.destination);
            this.oscillator.stop(0);
            this.noise.stop(0);
            this.remon.context.audioTransceiver.sender.replaceTrack(
                this.destination.stream.getAudioTracks()[0]
            );
            break;
            case 'troll':
            this.compressor5.disconnect(this.audioCtx.destination);
            this.compressor5.disconnect(this.destination);
            this.oscillator1.stop();
            this.oscillator2.stop();
            this.oscillator3.stop();
            this.remon.context.audioTransceiver.sender.replaceTrack(
                this.destination.stream.getAudioTracks()[0]
            );
            break;
            case 'robot':
            this.wetGain.disconnect(this.audioCtx.destination)
            this.wetGain.disconnect(this.destination)
            this.oscillator.stop(0);
            this.remon.context.audioTransceiver.sender.replaceTrack(
                this.destination.stream.getAudioTracks()[0]
            );
            break;
        }
    }

    freeAudio(beforeSelected){
    switch (beforeSelected) {
        case 'DBGT01':
        this.sourceDBGT.disconnect(this.destination);
        this.sourceDBGT.stop();
        break;
    }
    }

    async initAudioCtx() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        this.analyser.smoothingTimeConstant = 0.85;
    
        this.distortion = this.audioCtx.createWaveShaper();
    
        this.gainNode = this.audioCtx.createGain();
    
        this.biquadFilter = this.audioCtx.createBiquadFilter();
    
        this.convolver = this.audioCtx.createConvolver();
    
        
    
        if (navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            let constraints = {audio: true}
            try {
                this.myStream = await navigator.mediaDevices.getUserMedia(constraints);
                this.destination = this.audioCtx.createMediaStreamDestination();
                console.log(this.myStream)
                this.myAudioSource = this.audioCtx.createMediaStreamSource(this.myStream);
                this.myAudioSource.connect(this.analyser);
                // gainNode.connect();
                this.analyser.connect(this.audioCtx.destination);
                this.myAudioSource.connect(this.destination);
                // caveTransform(source);
                // await finishedLoading(destination,myAudioSource)
                this.config.view.localStream = this.destination.stream;
                
               
                
                // source.connect(distortion);
                // distortion.connect(biquadFilter);
                // biquadFilter.connect(gainNode);
                // convolver.connect(gainNode);
                // oscillator.connect(audioCtx.destination);
                // oscillator.start(0); 
            
            } catch (error) {
            console.log('The following gUM error occured: ' + error);
            }
        } 
        else{
        console.log('getUserMedia not supported on your browser!');
        }
    
        
    }
    
    visualize() {
        this.WIDTH = this.canvas.width;
        this.HEIGHT = this.canvas.height;
    
          this.analyser.fftSize = 2048;
          var bufferLength = this.analyser.fftSize;
          console.log(bufferLength);
          var dataArray = new Uint8Array(bufferLength);
    
          this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    
          var draw = ()=>{
            if(this.disableDraw){
                this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
                return;
            }
            this.drawVisual = requestAnimationFrame(draw);
            this.analyser.getByteTimeDomainData(dataArray);
    
            this.canvasCtx.fillStyle = 'rgb(155, 168, 172)';
            this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    
            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.strokeStyle = 'rgb(65, 105, 117)';
    
            this.canvasCtx.beginPath();
    
            var sliceWidth = this.WIDTH * 1.0 / bufferLength;
            var x = 0;
    
            for(var i = 0; i < bufferLength; i++) {
    
              var v = dataArray[i] / 128.0;
              var y = v * this.HEIGHT/2;
                
              if(i === 0) {
                this.canvasCtx.moveTo(x, y);
              } else {
                this.canvasCtx.lineTo(x, y);
              }
    
              x += sliceWidth;
            }
    
            this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
            this.canvasCtx.stroke();
           
          };
    
          draw();
    
    
    }
    
    async anonymousTransform(source, distortionAmount=30) {
    
      // Wave shaper
      this.waveShaper = this.audioCtx.createWaveShaper();
      this.waveShaper.curve = makeDistortionCurve(distortionAmount);
      function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50;
        var n_samples = 44100;
        var curve = new Float32Array(n_samples);
        var deg = Math.PI / 180;
        var x;
        for (let i = 0; i < n_samples; ++i ) {
          x = i * 2 / n_samples - 1;
          curve[i] = ( 3 + k ) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
      }
      this.noise = this.audioCtx.createBufferSource();
      this.oscillator = this.audioCtx.createOscillator();
      // Reverb
      let convolver = this.audioCtx.createConvolver();
     
    
      // Wobble
      this.oscillator.frequency.value = 50;
      this.oscillator.type = 'sawtooth';
      // ---
      let oscillatorGain = this.audioCtx.createGain();
      oscillatorGain.gain.value = 0.005;
      // ---
      let delay = this.audioCtx.createDelay();
      delay.delayTime.value = 0.01;
      
      // White noise
      let noiseBuffer = this.audioCtx.createBuffer(1, 32768, this.audioCtx.sampleRate)
      let noiseData = noiseBuffer.getChannelData(0);
      for (var i = 0; i < 32768; i++) { noiseData[i] = Math.random()*Math.random()*Math.random()*Math.random()*Math.random()*Math.random()*0.6; }
      this.noise.buffer = noiseBuffer;
      this.noise.loop = true;
    
      // Create graph
      this.oscillator.connect(oscillatorGain);
      oscillatorGain.connect(delay.delayTime);
      // ---
      source.connect(delay)
      delay.connect(this.waveShaper);
      //delay.connect(convolver);
      //convolver.connect(waveShaper);
      this.waveShaper.connect(this.audioCtx.destination);
      this.waveShaper.connect(this.destination);
      // ---
      this.noise.connect(this.audioCtx.destination);
      this.noise.connect(this.destination);
      // Render
      this.oscillator.start(0);
      this.noise.start(0);
      // source.start(0);
      // let outputAudioBuffer = await audioCtx.startRendering();
      return ;
    
    }
    
    async trollTransform(source) {
      // Source
    
      // Wobble
      this.oscillator1 = this.audioCtx.createOscillator();
      this.oscillator1.frequency.value = -10;
      this.oscillator1.type = 'sawtooth';
    
      this.oscillator2 = this.audioCtx.createOscillator();
      this.oscillator2.frequency.value = 50;
      this.oscillator2.type = 'sawtooth';
    
      this.oscillator3 = this.audioCtx.createOscillator();
      this.oscillator3.frequency.value = 30;
      this.oscillator3.type = 'sawtooth';
      // ---
      let oscillatorGain = this.audioCtx.createGain();
      oscillatorGain.gain.value = 0.007;
      // ---
      let oscillatorGain2 = this.audioCtx.createGain();
      oscillatorGain2.gain.value = 0.007;
      // ---
      let delay = this.audioCtx.createDelay();
      delay.delayTime.value = 0.01;
      // ---
      let delay2 = this.audioCtx.createDelay();
      delay2.delayTime.value = 0.01;
    
      let filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2000;
    
      let compressor = this.audioCtx.createDynamicsCompressor();
      let compressor2 = this.audioCtx.createDynamicsCompressor();
      let compressor3 = this.audioCtx.createDynamicsCompressor();
      let compressor4 = this.audioCtx.createDynamicsCompressor();
      this.compressor5 = this.audioCtx.createDynamicsCompressor();
    
      // Create graph
      this.oscillator1.connect(oscillatorGain);
      this.oscillator2.connect(oscillatorGain);
      // oscillator3.connect(oscillatorGain);
      oscillatorGain.connect(delay.delayTime);
      // ---
      source.connect(compressor2)
      compressor2.connect(delay);
      delay.connect(compressor3)
      compressor3.connect(filter);
      filter.connect(this.compressor5)
    
    
      this.oscillator3.connect(oscillatorGain2);
      oscillatorGain2.connect(delay2.delayTime);
    
      source.connect(compressor)
      compressor.connect(delay2);
      delay2.connect(compressor4)
      compressor4.connect(filter)
      filter.connect(this.compressor5);
    
      this.compressor5.connect(this.audioCtx.destination);
      this.compressor5.connect(this.destination);
    
      //
      //filter.connect(audioCtx.destination);
      //compressor.connect(audioCtx.destination);
    
      // source.connect(delay);
      // delay.connect(filter);
      // filter.connect(audioCtx.destination);
    
      // Render
      this.oscillator1.start(0);
      this.oscillator2.start(0);
      this.oscillator3.start(0);
      // source.start(0);
      // fire.start(0);
      return ;
    
    }
    
    async backgroundMusic(myAudio) {
      // Create two sources and play them both together.
      this.sourceDBGT = this.audioCtx.createBufferSource();
      this.sourceDBGT.buffer = await this.audioCtx.decodeAudioData(await (await fetch("/01PrologueSubtitle.mp3")).arrayBuffer());
      // source2.buffer = await audioCtx.decodeAudioData(await (await fetch("/47ABeautifulPlanet.mp3")).arrayBuffer());
    
      // source1.connect(audioCtx.destination);
      this.sourceDBGT.connect(this.audioCtx.destination);
      this.sourceDBGT.connect(this.destination);
      this.sourceDBGT.start(0);
      // source2.start(0);
    }
    
    async caveTransform(source) {
    
      // Reverb
      let convolver = this.audioCtx.createConvolver();
      this.convolver.buffer = await this.audioCtx.decodeAudioData(await (await fetch("/zapsplat_horror_dungeon_amb_cold_eerie_dark_44127.mp3")).arrayBuffer());
     
      // Create graph
      source.connect(convolver);
      convolver.connect(this.audioCtx.destination);
      convolver.connect(this.destination);
    
    
      // Render
      // source.start(0);
      // let outputAudioBuffer = await ctx.startRendering();
      // return outputAudioBuffer;
      return;
    
    }
    
    async robot(source) {
    
      // Input
      // Delay
      let delayNode = this.audioCtx.createDelay();
      delayNode.delayTime.value = 0.02;
      this.cdelay = delayNode;
    
      this.oscillator = this.audioCtx.createOscillator();
      let gain = this.audioCtx.createGain();
      this.wetGain = this.audioCtx.createGain();
    
      gain.gain.value = 0.002; // depth of change to the delay:
      this.cdepth = gain;
    
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = 1200;
      this.cspeed = this.oscillator;
    
      this.oscillator.connect( gain );
      gain.connect( delayNode.delayTime );
      source.connect( delayNode );
      delayNode.connect( this.wetGain );
      this.wetGain.connect( this.audioCtx.destination );
      this.wetGain.connect(this.destination);
    
      this.oscillator.start(0);
      // inputNode.start(0);
      // let outputAudioBuffer = await audioCtx.startRendering();
      // return outputAudioBuffer;
      return;
    
    }
    
    async alien(source) {
    
    
      // Wave shaper
      waveShaper = audioCtx.createWaveShaper();
      waveShaper.curve = makeDistortionCurve(30);
      function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50;
        var n_samples = 44100;
        var curve = new Float32Array(n_samples);
        var deg = Math.PI / 180;
        var x;
        for (let i = 0; i < n_samples; ++i ) {
          x = i * 2 / n_samples - 1;
          curve[i] = ( 3 + k ) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
      }
    
      let lpf1 = audioCtx.createBiquadFilter();
      lpf1.type = "lowpass";
      lpf1.frequency.value = 5000.0;
      let lpf2 = audioCtx.createBiquadFilter();
      lpf2.type = "lowpass";
      lpf2.frequency.value = 5000.0;
      let hpf1 = audioCtx.createBiquadFilter();
      hpf1.type = "highpass";
      hpf1.frequency.value = 1500.0;
      let hpf2 = audioCtx.createBiquadFilter();
      hpf2.type = "highpass";
      hpf2.frequency.value = 1500.0;
      let compressor = audioCtx.createDynamicsCompressor();
      lpf1.connect( lpf2 );
      lpf2.connect( hpf1 );
      hpf1.connect( hpf2 );
      hpf2.connect( waveShaper );
      waveShaper.connect( compressor );
      compressor.connect( audioCtx.destination );
    
      source.connect(lpf1);
    
      // source.start(0);
      // return await ctx.startRendering();
      return;
    }
    
    castStart() {
    if (this.isCreated) {
        this.isCreated = false;
        this.remon.close();
    } else {
        this.isCreated = true;
        this.isCaster = true;
        this.channelId= this.rayAudio.getAttribute('channelId');
        this.remon = new Remon({ config: this.config, listener: this.listener });
        this.remon.createCast(this.channelId?this.channelId:undefined);
    }
    }
}

customElements.define('ray-audio', RayAudio);
