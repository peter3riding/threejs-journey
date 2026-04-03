uniform float uTime;

uniform vec2 uBigWavesFrequency;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;

#include ../includes/cnoise.glsl

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
 
  float elevation = (sin(modelPosition.x * uBigWavesFrequency.x +uTime * uBigWavesSpeed) * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed)) * uBigWavesElevation;

  for(float i = 0.0; i <= uSmallIterations; i++){
      elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency, i) )) * uSmallWavesElevation / uSmallIterations;
  }

  modelPosition.y += elevation;
  
  vec4 viewPosition =  viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  vElevation = modelPosition.y;
}

// uniform vec2 uFrequency;
// uniform float uHeight;
// uniform float uTime;
// uniform float uSpeed;


// void main(){


  
 
 

//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   // y axis
//   float elevation = sin(modelPosition.x * uFrequency.x + uTime * uSpeed) * sin(modelPosition.z * uFrequency.y + uTime * uSpeed) * uHeight;
  

 

//   modelPosition.y += elevation;

//   vec4 viewPosition =  viewMatrix * modelPosition;
//   gl_Position = projectionMatrix * viewPosition;
// }