float outer,inner, step;

void setup(){
  outer = 500;
  inner = outer*(1-(1/8.5));
  step = outer/17;
  surface.setSize(int(outer),int(outer));
  rectMode(CENTER);
}

void draw(){
  background(0);
  pushMatrix();
  noStroke();
  fill(255);
  translate(outer/2,outer/2);
  square(0,0,outer);
  fill(0);
  square(0,0,inner);
  popMatrix();
  stroke(127);
  strokeWeight(0);
  for(int i = 1; i < 17; i++){
    line(0,i*step,outer,i*step);
    line(i*step,0,i*step,outer);
  }
}
