var Sound = function(path) {
  Sound.initSystem()
  this.path = path
  this.loadedPath = ''
  this.rawdata = null
  this.pool = false
  if(!Sound.Enabled) return

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
    if(!Sound.mp3) return false
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() {
      if(xmlHttp.readyState === 4) {
        console.log(xmlHttp.responseText)
      }
    }
    xmlHttp.open( "GET", this.path + '.mp3.base64', true )
    xmlHttp.send( null )
  },
  loadogg: function() {
    if(!Sound.ogg) return false


  },
  loadaac: function() {
    if(!Sound.aac) return false


  },
  loadwav: function() {
    if(!Sound.wav) return false

  },
  play: function() {
    if(!Sound.Enabled) return
    var audio = this.getAudio()
    audio.play()
  },
  getAudio: function() {
    if(this.pool)
      return this.findAvailablePooledAudio()
    var audio = new Audio()
    audio.src = this.loadedPath
    return audio
  }
}
Sound.allowBase64 = true
Sound.initSystem = function() {
  if(this.initialized) return
  var a = document.createElement('audio')
  this.Enabled = !!a.canPlayType
  this.mp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))
  this.ogg = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))
  this.wav = !!(a.canPlayType && a.canPlayType('audio/wav; codecs="1"').replace(/no/, ''))
  this.aac = !!(a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))
}

module.exports = Sound
