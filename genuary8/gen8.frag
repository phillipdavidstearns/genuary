#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform float u_time;
varying vec2 vTexCoord;

float random (vec2 _st) {
    return fract(sin(dot(
        _st.xy,
        vec2(1215.9898,748.233)))*
        43758.5453123);
}

vec2 genPoint(vec2 _st){
  float r = random(_st+2.0);
  float theta = 2.0*PI*random(_st);
  return vec2(0.5*r*cos(theta)+0.5, 0.5*r*sin(theta)+0.5);
}

void main() {

    vec2 st = vTexCoord;

    vec3 color = vec3(.0);

    float m_dist = 5.;  // minimum distance

    // Iterate through the points positions
    for (int i = 0; i < 1; i++) {
        float dist = distance(st, vec2(0.5,0.5));

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    // Draw the min distance (distance field)
    color += m_dist*5.0;

    // Show isolines
    // color -= step(0.5,abs(sin(50.0*m_dist)))*.3;

    gl_FragColor = vec4(color,1.0);


}