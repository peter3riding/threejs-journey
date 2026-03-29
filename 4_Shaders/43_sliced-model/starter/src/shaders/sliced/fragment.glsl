uniform float uSliceStart;
uniform float uSliceArc;
varying vec3 vPosition;

void main()
{
    float angle = atan(vPosition.y, vPosition.x);

    // Move the zero point so the slice starts at 0
    angle -= uSliceStart;

    // Wrap the angle into the clean 0 to 2π (6.28) range
    // (this fixes negative values so the if-test always works)
    angle = mod(angle, PI * 2.0);

    // Discard everything inside the slice arc
    if (angle > 0.0 && angle < uSliceArc)
        discard;

    // PatchMap
   float csm_Slice;

   // Debugging
   // csm_FragColor = vec4(vec3(angle), 1.0);
   
}
