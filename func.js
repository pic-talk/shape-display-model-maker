var frames = []; //Frames will be stored here
var frameNames = [];
var currentFrame = 0; //Index of currentFrame
var checkstatus = true; //Check for rough


function download() {

  var fs = require('fs');
  let author = document.getElementById("author");
  let packagename = document.getElementById("packagename");
  let modelname = document.getElementById("modelname");

  frameNames.splice(currentFrame + 1, 0, modelname.value);
  
  var d = new Date(),  //Get the current time
    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  let time = h + ':' + m;

  var string = "$PIC-TALK Shape Display Package\n$Package: "+packagename.value+"\n$Created Time: "+time + "\n$Author: "+author.value +"\n";


  var x = 0;
  
  frames.forEach(element => {
    string += frameNames[x++] + "/";
    element.forEach(element2 => {
      string += element2;
    });
    string += "\n";
  });
  console.log(string);

  try { fs.writeFileSync(packagename.value + ".ptsd", string, 'utf-8'); }
  catch (e) { alert('Failed to save the file !'); }
}



function checkcontrol() {
  var checkBox = document.getElementById("check");
  if (checkBox.checked == true) {
    checkstatus = false;
  } else {
    checkstatus = true;
  }
}


function generate() {

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

  if (checkstatus) {
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
  else {
    if (e.button == 0) {
      val = 9;
      e.target.style.backgroundColor = "red";
    }
    else if (e.button == 2) {
      val = 0;

      e.target.style.backgroundColor = "white";
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
    element.style.backgroundColor = "white";
  });
  frames[currentFrame] = heightList;
  // frames.push(heightList);
}

function newFrame() {

  let modelname = document.getElementById("modelname");

  var newFrameArray = [];
  for (let index = 0; index < 64; index++) {
    newFrameArray[index] = 0;
  }
  saveFrame();
  frameNames.splice(currentFrame + 1, 0, modelname.value);
  frames.splice(currentFrame + 1, 0, newFrameArray);
  currentFrame++;

  var x = document.getElementById("mySelect");
  var option = document.createElement("option");
  option.value = currentFrame;
  option.text = "Frame = " + (frames.length); //
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

function serialCom() {   // Send the serial port demo application

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
