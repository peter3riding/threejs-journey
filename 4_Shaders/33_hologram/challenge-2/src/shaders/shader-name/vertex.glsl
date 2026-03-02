varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;

#include ../includes/random2D.glsl

void main(){
  // Glitch
  vec3 newPosition = position;
  // newPosition.x += random2D(newPosition.xz);
  // newPosition.z += random2D(newPosition.zx);

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  float glitchTime = uTime - modelPosition.y;
  float strength = (sin(glitchTime ) + sin((glitchTime ) * 3.45 ) + sin((glitchTime ) * 8.76)) / 3.0 ;

  strength = smoothstep(0.3, 1.0, strength);
  strength *= 0.25;

  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5)* strength;
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * strength;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPostion = projectionMatrix * viewPosition;
  gl_Position = projectedPostion;

  // Varying
  vUv = uv;
  vPosition = modelPosition.xyz;
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
}