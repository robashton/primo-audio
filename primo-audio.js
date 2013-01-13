
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
    this.pool = true
    this.rawdata = new Audio()
    this.rawdata.src = this.loadedPath
  },
  detectAudio: function() {
    var attempts = [ loadmp3, loadogg, loadaac, loadwav ]
    var self = this
    var success = function(path) {
      self.loadedPath = path
      if(self.loadedPath.indexOf('data:') === 0)
        this.pool = false
      else
        this.pool = true
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
    if(data)
      return success(mime + ',' + data)
    return failure()
  })
}

function tryAudio(path, success, failure) {
  var audio = new Audio()
  try { 
    audio.src = path
  } catch(ex) {
    return failure()
  }
  return success(path)
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
