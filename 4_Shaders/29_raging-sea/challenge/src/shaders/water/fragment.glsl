uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{ 
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 mixedColors = mix(uDepthColor, uSurfaceColor, mixStrength); 
  
  gl_FragColor = vec4(mixedColors, 1.0);
  #include <colorspace_fragment>
}