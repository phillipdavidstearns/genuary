const w = 480;
const h = 480; 

let c1;
let c2;

let matrix;

// graphics contexts
let source;
let buffer;

let canvas;


function setup() {
  pixelDensity(1);
  frameRate(30);
  noSmooth();
  randomSeed(int(Math.pow(2,16)*fxrand()));
  canvas = createCanvas(w, h);
  initMatrix();
  initColors();
  initGraphics();
}

function draw() {
  image(source, 0, 0);
  matrix.smearImage(source);
  if(frameCount == 250){
    fxpreview();
  }
}

function initMatrix(){

  matrix = new VectorMatrix(w, h);

  for (let x = 0; x < w;) {
    let cols = Math.round(random(1, Math.round(w/4.0)));
    let end = constrain(x+cols, x, w);
    matrix.updateColumns(x, end, createVector(0, random(-2, 2)));
    x = end;
  }

  for (let y = 0; y < h;) {
    let rows = round(random(1, round(h/4.0)));
    let end = constrain(y+rows, y, h);
    matrix.updateRows(y, end, createVector(random(-2, 2), 0));
    y = end;
  }
}

function initColors(){
  colorMode(HSB, 100);
  let a,b;
  a = color(random(100),random(25,75),random(80,100),255);
  b = color(random(100),random(25,75),random(40,60),255);
  if(fxrand() < 0.5){
    c1=a;
    c2=b;
  } else {
    c1=b;
    c2=a;
  }
}

function initGraphics(){
  source = createGraphics(w, h);
  source.noSmooth();
  buffer = createGraphics(w, h);
  buffer.noSmooth();
  if(random(1.0) < 0.01 ){
    generateLines(source, round(random(4, 8)), random(1.0) < 0.5, random(1.0) < 0.1);
  } else {
    generateGradient(source, c1,c2, random(1.0) < 0.5, random(1.0) < 0.1);
  }
}

function generateLines(_graphics, _div, _horizontal, _diagonal) {
  _graphics.noSmooth();
  _graphics.background(255);
  _graphics.stroke(0);
  _graphics.strokeWeight(1);
  let toggle = false;
  if (_horizontal) {
    for (let i = 0; i < _graphics.height; i++) {
      if (toggle) _graphics.line(0, i, _graphics.width, i);
      if ((i+1) % _div == 0) {
        toggle = !toggle;
      }
    }
    if (_diagonal){
      _graphics.loadPixels();
      let _buffer = createGraphics(_graphics.width,_graphics.height);
      _buffer.noSmooth();
      _buffer.image(_graphics,0,0);
      _buffer.loadPixels();
      let src, dst; 
      for (let x = 0; x < _graphics.width; x++) {
        for (let y = 0; y < _graphics.height; y++) {
          dst = 4*(x+y*_graphics.width);
          src = 4*(x+((y+x)%_graphics.height)*_graphics.width);
          _buffer.pixels[dst] = _graphics.pixels[src];
          _buffer.pixels[dst+1] = _graphics.pixels[src+1];
          _buffer.pixels[dst+2] = _graphics.pixels[src+2];
          _buffer.pixels[dst+3] = _graphics.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _graphics.image(_buffer,0,0);
      _buffer.remove();
    }
  } else {
    for (let i = 0; i < _graphics.width; i++) {
      if (toggle) _graphics.line(i, 0, i, _graphics.height);
      if ((i+1) % _div == 0) {
        toggle = !toggle;
      }
    }
    if(_diagonal){
      _graphics.loadPixels();
      let _buffer = createGraphics(_graphics.width,_graphics.height);
      _buffer.noSmooth();
      _buffer.image(_graphics,0,0);
      _buffer.loadPixels();
      let src, dst;
      for (let y = 0; y < _graphics.height; y++) {
        for (let x = 0; x < _graphics.width; x++) {
          src = 4*(x+y*_graphics.width);
          dst = 4*(((x+y)%_graphics.width)+y*_graphics.width);
          _buffer.pixels[dst] = _graphics.pixels[src];
          _buffer.pixels[dst+1] = _graphics.pixels[src+1];
          _buffer.pixels[dst+2] = _graphics.pixels[src+2];
          _buffer.pixels[dst+3] = _graphics.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _graphics.image(_buffer,0,0);
      _buffer.remove();
    }
  }
}


function generateGradient(_graphics, _a,  _b, _horizontal, _diagonal) {
  colorMode(RGB);
  _graphics.noSmooth();
  _graphics.strokeWeight(1);
  if (_horizontal) {
    for (let i = 0; i < _graphics.height; i++) {
      _graphics.stroke(lerpColor(_a,_b,i/_graphics.height));
     _graphics.line(0, i, _graphics.width, i);
    }
    if (_diagonal){
      _graphics.loadPixels();
      let _buffer = createGraphics(_graphics.width, _graphics.height);
      _buffer.noSmooth();
      _buffer.image(_graphics,0,0);
      _buffer.loadPixels();
      let src, dst; 
      for (let x = 0; x < _graphics.width; x++) {
        for (let y = 0; y < _graphics.height; y++) {
          dst = 4*(x+y*_graphics.width);
          src = 4*(x+((y+x)%_graphics.height)*_graphics.width);
          _buffer.pixels[dst] = _graphics.pixels[src];
          _buffer.pixels[dst+1] = _graphics.pixels[src+1];
          _buffer.pixels[dst+2] = _graphics.pixels[src+2];
          _buffer.pixels[dst+3] = _graphics.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _graphics.image(_buffer,0,0);
      _buffer.remove();
    }
  } else {
    for (let i = 0; i < _graphics.width; i++) {
     _graphics.stroke(lerpColor(_a,_b,i/float(_graphics.width))); 
     _graphics.line(i, 0, i, _graphics.height);
    }
    if(_diagonal){
       _graphics.loadPixels();
      let _buffer = createGraphics(_graphics.width, _graphics.height);
      _buffer.noSmooth();
      _buffer.image(_graphics,0,0);
      _buffer.loadPixels();
      let src, dst;
      for (let y = 0; y < _graphics.height; y++) {
        for (let x = 0; x < _graphics.width; x++) {
          src = 4*(x+y*_graphics.width);
          dst = 4*(((x+y)%_graphics.width)+y*_graphics.width);
          _buffer.pixels[dst] = _graphics.pixels[src];
          _buffer.pixels[dst+1] = _graphics.pixels[src+1];
          _buffer.pixels[dst+2] = _graphics.pixels[src+2];
          _buffer.pixels[dst+3] = _graphics.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _graphics.image(_buffer,0,0);
      _buffer.remove();
    }
  }
}

class VectorMatrix {

  constructor(_width, _height) {
    this.width = _width;
    this.height = _height;
    this.vectors = this.initDirectionVectors();
  }

  smearImage( _graphics) {
    buffer.image(_graphics,0,0);
    _graphics.loadPixels();
    buffer.loadPixels();
    let x2, y2;
    let src, dst;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        x2 = (Math.round(x + this.vectors[x][y].x) + this.width) % this.width;
        y2 = (Math.round(y + this.vectors[x][y].y) + this.height) % this.height;
        dst = 4*(x+y*_graphics.width);
        src = 4*(x2+y2*_graphics.width);
        buffer.pixels[dst] = _graphics.pixels[src];
        buffer.pixels[dst+1] = _graphics.pixels[src+1];
        buffer.pixels[dst+2] = _graphics.pixels[src+2];
        buffer.pixels[dst+3] = _graphics.pixels[src+3];
      }
    }
    buffer.updatePixels();
    _graphics.image(buffer,0,0);
  }

  initDirectionVectors() {
    this.vectors = new Array(this.width).fill(null).map(() => new Array(this.height).fill(null));
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.vectors[x][y] = createVector(0,0);
      }
    }
    return this.vectors;
  }

  randomizeDirectionVectors(_mag) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.vectors[x][y] = random2D().setMag(_mag);
      }
    }
    return this.vectors;
  }

  updateColumns(_start,_end, _vector) {
    for (let x = _start; x < _end; x++) {
      this.updateColumn(x, _vector);
    }
    return this.vectors;
  }

 updateColumn(_col, _vector) {
    if (_col >= 0 && _col < this.width) {
      for (let y = 0; y < this.height; y++) {
        this.vectors[_col][y].x += _vector.x;
        this.vectors[_col][y].y += _vector.y;
      }
    }
    return this.vectors;
  }

  updateRows(_start, _end, _vector) {
    for (let y = _start; y < _end; y++) {
      this.updateRow(y, _vector);
    }
    return this.vectors;
  }

  updateRow(_row, _vector) {
    if (_row >= 0 && _row < this.height) {
      for (let x = 0; x < this.width; x++) {
        this.vectors[x][_row].x += _vector.x;
        this.vectors[x][_row].y += _vector.y;
      }
    }
    return this.vectors;
  }
}
