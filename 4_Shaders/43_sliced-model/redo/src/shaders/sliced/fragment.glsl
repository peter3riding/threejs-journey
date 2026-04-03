uniform float uSliceStart;
uniform float uSliceArc;

varying vec3 vPosition;
varying float vAngle;

void main()
{ 
  float angle = atan(vPosition.y, vPosition.x);
   angle = angle - uSliceStart;
  angle = mod(angle, PI *2.0);
  //angle += start;

  if(angle > 0.0 && angle < uSliceArc ) discard;
    
  // Patchmap 
  float csm_Slice;


}