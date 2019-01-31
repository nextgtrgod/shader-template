
precision mediump float;

uniform float u_time;
uniform vec2 u_canvas_size;
uniform vec2 u_mouse_position;

void main() {

	vec2 k = u_mouse_position / u_canvas_size;

    gl_FragColor = vec4(
            abs(k.x * sin(u_time)),
            abs(k.y * sin(u_time)),
            abs(cos(u_time * 5.0)),
			1.0
		);
}