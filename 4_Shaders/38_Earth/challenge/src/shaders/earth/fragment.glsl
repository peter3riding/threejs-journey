uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uCloudsTexture;
uniform vec3 uSunDirection;

uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(vUv, 1.0);

    // Sun Orientation
    float sunOrientation = dot(uSunDirection, normal);

    // Day/ Night
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    vec3 dayTexture = texture(uDayTexture, vUv).rgb;
    vec3 nightTexture = texture(uNightTexture, vUv).rgb;
    color = mix(nightTexture, dayTexture, dayMix);

    // Clouds
    vec2 cloudSpecularTexture = texture(uCloudsTexture, vUv).rg;
    float clouds = smoothstep(0.5, 1.0, cloudSpecularTexture.g);
    color = mix(color, vec3(1.0), clouds * dayMix);

    // Fresnel
    float fresnel = dot(normal, viewDirection) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColorMix = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    vec3 atmosphereEarthMix = mix(color, atmosphereColorMix, fresnel * atmosphereDayMix);
    color = atmosphereEarthMix;

    // Specular
    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, 32.0);
    specular *=  cloudSpecularTexture.r;
    vec3 specularMix = mix(vec3(1.0), atmosphereColorMix, fresnel);

    color += specular * specularMix;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}