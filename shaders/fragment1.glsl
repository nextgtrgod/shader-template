
// ORB by GeekBrains

precision highp float;

const float PI = 3.14159265359;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePos;
uniform sampler2D uTexture;

float random(float p) {
    return fract(sin(p) * 10000.);
}

float noise(vec2 p) {

    float t = uTime / 2000.;
    
    if (t > 1.)
        t -= floor(t);
    
    return random(p.x * 14. + p.y * sin(t) * .05);    
}

vec2 sw(vec2 p) {
    return vec2(floor(p.x), floor(p.y));
}

vec2 se(vec2 p) {
    return vec2(ceil(p.x), floor(p.y));
}

vec2 nw(vec2 p) {
    return vec2(floor(p.x), ceil(p.y));
}

vec2 ne(vec2 p) {
    return vec2(ceil(p.x), ceil(p.y));
}

float smoothNoise(vec2 p) {    
    vec2 inter = smoothstep(0., 1., fract(p));
    
    float s = mix(noise(sw(p)), noise(se(p)), inter.x);
    float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
    
    return mix(s, n, inter.y);
}    

mat2 rotate(in float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float circ(vec2 p) {
    float r = length(p);
    r = log(sqrt(r));
    return abs(mod(4. * r, PI * 2.) - PI) * 6. + .2;
}    

float fbm(in vec2 p) {
    float z = 2.;
    float rz = 0.;
    vec2 bp = p;

    for (float i = 1.; i < 6.; i++)
    {
        rz += abs((smoothNoise(p) - 0.5) * 2.) / z;
        z = z * 2.;
        p = p * 2.;
    }

    return rz;
}    

void main() {

    vec2 p = gl_FragCoord.xy / uResolution.xy - .5;
    
    p.x *= uResolution.x / uResolution.y;
    
    p *= 5.;
    
    float rz = fbm(p * rotate(uTime * .1));
    
    p /= exp(mod(uTime * 1.5, PI));
    
    rz *= pow(abs(0.1 - circ(p)), .9);
    
    vec3 col = vec3(0.5, 0.2, 0.7) / rz;
    
    gl_FragColor = vec4(col, 1.0);
}