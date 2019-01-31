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
	
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        console.error('Shader compile failed with: ' + GL.getShaderInfoLog(shader))
    }

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

const createTexture = () => {
    const image = new Image()
	
	image.src = require('./assets/1.jpg')

    image.onload = () => {
		const texture = GL.createTexture()

		GL.activeTexture(GL.TEXTURE0)
		GL.bindTexture(GL.TEXTURE_2D, texture)

		GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true)
		GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, image)

		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)

		GL.uniform1i(GL.getUniformLocation(PROGRAM, 'uTexture'), 0)
    }
}

const clearCanvas = () => {
    GL.clearColor(0.26, 1, 0.93, 1.0)
    GL.clear(GL.COLOR_BUFFER_BIT)
}

const draw = timeStamp => {

	GL.uniform1f(GL.getUniformLocation(PROGRAM, 'uTime'), timeStamp / 1000)
	GL.uniform2fv(GL.getUniformLocation(PROGRAM, 'uResolution'), [ W * 1.0, H * 1.0 ])
	GL.uniform2fv(GL.getUniformLocation(PROGRAM, 'uMousePos'), [ mouse.x, mouse.y ])

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
	createTexture()
    setSize()
    initEventListeners()
    draw()
})()
