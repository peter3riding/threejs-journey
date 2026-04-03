varying vec2 vUv;
uniform sampler2D uPerlinTexture;
uniform float uTime;
varying float positionY;

void main(){
  vec2 smokeUv = vUv;
  smokeUv.y *= 0.5;

  smokeUv -= uTime * 0.1;

float smoke = texture(uPerlinTexture, smokeUv).r;

smoke = smoothstep(0.4, 1.0, smoke);

smoke*= smoothstep(0.0, 0.2, vUv.x);
smoke*= smoothstep(1.0, 0.8, vUv.x);
smoke*= smoothstep(1.0, 0.8, vUv.y);
smoke*= smoothstep(0.0, 0.1, vUv.y);


  // gl_FragColor = vec4(0.6, 0.3, 0.2,smoke);
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   #include <tonemapping_fragment>
    #include <colorspace_fragment>
}