PImage source;
PrintWriter output;
ArrayList<String> colors;
String r, g, b, hex;

void setup() {
  colors = new ArrayList<String>();
  source = loadImage("cover.png");
  output = createWriter("colors.txt");
}

void draw() {
  source.loadPixels();
  source.pixels = sort(source.pixels);
  source.updatePixels();
  //source.save("sorted.png");
  //exit();
  int px;
  boolean seen = false;
  for (int i = 0; i < source.pixels.length; i++) {
    px = source.pixels[i];
    r = String.format("%02x", px >> 16 & 0xff);
    g = String.format("%02x", px >> 8 & 0xff);
    b = String.format("%02x", px >> 0 & 0xff);
    hex = "#"+r+g+b;
    if (colors.size() == 0) {
      colors.add(hex);
      output.println(hex);
    } else {
      seen = false;
      for (String s : colors) {
        if (s.equals(hex)) {
          seen = true;
          break;
        }
      }
      if (!seen) {
        colors.add(hex);
        output.println(hex);
      }
    }
    //println("colors.size():", colors.size(), "i:", i);
  }
  output.flush(); // Writes the remaining data to the file
  output.close(); // Finishes the file
  exit(); // Stops the program
}
