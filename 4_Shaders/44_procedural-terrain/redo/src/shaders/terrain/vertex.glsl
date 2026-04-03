uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

varying vec3 vPosition;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl

float terrainMap(vec2 position)
{ 
 vec2 warpedPositon = position;
  warpedPositon += simplexNoise2d(position * uPositionFrequency * uWarpFrequency) * uWarpStrength;
 float elevation = simplexNoise2d(warpedPositon * uPositionFrequency) / 2.0;
 elevation += simplexNoise2d(warpedPositon * uPositionFrequency * 2.0) / 4.0;
  elevation += simplexNoise2d(warpedPositon * uPositionFrequency * 4.0) / 8.0;
  float elevationSign = sign(elevation);
  elevation = pow(abs(elevation), 2.0) * elevationSign;

  elevation *= uStrength;
 return elevation;
}

void main()
{
    // Fix normals
    float shift = 0.01;
    vec3 positionA = csm_Position + vec3(shift, 0.0, 0.0);
    vec3 positionB = csm_Position + vec3(0.0, 0.0, -shift);

    csm_Position.y += terrainMap(csm_Position.xz);
    positionA.y += terrainMap(positionA.xz);
    positionB.y += terrainMap(positionB.xz);

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal = normalize(cross(toA, toB));
  
    // varyings
    vPosition = csm_Position;
    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}