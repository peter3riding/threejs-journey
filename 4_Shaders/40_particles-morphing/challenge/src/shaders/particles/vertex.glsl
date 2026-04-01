uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;

attribute vec3 aTarget;
varying vec3 vColor;
uniform vec3 uColorA;
uniform vec3 uColorB;

#include ../includes/simplexNoise3d.glsl

void main()
{   
    // Mixed Position
    float originNoise = simplexNoise3d(position);
    float targetNoise = simplexNoise3d(position);
    float noise = mix(originNoise, targetNoise, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = duration + delay;

    float noiseProgress = smoothstep(delay, end, uProgress);

    vec3 mixedPosition = mix(position, aTarget, noiseProgress);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings
    vColor = mix(uColorA, uColorB, noise);
   
}