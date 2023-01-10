var w;
var h;
var canvas;
var theShader;
var vert = "./gen8.vert";
var frag = "./gen8.frag";

function preload(){
  theShader = loadShader(vert,frag);
}

function setup() {
  pixelDensity(1);
  w = windowWidth;
  h = windowHeight;
  canvas = createCanvas(w, h, WEBGL);
  randomSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  noStroke();
}

function windowResized(){
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
}


function draw() {
  theShader.setUniform('u_resolution',[w,h]);
  theShader.setUniform('u_mouse',[mouseX/w,1.0-mouseY/h]);
  theShader.setUniform('u_time', frameCount/frameRate);
  // theShader.setUniform('u_resolution', [w, h]);
  shader(theShader);
  rect(0,0,width, height);
}
