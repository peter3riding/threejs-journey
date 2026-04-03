varying vec2 vUv;
varying vec3 vPosition;

varying vec3 vNormal;

uniform float uTime;

void main(){
  vec3 newPosition = vPosition;
  newPosition.y -= uTime * 0.02;

  

  vec3 normal = normalize(vNormal.xyz);

  if(!gl_FrontFacing) normal *= -1.0;

  // Stripes
  float stripes = mod(newPosition.y * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Fresnel
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(normal, viewDirection) + 1.0;
  fresnel = pow(fresnel, 2.0);
  float effect = smoothstep(0.8, 0.2, fresnel);
  

  float hologram = stripes * fresnel;
  hologram += fresnel * 1.25;
  hologram *= effect;
  

  gl_FragColor = vec4(0.0, 1.0, 0.0, hologram);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}