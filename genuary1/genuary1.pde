// Made for Genuary by Phillip David Stearns
// Genuary 1 Prompt: Perfect loop / Infinite loop / endless GIFs
// Wait... what's Genuary anyways? Find out! https://genuary.art/

PImage src;
PImage buffer;
SortMatrix sortMatrix;
boolean thresholdDirection = true;
float threshold = 0.0;
float thresholdInterval = 0.0025;

void setup() {
  // not much to talk about here...
  // loading, copying into buffer, setting the window size to the source image dims
  src = loadImage("./data/lightning.jpg");
  buffer = src.copy();
  surface.setSize(src.width, src.height);
  // was originally going to have this sort the pixels, but decided to just smear things
  sortMatrix = new SortMatrix(src, 1); // check out the class for more info...
}

void draw() {
  background(255); // blank the canvas (white)
  sortMatrix.recalcDirections(buffer);  // calculate the smear vectors
  buffer = swapPixels(buffer); // do the smearing
  // next replace pixels below the threshold w/ src image
  // the threshold uses a square of cos to "ease/smooth" a ramp up and ramp down value from 0>1>0 etc. 
  buffer = replaceOriginal(buffer, pow(cos(PI*updateThreadhold()),2)); 
  image(buffer, 0, 0); // show me what you got
  //saveFrame("./output/lightningFields-"+nf(frameCount,4)+".png"); // save it.
  if(frameCount >= int(1/thresholdInterval)+1){ // save only one cycle
    exit(); // peace out we done
  }
}


// this is that up down thing I was talking about...
float updateThreadhold(){
  if(thresholdDirection){
    threshold+=thresholdInterval;
    if(threshold > 1.0){
     thresholdDirection = false;
     threshold = 1.0;
    }
  } else {
    threshold-=thresholdInterval;
    if(threshold < 0.0 ){
     thresholdDirection = true; 
     threshold = 0.0;
    }
  }
  return threshold;
}

PImage replaceOriginal(PImage _image, float _threshold){
  // I am pretty sure I don't want to write to the same thing I'm reading from... so make a copy
  PImage _buffer = _image.copy();
  src.loadPixels(); // the original
  _buffer.loadPixels();
  color pixel;
  for(int i = 0 ; i < _buffer.pixels.length; i++){
    pixel = _buffer.pixels[i];
    if(brightness(pixel)/100.0 <= _threshold){ // looking at just the brightness, but could be saturation or hue
      _buffer.pixels[i] = src.pixels[i];
    }
  }
  _buffer.updatePixels(); 
  return _buffer.copy();
}

PImage swapPixels(PImage _image) {
  // was originally going to have this sort stuff... I've commented out the stuff that would do that.
  PImage _buffer = _image.copy();
  _image.loadPixels();
  _buffer.loadPixels();
  color temp1, temp2;
  int _y, _x;
  for (SortDirection d : sortMatrix.directions) {
    _y = round(d.y+d.direction.y + _image.height) % _image.height;
    _x = round(d.x+d.direction.x + _image.width) % _image.width;
    temp1 = _image.pixels[_image.width*_y+_x];
    //temp2 = _image.pixels[_image.width*d.y+d.x];
    //if(temp1 < temp2){
    _buffer.pixels[_buffer.width*d.y+d.x] = temp1;
    //_buffer.pixels[_buffer.width*_y+_x] = temp2;
    //}
  }
  _buffer.updatePixels();  
  return _buffer.copy();
}

class SortMatrix {
  //mostly just a helper class to manage the vectors we use to smear or swap pixels
  ArrayList<SortDirection> directions;
  int width, height;
  float density; // 1 vector to either 1 - 100 pixels

  SortMatrix(PImage _image, float _density) { // based on the input image and the desired vector density, generate the matrix
    directions = new ArrayList<SortDirection>();
    this.density = constrain(_density, 0.01, 1);
    width = int(this.density * _image.width);
    height = int(this.density * _image.height);
    for (float y = 0; y < _image.height; y+=1.0/this.density ) {
      for (float x = 0; x < _image.width; x+=1.0/this.density ) {
        SortDirection direction = new SortDirection(int(x), int(y)); // creates a new vector
        direction.calcDirection(_image); // based on the image, the magnitude and direction are set
        directions.add(direction); // add it the the list
      }
    }
  }

  void recalcDirections(PImage _image) {
    for (SortDirection d : this.directions) {
      d.calcDirection(_image); // update the vectors based on the input image
    }
  }

  // this was used for early debugging, just to make sure PVector voodoo was under control
  void display(float _scale) {
    for (SortDirection d : this.directions) {
      strokeWeight(0);
      line(d.x, d.y, d.x+d.direction.x*_scale, d.y+d.direction.y*_scale);
    }
  }
}

// now we're down to the atomic level...
class SortDirection {
  int x, y;
  PVector direction;

  SortDirection(int _x, int _y) {
    x = _x;
    y = _y;
    direction = new PVector();
  }

  PVector calcDirection(PImage _image) {
    colorMode(HSB, 360, 100, 100);
    _image.loadPixels();
    color pixel;
    try {
      pixel = _image.pixels[_image.width*this.y+this.x];
      float hue = hue(pixel);
      float saturation = hue(pixel);
      float brightness = brightness(pixel);
      float heading = 2*PI*hue/360.0;
      float magnitude = sqrt(2) * brightness / 100.0;
      PVector.fromAngle(heading, this.direction);
      this.direction.setMag(magnitude);
    }  
    catch(Exception e) {
      println(e);
    }

    return this.direction;
  }
}
