varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormals;

#include ../includes/random2D.glsl

uniform float uTime;

void main(){
  vec3 newPosition = position;  
 
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

  float glitchTime = uTime - modelPosition.y;
    float glitchEffect = sin(glitchTime) + sin(glitchTime * 3.45) +  sin(glitchTime * 8.76);
    glitchEffect /= 3.0;
  glitchEffect = smoothstep(0.3, 1.0, glitchEffect);
  glitchEffect *= 0.25;

  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchEffect;
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchEffect;


  

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;


  
  gl_Position = projectionPosition;  

  // Varying
  vPosition = modelPosition.xyz;
  vNormals = (modelMatrix * vec4(normal, 0.0)).xyz;
}