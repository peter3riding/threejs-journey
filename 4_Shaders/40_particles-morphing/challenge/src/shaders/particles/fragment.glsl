varying vec3 vColor;

void main()
{   
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 0.05/ distanceToCenter - 0.1;
    

    gl_FragColor = vec4(vec3(vColor), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}