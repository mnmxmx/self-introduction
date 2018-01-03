// #pragma glslify: snoise = require("./noise2D")

// varying vec3 vPos;
varying vec2 vUv;

// uniform float uTick;

const float PI = 3.1415926;

mat2 calcRotate2D(float _time){
	float _sin = sin(_time);
	float _cos = cos(_time);
	return mat2(_cos, _sin, -_sin, _cos);
}


void main(){

	vUv = uv;

	gl_Position =projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}