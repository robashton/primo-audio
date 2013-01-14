
var Sound = function(path) {
  Sound.initSystem()
  this.path = path
  this.loadedPath = ''
  this.rawdata = null
  this.pool = false
  if(!Sound.Enabled) return

  if(path.indexOf('.') > 0)
    this.loadAudioDirectly(path)
  else
    this.detectAudio()
}
Sound.prototype = {
  loadAudioDirectly: function(path) {
    this.loadedPath = path
    this.rawdata = new Audio()
    this.rawdata.preload = true
    this.rawdata.volume = 1.0
    this.rawdata.src = path
  },
  detectAudio: function() {
    var attempts = [ loadmp3, loadogg, loadaac, loadwav ]
    var self = this
    var success = function(rawdata) {
      self.rawdata = rawdata
    }
    var tryNext = function() {
      if(attempts.length === 0) {
        console.warn('Unable to load audio for ', self.path)
        return
      }
      var fn = attempts.shift()
      fn(self.path, success, tryNext)
    }
    tryNext()
  },
  play: function() {
    if(!Sound.Enabled) return
    this.getAudio().play()
  },
  getAudio: function() {
    if(this.pool)
      return this.findAvailablePooledAudio()
    return this.rawdata.cloneNode()
  },
  findAvailablePooledAudio: function() {
    var audio = new Audio()
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

function downloadFile(path, cb) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState === 4) {
      cb(xmlHttp.responseText)
    }
  }
  xmlHttp.open( "GET", path, true )
  xmlHttp.send( null )
}

function tryBase64(mime, path, success, failure) {
  downloadFile(path, function(data) {
    if(!data) return failure
    var audio = new Audio()
    audio.src = mime + ';base64,' + data
    return success(audio)
  })
}

function tryAudio(path, success, failure) {
  var audio = new Audio()
  try { 
    audio.src = path
  } catch(ex) {
    return failure()
  }
  return success(audio)
}

function loadmp3(path, success, failure) {
  if(!Sound.mp3) return failure()
  tryBase64('data:audio/mp3', path + '.mp3.base64', success, function() {
     tryAudio(path + '.mp3', success, failure)
   })
}

function loadogg(path, success, failure) {
  if(!Sound.ogg) return false
  tryBase64('data:audio/ogg', path + '.ogg.base64', success, function() {
    tryAudio(path + '.ogg', success, failure)
  })
}
function loadaac(path, success, failure) {
  if(!Sound.aac) return false
  tryBase64('data:audio/mp4', path + '.mp4.base64', success, function() {
     tryAudio(path + '.mp4', success, failure)
  })
}

function loadwav(path, success, failure) {
  if(!Sound.wav) return false
  tryBase64('data:audio/wav', path + '.wav.base64', success, function() {
   tryAudio(path + '.wav', success, failure)
  })
}

module.exports = Sound
