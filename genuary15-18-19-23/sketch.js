var w, h, canvas;
var rX = 0;
var rY = 0;
var rZ = 0;
var rXi = 0;
var rYi = 0;
var rZi = 0;
var j = 0;

var m = 0;
var n = 0;
var o = 0;
var p = 0;

var mi = 0;
var ni = 0;
var oi = 0;
var pi = 0;

var complexity;
var nightMode;
var play = true;

var x,y;
var theta = 0;
var points = 64;
var radius;
var shapes = 7500;

//================================================================

function setup() {

  pixelDensity(1);

  randomSeed(int(Math.pow(2,16)*fxrand()));

  w = 2400;
  h = 2400;

  canvas = createCanvas(w, h, WEBGL);
  
  rXi = random(0.005,0.01) * (fxrand() < 0.5 ? -1 : 1);
  rYi = random(0.005,0.01) * (fxrand() < 0.5 ? -1 : 1);
  rZi = random(0.005,0.01) * (fxrand() < 0.5 ? -1 : 1);

  nightMode = fxrand() < 0.005;

  if (nightMode){
    document.body.style.background = "#ffffff";
    background(0);
    stroke(255,64);
  } else {
    background(255);
    stroke(0,64);
    document.body.style.background = "#000000";
  }
  
  var miRand = fxrand();
  if(miRand < 0.01){
    mi = 0.00025;
    complexity = "Complicated";
  } else if(miRand < 0.1){
    mi = 0.0005;
    complexity = "Sophisticated";
  } else if(miRand < 0.40){
    mi = 0.00075;
    complexity = "Sorta Fancy";
  } else {
    mi = 0.001;
    complexity = "Basic";
  }

  ni = 0.001*fxrand();
  oi = 0.001*fxrand();
  pi = 0.001*fxrand();

  window.$fxhashFeatures = {
    "Complexity" : complexity,
    "Night Mode" : nightMode

  };

  console.log(window.$fxhashFeatures);

  noFill();
  strokeWeight(1);

  

}

//================================================================

function draw() {

  if (m*TWO_PI >= TWO_PI){
    fxpreview();
    noLoop();
    play = false;
  }

  if(play){
    rotateX(rX);
    rotateY(rY);
    rotateZ(rZ);
    rX+=rXi;
    rY+=rYi;
    rZ+=rZi;

    radius = w/4*sin(m*TWO_PI);
    
    push();

    rotateY(j*TWO_PI/(shapes));
    translate(w/6*sin(TWO_PI*n),w/6*sin(TWO_PI*o),w/6*sin(TWO_PI*p));

    beginShape();

    for(var i = 0; i < points; i++){
      theta = i*(TWO_PI/(points-1));
      x = radius * Math.cos(theta);
      y = radius * Math.sin(theta);
      if(i == 0 || i == points-1){
        curveVertex(x, y);
      }
      curveVertex(x, y);
    }
    endShape(CLOSE);

    pop();

    j += 1;
    m += mi;
    n += ni;
    o += oi;
    p += pi;
  }
}

