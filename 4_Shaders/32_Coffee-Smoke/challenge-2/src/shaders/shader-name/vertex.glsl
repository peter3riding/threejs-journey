uniform sampler2D perlinTexture;

uniform float uTime;

varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main(){
//   vec3 newPosition = position;
//  newPosition.xz = rotate2D(newPosition.xz,newPosition.y);

vec2 smokeUv = uv;
  

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Offset
  vec2 offSetX = vec2(texture(perlinTexture, vec2(0.2, uTime * 0.2)).r - 0.5, 0) ;
  vec2 offSetY = vec2(texture(perlinTexture, vec2(0.7, uTime * 0.2)).r - 0.5, 0) ;

  vec2 totalOffset = vec2(offSetX.x, offSetY.x);
  totalOffset *= pow(uv.y, 3.0) * 10.0;
  

  float test = (texture(perlinTexture, vec2(0.5, (smokeUv.y * 0.2) -uTime * 0.02)).r);
  test *= 10.0;

  modelPosition.xz = rotate2D(modelPosition.xz, test);

  modelPosition.xz += totalOffset;
  

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPostion = projectionMatrix * viewPosition;
  gl_Position = projectedPostion;

  // Varying
  vUv = uv;
}