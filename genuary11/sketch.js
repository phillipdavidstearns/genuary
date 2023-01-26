var canvas;
var background;
var form;
var rx, ry, rz; //global rotations

var w;
var h;
var c1,c2

function setup() {
  randomSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  rx=fxrand()*PI/64;
  ry=fxrand()*PI/64;
  var min1 = 128;
  var min2 = 192;
  var ch1a, ch2a, ch3a; 
  var ch1b, ch2b, ch3b; 
  var satRand = Math.round(fxrand()*8);
  switch(satRand){
    case 0: // r v g
      ch1a = Math.floor(random(min2,256));
      ch2a = Math.floor(random(min1));
      ch3a = Math.floor(random(min1));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min2,256));
      ch3b = Math.floor(random(min1));
      break;
    case 1: // r v b
      ch1a = Math.floor(random(min2,256));
      ch2a = Math.floor(random(min1));
      ch3a = Math.floor(random(min1));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min2,256));
      break;
    case 2: // b v g
      ch1a = Math.floor(random(min1));
      ch2a = Math.floor(random(min2,256));
      ch3a = Math.floor(random(min1));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min2,256));
      break;
    case 3: // y v b
      ch1a = Math.floor(random(min2,256));
      ch2a = Math.floor(random(min2,256));
      ch3a = Math.floor(random(min1));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min2,256));
      break;
    case 4: // y v r
      ch1a = Math.floor(random(min2,256));
      ch2a = Math.floor(random(min2,256));
      ch3a = Math.floor(random(min1));

      ch1b = Math.floor(random(min2,256));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min1));
      break;
    case 5: // m v g
      ch1a = Math.floor(random(min2,256));
      ch2a = Math.floor(random(min1));
      ch3a = Math.floor(random(min2,256));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min2,256));
      ch3b = Math.floor(random(min1));
      break;
    case 6: // m v b
      ch1a = Math.floor(random(min2,256));
      ch2a = Math.floor(random(min1));
      ch3a = Math.floor(random(min2,256));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min2,256));
      break;
    case 7: // c v r
      ch1a = Math.floor(random(min1));
      ch2a = Math.floor(random(min2,256));
      ch3a = Math.floor(random(min2,256));

      ch1b = Math.floor(random(min2,256));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min1));
      break;
    case 8: // c v b
      ch1a = Math.floor(random(min1));
      ch2a = Math.floor(random(min2,256));
      ch3a = Math.floor(random(min2,256));

      ch1b = Math.floor(random(min1));
      ch2b = Math.floor(random(min1));
      ch3b = Math.floor(random(min2,256));
      break;
  }

  if(fxrand() < 0.5){
    c1 = color(ch1a,ch2a,ch3a);
    c2 = color(ch1b,ch2b,ch3b);
  } else {
    c1 = color(ch1b,ch2b,ch3b);
    c2 = color(ch1a,ch2a,ch3a);
  }

  setDims();
  canvas = createCanvas(w, h, WEBGL);
  perspective(PI/4);
  frameRate(30);
  noStroke();

  background = new ZFighterPlane(w,h, c1, c2);
  form = new ZFighterShape(Math.sqrt(w*w+h*h), c1, c2);

  window.$fxhashFeatures = {
    "Sides" : form.sides
  };
}

function windowResized() {
  setDims();
  resizeCanvas(w, h);
}

function setDims(){
  console.log(windowWidth >= windowHeight);
  if (windowWidth >= windowHeight){
    w = windowWidth;
    h = windowWidth;
  } else {
    w = windowHeight;
    h = windowHeight;
  }
}

function draw() {
  rotateX(rx);
  rotateY(ry);
  background.draw();
  form.draw();
  if(frameCount == 1){
    fxpreview();
  }
}

function keyPressed(){
  switch(keyCode){
    case 83:
      save(canvas, "Supreme_Z-Fight.png");
      return false;
    break;
  }
}

class ZFighterPlane{
  constructor(_width, _height, _c1, _c2){
    this.width = _width;
    this.height = _height;
    this.c1 = _c1;
    this.c2 = _c2;
    this.gradient = drawGradient(this.width/6, this.height/6, this.c1, this.c2);

  }

  draw(){
    push();
    // translate(this.tx,this.ty);
    // rotateZ(this.rz);
    texture(this.gradient);
    plane(this.width, this.height);
    // this.rz+=this.rzStep;
    // this.rz %= TWO_PI;
    pop();
  }

}

class ZFighterShape{
  constructor(_size, _c1, _c2){
    this.size = _size/3;
    this.c1 = _c1;
    this.c2 = _c2;
    this.c = fxrand() < 0.5 ? this.c1 : this.c2;
    this.rz = (2*fxrand()-1) * PI;
    this.sides = this.initSides();
    this.rzStep = fxrand()*0.001 *( 2 *  Math.round(fxrand()) - 1);
  }

  initSides(){
    var sidesRand = fxrand();
    if(sidesRand < 0.01){
      return 8;
    } else if(sidesRand < 0.03){
      return 7;
    } else if(sidesRand < 0.07){
      return 6;
    } else if(sidesRand < 0.15){
      return 3;
    } else if(sidesRand < 0.32){
      return 5;
    } else {
      return 4;
    }
  }

  draw(){
    push();
    rotateZ(this.rz);
    fill(this.c);
    this.ngon(this.sides, 0, 0, this.size);
    this.rz+=this.rzStep;
    this.rz %= TWO_PI;
    pop();
  }

  ngon(n, x, y, d) {
    let angle,px,py;
    beginShape();
    for (let i = 0; i < n + 1; i++) {
      angle = TWO_PI / n * i;
      px = x + sin(angle) * d/2;
      py = y - cos(angle) * d/2;
      vertex(px, py, 0);
    }
    endShape();
  }

}


function drawGradient(_w, _h, _c1, _c2){
  var gradient = createImage(Math.round(_w),Math.round(_h));
  var c;
  colorMode(RGB, 256);
  strokeWeight(1);
  gradient.loadPixels();
  for(var y = 0; y < gradient.height; y++){
    c = lerpColor(_c1,_c2,y/(gradient.height-1));
    for(var x = 0 ; x < gradient.width; x++){
      gradient.set(x,y,c);
    }
  }
  gradient.updatePixels();
  return gradient
}