var canvas;
var fighters = [];
var rx, ry, rz; //global rotations

function setup() {
  const w = windowWidth;
  const h = windowHeight;
  canvas = createCanvas(w, h, WEBGL);
  frameRate(30);
  randomSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  rx=fxrand()*PI/16;
  ry=fxrand()*PI/16;
  rz=fxrand()*PI/4;
  var gtyFighters = Math.round(random(4,6));
  for(var i = 0; i < gtyFighters; i++){
    fighters.push(new ZFighterPlane(w,h));
  }
  perspective(PI/random(5,7),1.0,random(0.01,10),random(1000,2000));
  noStroke();
}

function draw() {
  orbitControl();
  rotateX(rx);
  rotateY(ry);
  rotateZ(rz);
  for(var i = 0; i < fighters.length; i++){
    fighters[i].draw();
  }
  if(frameCount == 1){
    fxpreview();
  }
}

function keyPressed(){
  switch(keyCode){
    case 83:
      save(canvas, "zFightingPlanes.png");
      return false;
    break;
  }
}

class ZFighterPlane{
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.gradient = drawGradient(this.width, this.height);
    this.tx=(2*fxrand()-1) * this.width / 4;
    this.ty=(2*fxrand()-1) * this.height / 4;
    this.rz=(2*fxrand()-1) * PI/2;
  }

  draw(){
    push();
    translate(this.tx,this.ty);
    rotateZ(this.rz);
    texture(this.gradient);
    plane(this.width, this.height);
    pop();
  }

}

function drawGradient(_w, _h){
  var gradient = createImage(_w,_h);
  var c;
  colorMode(RGB, 256);
  var c1 = color(random(256),random(256),random(256));
  var c2 = color(random(256),random(256),random(256));
  strokeWeight(1);
  gradient.loadPixels();
  for(var y = 0; y < gradient.height; y++){
    c = lerpColor(c1,c2,y/(gradient.height-1));
    for(var x = 0 ; x < gradient.width; x++){
      gradient.set(x,y,c);
    }
  }
  gradient.updatePixels();
  return gradient
}