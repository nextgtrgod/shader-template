
// grayscale

precision highp float;

const float PI = 3.14159265359;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePos;
uniform sampler2D uTexture;

void main() {

    vec4 texture = texture2D(uTexture, gl_FragCoord.xy / uResolution);

    float pixelColor;

    // pixelColor = (texture.r + texture.g + texture.b) / 
    //     (3.0 *
    //     (uMousePos.x / uResolution.x + uMousePos.y / uResolution.y)
    //     / 2.0 );

    if (texture.r + texture.g + texture.b > 1.5)
        pixelColor = 1.;

    if (texture.r + texture.g + texture.b > 1.0)
        pixelColor = .8;

    if (texture.r + texture.g + texture.b > 0.8)
        pixelColor = .6;

    else
        pixelColor = .0;

    gl_FragColor = vec4(vec3(pixelColor), 1.0);
}