varying vec3 vColor;

void main()
{
  vec2 uv = gl_PointCoord;
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength =  pow( strength, 10.0);
  vec3 mixedColor = mix(vec3(0.0), vColor, strength);
  gl_FragColor = vec4(vec3(mixedColor), 1.0);

}