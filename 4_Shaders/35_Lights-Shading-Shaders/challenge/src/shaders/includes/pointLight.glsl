vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)
{ 
  vec3 lightDelta = lightPosition - position; 
  float lightDistance = length(lightDelta);
  vec3 lightDirection = normalize(lightDelta);
  vec3 reflection = reflect(-lightDirection, normal);
   
  // Diffuse
  float diffuse  = dot(normal, lightDirection);
  diffuse = max(0.0, diffuse);

  // Specular
  float specular = dot(viewDirection, reflection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  // Decay
  float decay = 1.0 - lightDistance * lightDecay;


   return lightColor * lightIntensity * decay * (diffuse + specular);
}