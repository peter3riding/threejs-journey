uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;

void main()
{
    vec3 newPosition = position; 

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition  = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    
    gl_PointSize = uSize * uResolution.y * aSize;
    gl_PointSize *= 1.0 / -viewPosition.z;

    
    if (gl_PointSize < 1.0) gl_Position = vec4(9999.9);
}