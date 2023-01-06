// canvas dimensions
int w = 480;
int h = 480;
VectorMatrix matrix;
PGraphics lines;
PImage buffer;

void setup() {
  surface.setSize(w, h);
  matrix = new VectorMatrix(w, h);
  
  for (int x = 0; x < w; ) {
    int cols = round(random(1, round(w/4.0)));
    int end = constrain(x+cols, x, w);
    matrix.updateColumns(x, end, new PVector(0, random(-2, 2)));
    x = end;
  }
  
  for (int y = 0; y < h; ) {
    int rows = round(random(1, round(h/4.0)));
    int end = constrain(y+rows, y, h);
    matrix.updateRows(y, end, new PVector(random(-2, 2), 0));
    y = end;
  }
  
  if(random(1.0) < 0.01 ){
    lines = generateLines(w, h, round(random(1, 4)), random(1.0) < 0.5, random(1.0) < 0.1);
  } else {
    color a = color(round(random(255)),round(random(255)),round(random(255)));
    color b = color(round(random(255)),round(random(255)),round(random(255)));
    lines = generateGradient(w, h, a,b, random(1.0) < 0.5, random(1.0) < 0.1);
  }
  buffer = lines.copy();
}

void draw() {
  image(buffer, 0, 0);
  buffer = matrix.smearImage(buffer);
}


PGraphics generateLines(int _w, int _h, int _div, boolean _horizontal, boolean _diagonal) {
  PGraphics graphics = createGraphics(_w, _h);
  graphics.noSmooth();
  graphics.beginDraw();
  graphics.background(255);
  graphics.stroke(0);
  graphics.strokeWeight(1);
  boolean toggle = false;
  if (_horizontal) {
    for (int i = 0; i < _h; i++) {
      if (toggle) graphics.line(0, i, _w, i);
      if ((i+1) % _div == 0) {
        toggle = !toggle;
      }
    }
    if (_diagonal){
      graphics.loadPixels();
      color[] buffer = graphics.pixels.clone();
      for (int x = 0; x < _w; x++) {
        for (int y = 0; y < _h; y++) {
          buffer[_w*y+x] = graphics.pixels[_w*((y+x)%_h)+x];
        }
      }
      graphics.pixels = buffer.clone();
      graphics.updatePixels();
    }
  } else {
    for (int i = 0; i < _w; i++) {
      if (toggle) graphics.line(i, 0, i, _h);
      if ((i+1) % _div == 0) {
        toggle = !toggle;
      }
    }
    if(_diagonal){
    graphics.loadPixels();
      color[] buffer = graphics.pixels.clone();
      for (int y = 0; y < _h; y++) {
        for (int x = 0; x < _w; x++) {
          buffer[_w*y+x] = graphics.pixels[_w*y+((x-y)%_w)];
        }
      }
      graphics.pixels = buffer.clone();
      graphics.updatePixels();
    }
  }
  graphics.endDraw();
  return graphics;
}

PGraphics generateGradient(int _w, int _h, color _a, color _b, boolean _horizontal, boolean _diagonal) {
  PGraphics graphics = createGraphics(_w, _h);
  graphics.noSmooth();
  graphics.beginDraw();
  graphics.background(255);
  graphics.strokeWeight(1);
  if (_horizontal) {
    for (int i = 0; i < _h; i++) {
      graphics.stroke(lerpColor(_a,_b,i/float(_h)));
      graphics.line(0, i, _w, i);
    }
    if (_diagonal){
      graphics.loadPixels();
      color[] buffer = graphics.pixels.clone();
      for (int x = 0; x < _w; x++) {
        for (int y = 0; y < _h; y++) {
          buffer[_w*y+x] = graphics.pixels[_w*((y+x)%_h)+x];
        }
      }
      graphics.pixels = buffer.clone();
      graphics.updatePixels();
    }
  } else {
    for (int i = 0; i < _w; i++) {
     graphics.stroke(lerpColor(_a,_b,i/float(_w))); 
     graphics.line(i, 0, i, _h);
    }
    if(_diagonal){
      graphics.loadPixels();
      color[] buffer = graphics.pixels.clone();
      for (int y = 0; y < _h; y++) {
        for (int x = 0; x < _w; x++) {
          buffer[_w*y+x] = graphics.pixels[_w*y+((x-y)%_w)];
        }
      }
      graphics.pixels = buffer.clone();
      graphics.updatePixels();
    }
  }
  graphics.endDraw();
  return graphics;
}


class VectorMatrix {
  int width;
  int height;
  DirectionVector[][] vectors;

  VectorMatrix(int _width, int _height) {
    this.width = _width;
    this.height = _height;
    this.initDirectionVectors();
  }

  PImage smearImage(PImage _image) {
    PImage buffer = _image.copy();
    _image.loadPixels();
    buffer.loadPixels();
    for (int y = 0; y < this.height; y++) {
      for (int x = 0; x < this.width; x++) {
        int x2 = (int(x + this.vectors[x][y].direction.x) + this.width) % this.width;
        int y2 = (int(y + this.vectors[x][y].direction.y) + this.height) % this.height;
        buffer.pixels[buffer.width*y+x] = _image.pixels[_image.width*y2+x2];
      }
    }
    buffer.updatePixels();
    return buffer;
  }

  DirectionVector[][] initDirectionVectors() {
    println("initTheMatrix");
    this.vectors = new DirectionVector[this.width][this.height];
    for (int y = 0; y < this.height; y++) {
      for (int x = 0; x < this.width; x++) {
        this.vectors[x][y] = new DirectionVector(x, y);
      }
    }
    return this.vectors;
  }

  DirectionVector[][] randomizeDirectionVectors(float _mag) {
    for (int y = 0; y < this.height; y++) {
      for (int x = 0; x < this.width; x++) {
        this.vectors[x][y].setDirection(PVector.random2D().setMag(_mag));
      }
    }
    return this.vectors;
  }

  DirectionVector[][] updateColumns(int _start, int _end, PVector _vector) {
    for (int x = _start; x < _end; x++) {
      this.updateColumn(x, _vector);
    }
    return this.vectors;
  }

  DirectionVector[][] updateColumn(int _col, PVector _vector) {
    if (_col >= 0 && _col < this.width) {
      for (int y = 0; y < this.height; y++) {
        this.vectors[_col][y].addDirection(_vector);
      }
    }
    return this.vectors;
  }

  DirectionVector[][] updateRows(int _start, int _end, PVector _vector) {
    for (int y = _start; y < _end; y++) {
      this.updateRow(y, _vector);
    }
    return this.vectors;
  }

  DirectionVector[][] updateRow(int _row, PVector _vector) {
    if (_row >= 0 && _row < this.height) {
      for (int x = 0; x < this.width; x++) {
        this.vectors[x][_row].addDirection(_vector);
      }
    }
    return this.vectors;
  }
}

class DirectionVector {
  PVector position;
  PVector direction;

  DirectionVector(int _x, int _y) {
    this.position = new PVector(_x, _y);
    this.direction = new PVector();
  }

  PVector addDirection(PVector _direction) {
    this.direction.x += _direction.x;
    this.direction.y += _direction.y;
    return this.direction;
  }

  PVector setDirection(PVector _direction) {
    this.direction = _direction.copy();
    return this.direction;
  }
}
