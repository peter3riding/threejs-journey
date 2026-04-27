uniform float uSize;
uniform float uPixelRatio;

attribute float aScale;
varying vec2 vUv;
uniform float uTime;

void main()
{ 
   
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.y += sin(modelPosition.z * 100.0 + uTime) * aScale *  0.2;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale *  uPixelRatio;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vUv = uv; 
}