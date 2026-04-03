uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;

uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

varying float vWobble;

attribute vec4 tangent;

#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position)
{   
    
    vec3 warpedPosition = position;

    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWarpTimeFrequency
    )) * uWarpStrength;


    return simplexNoise4d(vec4(
        warpedPosition* uPositionFrequency, // XYZ
        uTime * uTimeFrequency      // W
    )) * uStrength;
}

void main()
{   
    vec3 biTangent = cross(normal, tangent.xyz);

     // Neighbours positions
     float shift = 0.01;
     vec3 neighbourA = csm_Position + tangent.xyz * shift;
     vec3 neighbourB = csm_Position + biTangent * shift;


   // Wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    neighbourA += getWobble(neighbourA) * normal;
    neighbourB += getWobble(neighbourB) * normal;
    

     // Compute normal
     vec3 toA = normalize(neighbourA - csm_Position);
     vec3 toB = normalize(neighbourB - csm_Position);
     
    csm_Normal = cross(toA, toB);

    // Varying
    vWobble = wobble / uStrength;

}

// 