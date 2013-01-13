var Sound = require('../primo-audio')
var sound = new Sound("media/fire")

var buttons = document.getElementsByTagName("input")
for(var i = 0; i < buttons.length; i++) {
  var button = buttons[i]
  button.onclick = playSound
}

function playSound(e) {
  var ele = e.srcElement
  var times = parseInt(ele.getAttribute('value'), 10)
  for(var i = 0 ; i < times; i++)
    sound.play()
}
