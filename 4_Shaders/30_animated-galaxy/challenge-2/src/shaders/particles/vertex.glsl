uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;
varying vec3 vColor;

uniform float uTime;

void main()
{
    vec3 newPosition = position; 

    

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceCenter = distance(vec2(0.0), modelPosition.xz);

     angle += uTime * 0.2;

    float offSet = (1.0 / distanceCenter) * uTime;

    modelPosition.x = sin(angle + offSet * 0.2) * distanceCenter;
    modelPosition.z = cos(angle + offSet * 0.2) * distanceCenter;

    vec4 viewPosition  = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    
    gl_PointSize = uSize * uResolution.y * uSize;
    gl_PointSize *= 1.0 / -viewPosition.z;

    
    if (gl_PointSize < 1.0) gl_Position = vec4(9999.9);

    vColor = color;
}