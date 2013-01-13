var Sound = function(path) {
  Sound.initSystem()
  this.path = path
  this.loadedPath = ''
  this.rawdata = null
  if(!this.audio) return
  if(path.indexOf('.') > 0)
    this.loadAudioDirectly()
  else
    this.detectAudio()
}
Sound.prototype = {
  loadAudioDirectly: function() {
    this.rawdata = new Audio()
    this.rawdata.src = this.loadedPath
  },
  detectAudio: function() {
    if(this.loadmp3()) return
    if(this.loadogg()) return
    if(this.loadaac()) return
    if(this.loadwav()) return
    console.warn('Unable to load suitable audio for ', this.path)
  },
  loadmp3: function() {


  },
  loadogg: function() {


  },
  loadaac: function() {


  },
  loadwav: function() {


  }
}
Sound.allowBase64 = true
Sound.initSystem = function() {
  if(this.initialized) return
  var a = document.createElement('audio')
  this.audio = !!a.canPlayType
  this.mp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))
  this.ogg = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))
  this.wav = !!(a.canPlayType && a.canPlayType('audio/wav; codecs="1"').replace(/no/, ''))
  this.aac = !!(a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))
  a.remove()
}

module.exports = Sound
