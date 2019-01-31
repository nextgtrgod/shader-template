import './style.css'

// full reload after hot reload
if (module.hot) {
    module.hot.dispose(() => {
		window.location.reload()
    })
}


import vertex from './shaders/vertex'
import fragment from './shaders/fragment'


const canvas = document.getElementById('canvas')
const GL = canvas.getContext('webgl')
let PROGRAM

let W
let H

const setSize = () => {
	W = window.innerWidth
	H = window.innerHeight

	canvas.width = W
	canvas.height = H

    GL.viewport(0, 0, GL.canvas.width, GL.canvas.height)
}

let mouse = {
	x: W / 2,
	y: H / 2,
}

const onMouseMove = ({ clientX, clientY }) => {
	mouse.x = clientX
	mouse.y = clientY
}


const compileShader = (type, source) => {
    const shader = GL.createShader(type)

    GL.shaderSource(shader, source)
	GL.compileShader(shader)
	
	console.log(GL.getShaderInfoLog(shader))

    return shader
}

const getShaders = () => ({
	vertex: compileShader(
		GL.VERTEX_SHADER,
		vertex,
	),
	fragment: compileShader(
		GL.FRAGMENT_SHADER,
		fragment,
	)
})

const createProgram = () => {
	const shaders = getShaders()

	PROGRAM = GL.createProgram()

	GL.attachShader(PROGRAM, shaders.vertex)
	GL.attachShader(PROGRAM, shaders.fragment)
	GL.linkProgram(PROGRAM)

	GL.useProgram(PROGRAM)

	const vertexPositionAttribute = GL.getAttribLocation(PROGRAM, 'a_position')

	GL.enableVertexAttribArray(vertexPositionAttribute)
	GL.vertexAttribPointer(vertexPositionAttribute, 2, GL.FLOAT, false, 0, 0)
}

const createPlane = () => {
	GL.bindBuffer(GL.ARRAY_BUFFER, GL.createBuffer())
	GL.bufferData(
		GL.ARRAY_BUFFER,
		new Float32Array([
			-1, -1,
			-1,  1,
			 1, -1,
			 1,  1
		]),
		GL.STATIC_DRAW
	)
}

const clearCanvas = () => {
    GL.clearColor(0.26, 1, 0.93, 1.0)
    GL.clear(GL.COLOR_BUFFER_BIT)
}

const draw = timeStamp => {

	GL.uniform1f(GL.getUniformLocation(PROGRAM, 'u_time'), timeStamp / 5000.0)
	GL.uniform2fv(GL.getUniformLocation(PROGRAM, 'u_canvas_size'), [ W * 1.0, H * 1.0 ])
	GL.uniform2fv(GL.getUniformLocation(PROGRAM, 'u_mouse_position'), [ mouse.x, mouse.y ])

    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4)

    requestAnimationFrame(draw)
}


const initEventListeners = () => {
	window.addEventListener('resize', setSize)

	document.addEventListener('mousemove', onMouseMove)
}


(() => {
    clearCanvas()
    createPlane()
    createProgram()
    setSize()
    initEventListeners()
    draw()
})()
