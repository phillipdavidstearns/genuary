var w;
var h;
var canvas;
var colors;
var initIsDone = false;
var worldIsInitialized = false;

// and world parameters
var pause = false;
var backgroundIsSet = false;
var qtyAnts;
var qtyAntsLabel;
var qtyRules;
var qtyRulesLabel;
var qtyDirections; //2 L/R, //3 L/S/R
var scale;
var palette;
var world;
var world_width;
var world_height;


// let's start w 1 ant
var ants=[];

function preload(){
  colors = loadStrings('colors.txt');
}

function setup() {
  randomSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  w = windowWidth;
  h = windowHeight;
  canvas = createCanvas(w, h);
  initAllTheThings();
}

function initAllTheThings(){
  initWorld();
  for(let i = 0 ; i < qtyAnts ; i++){
    ant = new Ant(Math.floor(world_width*fxrand()),Math.floor(world_height*fxrand()));
    ants.push(ant);
  }
  noStroke();
  initIsDone=true;
}

function draw() {
  if(initIsDone){
    if (!backgroundIsSet) setBackground();
    if (!pause){
      for(let i=0; i < qtyAnts;i++){
        ants[i].draw(world);
        ants[i].update(world);
      }
    }
  }
  if (frameCount == 500){
    fxpreview();
  }
}

function initWorld(){
  rulesRand = fxrand();
  if (rulesRand < 0.1){
    qtyRulesLabel = "A Lot";
    qtyRules = Math.round(random(21,50));
  } else if (rulesRand < 0.2){
    qtyRulesLabel = "More Than Normal";
    qtyRules = Math.round(random(11,20));
  } else if (rulesRand < 0.4){
    qtyRulesLabel = "A Good Number";
    qtyRules = Math.round(random(6,10));
  } else if (rulesRand < 0.65){
    qtyRulesLabel = "A Few";
    qtyRules = Math.round(random(3,5));
  } else {
    qtyRulesLabel = "Minimal";
    qtyRules = 2;
  }

  palette = makePalette(qtyRules);

  scaleRand = fxrand();
  if(scaleRand < 0.05){
    scale = 12;
  } else if(scaleRand < 0.2){
    scale = 16;
  } else if(scaleRand < 0.4){
    scale = 24;
  } else if(scaleRand < 0.65){
    scale = 32;
  } else {
    scale = 48;
  }
  world_width = Math.ceil(w/scale);
  world_height = Math.ceil(h/scale);
  world = new Array(world_width).fill(0).map(() => new Array(world_height).fill(0));
  worldIsInitialized = true;

  directionRand = fxrand();
   if(directionRand < 0.25){
    qtyDirections = 3;
  } else {
    qtyDirections = 2;
  }

  
  antsRand = fxrand();
  if(antsRand < 0.1){
    qtyAntsLabel = "Call The Exterminator!";
    qtyAnts = Math.round(random(17,25));
  } else if(antsRand < 0.2){
    qtyAntsLabel = "A Lot";
    qtyAnts = Math.round(random(11,16));
  } else if(antsRand < 0.4){
    qtyAntsLabel = "Some";
    if(qtyRules < 4){
      qtyAnts = Math.round(random(8,16));
    } else {
      qtyAnts = Math.round(random(4,8));
    }
  } else {
    qtyAntsLabel = "A Few";
    if(qtyRules < 4){
      qtyAnts = Math.round(random(6,10));
    } else {
      qtyAnts = Math.round(random(2,4));
    }
  }
  window.$fxhashFeatures = {
    "Number of Ants" : qtyAntsLabel,
    "Number of Rules" : qtyRulesLabel,
    "Scale" : scale
  };
}

function makePalette(_qty){
  var _palette=[];
  var _index;
  for(let i = 0; i < _qty; i++){
    index = Math.floor(colors.length*fxrand());
    _palette.push(colors[index]);
  }
  return _palette;
}

function setBackground(){
  background(palette[0]);
  backgroundIsSet = true;
}

function keyPressed(){
  switch(key){
  case 's':
    saveCanvas(canvas, 'KidA(nts)', 'png');
    break;
  case ' ':
    pause^=1;
    break;
  }
  return false;
}

class Ant{
  constructor(_x, _y){
    this.rules = [];
    this.x = _x;
    this.y = _y;
    this.initRules();
    this.direction = Math.round(3*fxrand()); // 0 = up, 1 = right, 2 = down, 3 = left 
  }

  initRules(){
    for(var i = 0 ; i < qtyRules; i++){
      this.rules.push(Math.floor(qtyDirections*fxrand()));
    }
  }

  draw(){
    fill(palette[world[this.x][this.y]]);
    square(this.x*scale, this.y*scale, scale);
  }

  update(){
    //turn ant base on rule and cur
    var _worldValue = world[this.x][this.y];
    var turn = this.rules[_worldValue];
    switch(turn){
      case 0: // left
        this.direction--;
      break;
      case 1: // right
        this.direction++;
      break;
      case 2: // straight
      break;
    }

    this.direction = (this.direction + 4) % 4;

    // increment the value of the world at the ant's current position
    world[this.x][this.y] = (_worldValue + 1) % qtyRules;

    //move ant 1 step in its new direction
    switch(this.direction){
      case 0: // up
        this.y = ((this.y - 1) + world_height) % world_height;
      break;
      case 3: // left
        this.x = ((this.x - 1) + world_width) % world_width;
      break;
      case 2: // down
        this.y = (this.y + 1) % world_height;
      break;
      case 1: // right
        this.x = (this.x + 1) % world_width;
      break;
    }
  }
}




