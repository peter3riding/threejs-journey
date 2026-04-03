uniform sampler2D uTexture;
uniform vec3 uColor;

uniform float uProgress;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{   
    
    float alpha = texture(uTexture, gl_PointCoord).r;
    
    gl_FragColor = vec4(uColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}