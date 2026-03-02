uniform sampler2D perlinTexture;
varying vec2 vUv;

uniform float uTime;

void main(){
  vec2 smokeUv = vUv;
  smokeUv.y -= uTime * 0.2;

  float smokeAlpha = texture(perlinTexture, smokeUv).r;

  smokeAlpha = smoothstep(0.4, 1.0, smokeAlpha);

  smokeAlpha *= smoothstep(0.0, 0.1, vUv.x);
  smokeAlpha *= smoothstep(1.0, 0.9, vUv.x);
  smokeAlpha *= smoothstep(1.0, 0.9, vUv.y);
  smokeAlpha *= smoothstep(0.0, 0.1, vUv.y);

  // gl_FragColor = vec4(1.0,1.0,1.0,smokeAlpha);
   gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}