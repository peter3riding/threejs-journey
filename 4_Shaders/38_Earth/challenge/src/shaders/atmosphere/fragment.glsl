uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(uSunDirection, normal);

    // Atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 0.0, sunOrientation);
    vec3 atmosphereColorMix = mix(uAtmosphereTwilightColor,uAtmosphereDayColor,  atmosphereDayMix);

    color += atmosphereColorMix;
    // Edge mix
    float edgeMix = dot(viewDirection, normal);
    edgeMix = smoothstep(-0.0, 0.5,edgeMix);

    float dayMix = smoothstep(-0.5, 0.0, sunOrientation);
    float alpha = dayMix * edgeMix;


    // color = atmosphereColorMix;
    // Final color
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}