uniform sampler2D uPictureTexture;

varying vec2 vUv;
varying vec3 vColor;

void main()
{   
    vec2 uv = gl_PointCoord;

    // Particles
    float distanceToCenter = 1.0 - distance(uv, vec2(0.5));
    if(distanceToCenter < 0.5) discard;


    gl_FragColor = vec4(vColor , 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}