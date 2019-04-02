var frames = [];
var currentFrame = 0;
var checkstatus = true;



function checkcontrol() {
  var checkBox = document.getElementById("check");
  if (checkBox.checked == true){
    checkstatus = false;
  } else {
     checkstatus = true;
  }
}


function generate(){
  
  var pixels = document.querySelectorAll(".pixel");
  var heightList = [];
  pixels.forEach(element => {
    heightList[element.dataset.pos - 1] = element.dataset.height;
  });
  frames[currentFrame] = heightList;

  var z = document.getElementById("Text");
  var buf = ":0";
  
  frames[currentFrame].forEach(element => {
      buf += element;
  });

  buf += "&";

  z.value = buf;
}


function mouseDown(e) {                             //Increase the number of pixel
  var val = parseInt(e.target.dataset.height);
  
  if(checkstatus){
    if (e.button == 0) {
      if (val < 9) {
        val++;
      }
    }
    else if (e.button == 2) {
      if (val > 0) {
        val--;
      }
    }
  }
  else{
    if (e.button == 0) {
      val= 9;
    }
    else if (e.button == 2) {
      val=0;
    }
  }
  
  e.target.dataset.height = val;
  e.target.innerText = val;
}

function saveFrame() {
  var pixels = document.querySelectorAll(".pixel");
  var heightList = [];
  pixels.forEach(element => {
    heightList[element.dataset.pos - 1] = element.dataset.height;
    element.dataset.height = 0;
    element.innerText = 0;
  });
  frames[currentFrame] = heightList;
  // frames.push(heightList);
}

function newFrame() {
  var newFrameArray = [];
  for (let index = 0; index < 64; index++) {
    newFrameArray[index] = 0;
  }
  saveFrame();
  frames.splice(currentFrame + 1, 0, newFrameArray);
  currentFrame++;

  var x = document.getElementById("mySelect");
  var option = document.createElement("option");
  option.value = currentFrame;
  option.text = "Frame = " + (frames.length); //Insanlar
  x.add(option);
  x.value = frames.length - 1;
}


function loadFrame(index) {

  var frame = frames[index];
  var pixels = document.querySelectorAll(".pixel");


  pixels.forEach(element => {
    element.dataset.height = frame[element.dataset.pos - 1];
    element.innerText = frame[element.dataset.pos - 1];
  });

  currentFrame = index;
  document.getElementById("currentframe").innerText = currentFrame + 1;
  var x = document.getElementById("mySelect");
  x.value = currentFrame;
}

function onFrameSelected(e) {
  saveFrame();
  loadFrame(parseInt(e.target.value));
}

var port;

function serialCom() {

  const SerialPort = require('serialport')
  port = new SerialPort('/dev/pts/3', { //dev/pts/3
    baudRate: 115200
  });
  // Pipe the data into another stream (like a parser or standard out)

}


function writeport(message) {
  //parser.on('data', line => console.log(`> ${line}`))
  port.write('ROBOT POWER ON\n')
}

function animationSender(frames) {
  saveFrame();
  var string = "";
  frames.forEach(element => {
    element.forEach(element2 => {
      string += element2;
    });
    string += "\n";
  });
  console.log(string);
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
