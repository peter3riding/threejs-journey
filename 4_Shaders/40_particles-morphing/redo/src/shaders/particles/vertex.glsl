uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aPositionTarget;
attribute float aSize;

varying vec3 vColor;

#include ../includes/simplexNoise3d.glsl

void main()
{   
    // Noise
    float originNoise = simplexNoise3d(position * 0.2);
    float endNoise = simplexNoise3d(position * 0.2);
    float noiseMix = mix(originNoise, endNoise, uProgress);
    noiseMix = smoothstep(-1.0, 1.0, noiseMix);

    // Color Mix
    vec3 colorMix = mix(uColorA, uColorB, noiseMix);

    // Delay
    float duration = 0.4;
    float delay = (1.0 - duration) * noiseMix;
    float end = duration + delay;

    // Mixed position
    float mixProgress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, mixProgress);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * aSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = colorMix;
}