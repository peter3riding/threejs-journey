varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormals;

uniform float uTime;
uniform vec3 uColor;

void main()
{   
   vec3 normal = normalize(vNormals);
   if(!gl_FrontFacing) normal *= -1.0;
   // Stripes
   float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
   stripes = pow(stripes, 3.0); 

   // Fresnel
   vec3 viewDirection = normalize(vPosition - cameraPosition);
   float fresnel = dot(normal, viewDirection) + 1.0; 
   fresnel = pow(fresnel, 2.0); 

   float falloff = smoothstep(0.8, 0.2, fresnel); 

   float alpha = stripes * fresnel;
   alpha += fresnel * 1.25;
   alpha *= falloff;
   
    
    
    // Final color
    gl_FragColor = vec4(uColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}