varying float vWobble;

uniform vec3 uColorA;
uniform vec3 uColorB;

void main()
{ 
  float test = smoothstep(-1.0, 1.0, vWobble);
  vec3 mixcolor = mix(uColorA, uColorB, test);
  
  csm_DiffuseColor.rgb = mixcolor;
}

//csm_FragColor.rgb
//csm_DiffuseColor.rgb