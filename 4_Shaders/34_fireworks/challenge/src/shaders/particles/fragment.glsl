uniform sampler2D uTexture;
uniform vec3 uColor;

void main()
{
    float alpha = texture(uTexture, gl_PointCoord).r;
    gl_FragColor = vec4(uColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}