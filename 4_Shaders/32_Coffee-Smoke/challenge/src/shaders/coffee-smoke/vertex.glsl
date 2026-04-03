uniform float uTime;
uniform sampler2D uPerlinTexture;

varying float positionY;
varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main()
{    
    vec3 newPosition = position;


    float angle = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2)).r;
    angle *= 10.0;

    vec2 windOffset = vec2(texture(uPerlinTexture, vec2(0.2,uTime * 0.01)).r - 0.5, texture(uPerlinTexture, vec2(0.7, uTime * 0.01)).r - 0.5);

    windOffset *= pow(uv.y, 3.0) * 10.0;

    newPosition.xz = rotate2D(newPosition.xz, angle);
    newPosition.xz += windOffset;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

   
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varying 
    vUv = uv;
    positionY = position.y * 0.1;
}
