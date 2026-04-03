varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec4 normal = normalize(modelMatrix * vec4(normal, 0.0));

    // Varying
    vNormal = normal.xyz;
    vPosition = modelPosition.xyz;
}