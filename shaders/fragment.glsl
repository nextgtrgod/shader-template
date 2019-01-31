
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePos;

void main() {

    vec2 nMousePos = uMousePos.xy / uResolution.xy;

    gl_FragColor = vec4(gl_FragCoord.xy / uResolution.xy * nMousePos.xy, 0.5 * abs(sin(uTime)), 1.0);
}
