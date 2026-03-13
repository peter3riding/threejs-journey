

vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)
{   
    
    vec3 lightDirection = normalize(lightPosition); 
    vec3 reflection = reflect(-lightDirection, normal);

    // Shading
    float overLight = dot(normal, lightDirection);
    overLight = max(0.0, overLight);

    float specular = dot(reflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);
    

    return lightColor * lightIntensity * ( overLight + specular);
}