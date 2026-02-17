uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 color;
attribute vec3 aRandom;

varying vec3 vColor;

void main()
{ 
  // Rotation
  vec3 newPosition = position;

  float distance = distance(newPosition, vec3(0.0));
  float angle = atan(newPosition.x, newPosition.z);
  float angleOffset = (1.0 / distance) * uTime * 0.2;
   
  angle += angleOffset;

  newPosition.x = sin(angle) * distance + aRandom.x;
  newPosition.y = aRandom.y;
  newPosition.z = cos(angle) * distance + aRandom.z;

  // Position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / - viewPosition.z);

  // Varyings
  vColor = color;
}