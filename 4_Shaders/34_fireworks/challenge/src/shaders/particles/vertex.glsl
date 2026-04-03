uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aRandom;

varying vec2 vUv;

#include ../includes/remap.glsl

void main()
{
    vec3 newPosition = position;
    float newProgress = uProgress * aRandom;

    // Exploding
    float explodingProgress = remap(newProgress, 0.0,0.1,0.0,1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition = mix(vec3(0.0), newPosition, explodingProgress);

    // Falling
    float fallingProgress = remap(newProgress, 0.1, 1.0, 0.0, 1.0); 
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    // Scaling
    float scalingProgress1 = remap(newProgress, 0.0, 0.125, 0.0, 1.0);
    float scalingProgress2 = remap(newProgress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(scalingProgress1, scalingProgress2);
    sizeProgress = clamp(0.0, 1.0, sizeProgress);

    // Twinkling
    float twinklingProgress = remap(newProgress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float twinklingMotion = sin(newProgress * 30.0) * 0.5 + 0.5;
    twinklingMotion = 1.0 - twinklingMotion * twinklingProgress;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition  = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * twinklingMotion;
    gl_PointSize *= 1.0 / -viewPosition.z;

    
    if (gl_PointSize < 1.0) gl_Position = vec4(9999.9);

    // Varying
    vUv = uv;
}