#include ../includes/simplexNoise4d.glsl

uniform sampler2D uBaseTexture;
uniform float uTime;

void main()
{   

    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBaseTexture, uv);
    float strength = simplexNoise4d(vec4(base.xzy * 0.2, time + 1.0));
    strength = smoothstep(0.0, -1.0, strength);

    if(particle.a >= 1.0){
        particle.a = mod(particle.a * 0.2, 1.0);
        particle.xyz = base.xyz;
    }else {
        vec3 flow = vec3(
        simplexNoise4d(vec4(particle.xyz + 0.0, time)),
        simplexNoise4d(vec4(particle.xyz + 0.1, time)),
        simplexNoise4d(vec4(particle.xyz + 0.2, time))
    );
    particle.a += 0.01;
    particle.xyz += flow * strength* 0.02;
    }

    gl_FragColor = particle;
}