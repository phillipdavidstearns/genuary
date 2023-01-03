var canvas;
var render;
var hueRange;
var hueStart;
var orientation;

async function setup() {
  pixelDensity(1);
  randomSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  noiseSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  init(); // setup the canvas dimensions
  noSmooth();
  background(0);
  noLoop();
}

function draw() {
  image(marblize(render),0,0);
  fxpreview();
  noLoop();
}

async function keyPressed(){
  switch(keyCode){
    case 83:
      await render.save("marble.png");
      return false;
    break;
  }
}

function init() {
  colorMode(HSB, 360,100,100);
  canvas = createCanvas(windowWidth, windowHeight);
  render = createGraphics(windowWidth, windowHeight);
  hueRange = random(30,180);
  hueStart = 360*fxrand();
  orientation = fxrand() < 0.5;
}

function marblize(graphics){
  graphics.background(0);
  drawLines(graphics);
  warpBand(graphics);
  warpEverything(graphics);
  return graphics
}

function warpEverything(graphics){
  var line = [];
  var scale, amplitude, shift, basis, lod, falloff, amount;

  if(orientation){ // vertical lines means horizontal band 
    basis = graphics.width;
  } else {
    basis = graphics.height;
  }

  scale = random(100,200); // noise scale 
  amplitude = random(0.5,1.5); // pixels
  lod = Math.round(random(4,8));
  falloff = random(0.3,0.7);
  shift = Math.round(basis/2.0);
  noiseDetail(lod,falloff);
  
  graphics.loadPixels();
  var coord;

  if(orientation){ // vertical lines means horizontal band/warp/shift
    for(var x = 0 ; x < graphics.width; x++){
      line = [];
      amount = getWarpAmount(x/scale,amplitude,graphics.height);
      for(var y = 0; y < graphics.height; y++){
        var y2 = Math.round(y + amount + shift + graphics.height) % graphics.height;
        line.push(graphics.get(x,y2));
      }
      for(var y = 0; y < graphics.height; y++){
        graphics.set(x,y,line[y]);
      }
    } 
  } else {
      for(var y = 0 ; y < graphics.height; y++){
      line = [];
      amount = getWarpAmount(y/scale,amplitude,graphics.width);
      for(var x = 0; x < graphics.width;x++){
        var x2 = Math.round(x + amount + shift + graphics.width) % graphics.width;
        line.push(graphics.get(x2,y));
      }
      for(var x = 0; x < graphics.width;x++){
        graphics.set(x,y,line[x]);
      }
    }
  }
  graphics.updatePixels();

  return graphics;
}

function warpBand(graphics){
  console.log('warpBand');
  var line = [];
  var size, start, scale, amplitude, shift, basis, lod, falloff, amount;

  if(orientation){ // vertical lines means horizontal band 
    basis = graphics.height;
  } else {
    basis = graphics.width;
  }

  size = Math.round(basis * random(0.5,0.75));
  start = Math.round((basis - size) * random(0.33,0.66));
  scale = random(100,300); // noise scale 
  amplitude = random(1.0,2.0); // pixels
  lod = Math.round(random(2,8));
  falloff = random(0.25,0.75);
  noiseDetail(lod,falloff);
  
  graphics.loadPixels();
  var coord;

  if(orientation){ // vertical lines means horizontal band/warp/shift
    for(var y = start ; y < start+size; y++){
      line = [];
      amount = getWarpAmount(y/scale,amplitude,graphics.width);
      for(var x = 0; x < graphics.width;x++){
        var x2 = Math.round(x + amount + graphics.width) % graphics.width;
        line.push(graphics.get(x2,y));
      }
      for(var x = 0; x < graphics.width;x++){
        graphics.set(x,y,line[x]);
      }
    }
  } else {
    for(var x = start ; x < start+size; x++){
      line = [];
      amount = getWarpAmount(x/scale,amplitude,graphics.height);
      for(var y = 0; y < graphics.height; y++){
        var y2 = Math.round(y + amount + graphics.height) % graphics.height;
        line.push(graphics.get(x,y2));
      }
      for(var y = 0; y < graphics.height; y++){
        graphics.set(x,y,line[y]);
      }
    }
  }
  graphics.updatePixels();

  return graphics;
}

function getWarpAmount(position,amplitude, max){
  return Math.round(amplitude*max*noise(position));
}

function drawLines(graphics){
  graphics.strokeWeight(1.0);
  graphics.colorMode(HSB, 360,100,100);
  if(orientation){ //true = vertical
    for(var x = 0 ; x < graphics.width; x++){
      graphics.stroke(getColor());
      graphics.line(x,0,x,graphics.height);
    }
  } else { //false = horizontal
    for(var y = 0 ; y < graphics.height; y++){
      graphics.stroke(getColor());
      graphics.line(0,y,graphics.width,y);
    }
  }
  return graphics;
}

function getColor(){
  var h = (hueRange * fxrand() + hueStart) % 360;
  var s = fxrand() * 100.0;
  var b = fxrand() * 100.0;
  colorMode(HSB, 360,100,100);
  return color(h,s,b);
}