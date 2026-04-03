uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

varying float vWobble;

#include ../includes/simplexNoise4d.glsl

float wobbleEffect(vec3 pos) {
  vec3 warpedPosition = pos; 
  warpedPosition += simplexNoise4d(vec4(
    pos * uWarpPositionFrequency,
    uTime * uWarpTimeFrequency
  )) * uWarpStrength;
  

  return simplexNoise4d(vec4(
    warpedPosition * uPositionFrequency,
    uTime * uTimeFrequency
  )) * uStrength;
} 

void main()
{
  vec3 biTangent = normalize(cross(normal, tangent.xyz));

  float shift = 0.01;
  vec3 positionA = csm_Position + tangent.xyz * shift;
  vec3 positionB = csm_Position + biTangent  * shift;

  float wobble = wobbleEffect(csm_Position);
  csm_Position += wobble * normal;
  positionA += wobbleEffect(positionA) * normal;
  positionB += wobbleEffect(positionB) * normal;

  vec3 toA = positionA - csm_Position;
  vec3 toB = positionB - csm_Position;

  csm_Normal = normalize(cross(toA, toB));

  vWobble = wobble / uStrength;
}