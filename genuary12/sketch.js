var tile_w;
var tile_h;
var size;

var w;
var h;

let c1;
let c2;

let canvas;
let graphics;

let tile;

var lineBool;
var patternLabel;
var sizeLabel;

//================================================================

function setup() {

  pixelDensity(1);
  frameRate(30);
  noSmooth();

  randomSeed(int(Math.pow(2,16)*fxrand()));

  initSize();
  initColors();
  initPattern();

  w = tile_w * size;
  h = tile_h * size;
  canvas = createCanvas(w, h, WEBGL);

  tile = new Tile(tile_w, tile_h, c1, c2);

  window.$fxhashFeatures = {
    "Size" : sizeLabel,
    "Pattern" : patternLabel
  };
}

//================================================================

function draw() {
  tile.update();

  for(let y = 0 ; y < h ; y+= tile_h){
    for(let x = 0 ; x < w ; x+= tile_w){
      tile.draw(x-w/2,y-h/2);
    }
  }

  if(frameCount == 250){
    fxpreview();
  }
}

//================================================================

function initPattern(){
  var lineRand = fxrand();
  if(lineRand < 0.05){
    lineBool = false;
    patternLabel = "Lines";
  } else {
    lineBool = true;
    patternLabel = "Gradients";
  }
}

//================================================================

function initSize(){
  var sizeRand = fxrand();
  if (sizeRand < 0.01){
    tile_w = 512;
    tile_h = 512;
    size = 2;
    sizeLabel="HUGE";
  } else if (sizeRand < 0.1){
    tile_w = 256;
    tile_h = 256;
    size = 3;
    sizeLabel="Large";
  } else if (sizeRand < 0.5){
    tile_w = 128;
    tile_h = 128;
    size = 6;
    sizeLabel="medium";
  } else {
    tile_w = 64;
    tile_h = 64;
    size = 12;
    sizeLabel="small";
  }
}

//================================================================

function initColors(){
  colorMode(RGB,255);
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

  colorMode(HSB, 360);
  c1 = color(hue(c1),constrain(saturation(c1)+60,0,360),constrain(brightness(c1)-60,0,360));
  c2 = color(hue(c2),constrain(saturation(c2)-60,0,360),constrain(brightness(c2)+60,0,360));
}

//================================================================

function generateLines(_source, _div, _horizontal, _diagonal) {
  _source.noSmooth();
  _source.background(255);
  _source.stroke(0);
  _source.strokeWeight(1);
  let toggle = false;
  if (_horizontal) {
    for (let i = 0; i < _source.height; i++) {
      if (toggle) _source.line(0, i, _source.width, i);
      if ((i+1) % _div == 0) {
        toggle = !toggle;
      }
    }
    if (_diagonal){
      _source.loadPixels();
      let _buffer = createGraphics(_source.width,_source.height);
      _buffer.noSmooth();
      _buffer.image(_source,0,0);
      _buffer.loadPixels();
      let src, dst; 
      for (let x = 0; x < _source.width; x++) {
        for (let y = 0; y < _source.height; y++) {
          dst = 4*(x+y*_source.width);
          src = 4*(x+((y+x)%_source.height)*_source.width);
          _buffer.pixels[dst] = _source.pixels[src];
          _buffer.pixels[dst+1] = _source.pixels[src+1];
          _buffer.pixels[dst+2] = _source.pixels[src+2];
          _buffer.pixels[dst+3] = _source.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _source.image(_buffer,0,0);
      _buffer.remove();
    }
  } else {
    for (let i = 0; i < _source.width; i++) {
      if (toggle) _source.line(i, 0, i, _source.height);
      if ((i+1) % _div == 0) {
        toggle = !toggle;
      }
    }
    if(_diagonal){
      _source.loadPixels();
      let _buffer = createGraphics(_source.width,_source.height);
      _buffer.noSmooth();
      _buffer.image(_source,0,0);
      _buffer.loadPixels();
      let src, dst;
      for (let y = 0; y < _source.height; y++) {
        for (let x = 0; x < _source.width; x++) {
          src = 4*(x+y*_source.width);
          dst = 4*(((x+y)%_source.width)+y*_source.width);
          _buffer.pixels[dst] = _source.pixels[src];
          _buffer.pixels[dst+1] = _source.pixels[src+1];
          _buffer.pixels[dst+2] = _source.pixels[src+2];
          _buffer.pixels[dst+3] = _source.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _source.image(_buffer,0,0);
      _buffer.remove();
    }
  }
}

//================================================================

function generateGradient(_source, _a,  _b, _horizontal, _diagonal) {
  colorMode(RGB);
  _source.noSmooth();
  _source.strokeWeight(1);
  if (_horizontal) {
    for (let i = 0; i < _source.height; i++) {
      _source.stroke(lerpColor(_a,_b,i/_source.height));
     _source.line(0, i, _source.width, i);
    }
    if (_diagonal){
      _source.loadPixels();
      let _buffer = createGraphics(_source.width, _source.height);
      _buffer.noSmooth();
      _buffer.image(_source,0,0);
      _buffer.loadPixels();
      let src, dst; 
      for (let x = 0; x < _source.width; x++) {
        for (let y = 0; y < _source.height; y++) {
          dst = 4*(x+y*_source.width);
          src = 4*(x+((y+x)%_source.height)*_source.width);
          _buffer.pixels[dst] = _source.pixels[src];
          _buffer.pixels[dst+1] = _source.pixels[src+1];
          _buffer.pixels[dst+2] = _source.pixels[src+2];
          _buffer.pixels[dst+3] = _source.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _source.image(_buffer,0,0);
      _buffer.remove();
    }
  } else {
    for (let i = 0; i < _source.width; i++) {
     _source.stroke(lerpColor(_a,_b,i/float(_source.width))); 
     _source.line(i, 0, i, _source.height);
    }
    if(_diagonal){
       _source.loadPixels();
      let _buffer = createGraphics(_source.width, _source.height);
      _buffer.noSmooth();
      _buffer.image(_source,0,0);
      _buffer.loadPixels();
      let src, dst;
      for (let y = 0; y < _source.height; y++) {
        for (let x = 0; x < _source.width; x++) {
          src = 4*(x+y*_source.width);
          dst = 4*(((x+y)%_source.width)+y*_source.width);
          _buffer.pixels[dst] = _source.pixels[src];
          _buffer.pixels[dst+1] = _source.pixels[src+1];
          _buffer.pixels[dst+2] = _source.pixels[src+2];
          _buffer.pixels[dst+3] = _source.pixels[src+3];
        }
      }
      _buffer.updatePixels();
      _source.image(_buffer,0,0);
      _buffer.remove();
    }
  }
}

//================================================================

class Tile{

  constructor(_width,_height,_c1,_c2){
    this.width = _width;
    this.height = _height;
    this.vectors = new VectorMatrix(_width, _height);
    this.initVectors();
    this.buffer;
    this.source;
    this.c1 = _c1;
    this.c2 = _c2;
    this.initGraphics();
  }

  initGraphics(){
    this.source = createGraphics(this.width, this.height);
    this.source.noSmooth();
    this.buffer = createGraphics(this.width, this.height);
    this.buffer.noSmooth();
    if( lineBool < 0.05 ){
      generateLines(this.source, round(random(4, 8)), random(1.0) < 0.5, random(1.0) < 0.1);
    } else {
      generateGradient(this.source, this.c1, this.c2, random(1.0) < 0.5, random(1.0) < 0.1);
    }
  }

  initVectors(){
    for (let x = 0; x < this.width;) {
      let cols = Math.round(random(1, Math.round(this.width/4.0)));
      let end = constrain(x+cols, x, this.width);
      this.vectors.updateColumns(x, end, createVector(0, random(-2, 2)));
      x = end;
    }
    for (let y = 0; y < this.height;) {
      let rows = round(random(1, round(this.height/4.0)));
      let end = constrain(y+rows, y, this.height);
      this.vectors.updateRows(y, end, createVector(random(-2, 2), 0));
      y = end;
    }
  }

  update(){
    this.vectors.smearImage(this.source, this.buffer);
  }

  draw(_x,_y){
    push();
    translate(_x,_y);
    // rotate(PI/4);
    image(this.source,0,0);
    pop();
  }

}

//================================================================

class VectorMatrix {

  constructor(_width, _height) {
    this.width = _width;
    this.height = _height;
    this.vectors = this.initDirectionVectors();
  }

  smearImage( _source, _buffer) {
    _buffer.image(_source,0,0);
    _source.loadPixels();
    _buffer.loadPixels();
    let x2, y2;
    let src, dst;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        x2 = (Math.round(x + this.vectors[x][y].x) + this.width) % this.width;
        y2 = (Math.round(y + this.vectors[x][y].y) + this.height) % this.height;
        dst = 4*(x+y*_source.width);
        src = 4*(x2+y2*_source.width);
        _buffer.pixels[dst] = _source.pixels[src];
        _buffer.pixels[dst+1] = _source.pixels[src+1];
        _buffer.pixels[dst+2] = _source.pixels[src+2];
        _buffer.pixels[dst+3] = _source.pixels[src+3];
      }
    }
    _buffer.updatePixels();
    _source.image(_buffer,0,0);
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
