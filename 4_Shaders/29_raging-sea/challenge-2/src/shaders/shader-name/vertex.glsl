uniform float uFrequency;
uniform float uStrength;
uniform float uTime;
uniform float uSpeed;
uniform float uSmallWavesElevation;


varying float vElevation;


varying float positionY;
#include ../includes/cnoise.glsl

void main(){
  vec3 newPosition = position;
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

  float elevation = sin((modelPosition.x * uFrequency) +uTime * uSpeed) * uStrength;
  elevation *= sin((modelPosition.z * uFrequency) +  uTime * uSpeed) * uStrength;

  

  for(float i = 1.0; i <= 3.0; i++){
    modelPosition.y -= abs(cnoise(vec3(modelPosition.xz * 3.0 * i,  uTime * 0.2)) * uSmallWavesElevation / i);
  }

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPostion = projectionMatrix * viewPosition;
  gl_Position = projectedPostion;

  // Varying
  positionY = modelPosition.y;
  vElevation = elevation;
}