uniform sampler2D uTexture;
varying vec3, vColor;

void main()
{
    float strength = distance(vec2(0.5), gl_PointCoord) * 2.0;
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);
    
    vec3 mixColor = mix(vec3(0.0), vColor, strength );

    
    gl_FragColor = vec4(mixColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}