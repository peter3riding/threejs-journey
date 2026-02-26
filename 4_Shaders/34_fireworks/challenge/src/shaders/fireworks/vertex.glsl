uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;
attribute float aTimeMultiplyer;

uniform float uProgress;

#include ../includes/remap.glsl

void main(){
  float progress = uProgress * aTimeMultiplyer;
  vec3 newPosition = position;

  // Exploding
  float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
  newPosition = mix(vec3(0.0), newPosition, explodingProgress);

  // Falling
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0,1.0);
  fallingProgress = clamp(fallingProgress, 0.0,1.0);
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
  newPosition.y -= fallingProgress * 0.2; 

  // Scaling
  float scalingProgress1 = remap(progress, 0.0, 0.2, 0.0, 1.0);
  float scalingProgress2 = remap(progress, 0.2, 1.0, 1.0, 0.0);
  float sizeProgress = min(scalingProgress1, scalingProgress2);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);

  // Twinkling
  float twinkleProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
  float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
  

  // Final Position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition; 

  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
   
  gl_PointSize *= 1.0 / - viewPosition.z;
}