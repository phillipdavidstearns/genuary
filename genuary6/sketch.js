//Following early experimentation LeWitt settled on a standard version for his modular cubes, circa 1965: the negative space between the beams would stand to the positive space of the sculptural material itself in a ratio of 8.5:1

var canvas;
var cubes = [];
var size = 100;
var unit = size/17;
var shift = size-unit;
let qtyCubes;
let marterialRand = fxrand();
let materialType="";

function setup() {
  const w = 800;
  const h = 800;
  canvas = createCanvas(w, h, WEBGL);
  frameRate(10);
  randomSeed(int(Math.pow(2,16)*fxrand())); // lock p5.js random seed to fxrand()
  let qtyCubesRand = fxrand();
  if(qtyCubesRand < 0.05){
    qtyCubes = 256;
  } else if(qtyCubesRand < 0.1){
    qtyCubes = 128;
  } else if(qtyCubesRand < 0.35){
    qtyCubes = 64;
  } else {
    qtyCubes = 32;
  }

  if(marterialRand < 0.01){
      materialType = "Normal";
    } else {
      materialType = "Specular";
    }

  camera(shift*5,-shift*Math.sqrt(50),-shift*5);

  window.$fxhashFeatures = {
    "Number of Cubes" : qtyCubes,
    "Material Type" : materialType
  };
  console.log($fxhashFeatures);
}

function draw() {
  addCube();
  background(0);
  // let locX = mouseX - width / 2;
  // let locY = mouseY - height / 2;
  // pointLight(255, 255, 255, locX, locY, 0);
  directionalLight(color(255),0,1,0);

  ambientLight(127);
  for(var i = 0; i < cubes.length; i++){
    cubes[i].draw();
  }
  orbitControl();
}

function addCube(){
  let cube;
  if (cubes.length == 0){
    cube = new Cube(size, createVector(0,0,0));
  } else if (cubes.length < qtyCubes) {
    let origin = cubes[cubes.length-1].position;
    let next = origin.copy();
    let nextRand = fxrand();
    if(nextRand < 0.1){
      nextRand = 0;
    } else if (nextRand < 0.45){
      nextRand = 1;
    } else {
      nextRand = 2;
    }
    switch(nextRand){
    case 2:
      next.x += (2 * Math.round(fxrand()) -1) * shift;
      break;
    case 0:
      if(origin.y == 0){
        next.y -= shift;
      } else {
        next.y += (2 * Math.round(fxrand()) -1) * shift;
      }
      break;
    case 1:
      next.z += (2 * Math.round(fxrand()) -1) * shift;
      break;
    }
    
    for(let i = 0; i < cubes.length; i++){
      var position = cubes[i].position;
      if( position.x == next.x && position.y == next.y && position.z == next.z){
        cube = null;
      } else {
        cube = new Cube(size, next);
      }
    }
  }
  if (cube) cubes.push(cube);
}

class Cube{
  constructor(_size, _position){
    this.size=_size;
    this.position = _position;
    this.debug = false;
  }

  draw(){
    noStroke();
    // fill(255);
    if(marterialRand < 0.01){
      normalMaterial();
    } else {
      specularMaterial(250);
      shininess(25);
    }
    let offset = this.size/17/2;
    for(let k = 0 ; k < 3;k++){
      for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 2 ; j++){
          push();
          translate(this.position.x,this.position.y,this.position.z);
          if(k == 1){
            rotateY(PI/2);
          } else if( k == 2 ){
            rotateX(PI/2);
          }
          rotateZ(i*PI/2);
          translate(-offset,this.size/2-offset,(2*j-1)*this.size/2);
          plane(16*this.size/17, this.size/16);
          pop();

          push();
          translate(this.position.x,this.position.y,this.position.z);
          if(k == 1){
            rotateY(PI/2);
          } else if( k == 2 ){
            rotateX(PI/2);
          }
          rotateZ(i*PI/2);
          translate(0,this.size/2-offset,(2*j-1)*(this.size/2-2*offset));
          plane(15*this.size/17, this.size/16);
          pop();
        }
      }
    }

    if(this.debug){
      push();
      translate(this.position.x,this.position.y,this.position.z);
      specularMaterial(255);
      stroke(255);
      strokeWeight(1);
      noFill();
      box(this.size);
      pop();
    }
  }
}