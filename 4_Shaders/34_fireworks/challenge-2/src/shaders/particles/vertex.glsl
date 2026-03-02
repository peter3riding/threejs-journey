uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

#include ../includes/remap.glsl

void main()
{
    vec3 newPosition = position; 

    // Explosion
    float explosionProgress = remap(uProgress, 0.0, 0.1, 0.0,1.0);
    explosionProgress = clamp(explosionProgress, 0.0, 1.0);
    explosionProgress = 1.0 - pow(1.0 - explosionProgress, 3.0);
    newPosition = mix(vec3(0.0), newPosition, explosionProgress);

    // Falling
    float fallingProgress = remap(uProgress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0 );
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    // Scaling
    float progressUp = remap(uProgress, 0.0, 0.2, 0.0, 1.0);
    float prgressDown = remap(uProgress, 0.2, 1.0, 1.0, 0.0);
    float scalingProgress = min(progressUp, prgressDown);
    scalingProgress = clamp(scalingProgress, 0.0, 1.0);

    // Twinkling
    float twinklingProgress = remap(uProgress, 0.2,0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);

    float twinkling = sin(uProgress * 30.0) * 0.5 + 0.5;
    twinklingProgress = 1.0 - twinkling * twinklingProgress;


    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition  = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    
    gl_PointSize = uSize * uResolution.y * aSize * scalingProgress;
    gl_PointSize *= 1.0 / -viewPosition.z;

    
    if (gl_PointSize < 1.0) gl_Position = vec4(9999.9);
}