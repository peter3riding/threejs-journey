uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl

void main()
{
    // Color
    vec3 color = vec3(1.0);

    // Water
    float waterMix = smoothstep(-1.0, 1.0, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, waterMix);
  

    // Sand
   float sandMix = step(-0.06, vPosition.y);
   color = mix(color, uColorSand, sandMix); 

    // Grass
    float grassMix = step(-0.045, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    //Rock
   float elevation = 1.0 - step(0.8, vUpDot);
    elevation *= step(-0.045, vPosition.y);
    color = mix(color, uColorRock, elevation);

    // Snow
    float snowEffect = 0.45;
    snowEffect += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
    float snowMix = step(snowEffect, vPosition.y);
    color = mix(color, uColorSnow, snowMix);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}