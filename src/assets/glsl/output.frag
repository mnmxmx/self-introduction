#pragma glslify: import("./utils/noise3D");
#pragma glslify: import("./utils/rand");
#pragma glslify: import("./utils/color-softlight");
#pragma glslify: import("./utils/color-hardlight");
// #pragma glslify: import("./utils/rgb-hsv");
// #pragma glslify: import("./utils/hsv-rgb");





uniform float uTick;
uniform sampler2D tObjs;
uniform sampler2D tex;
// uniform float isColorType;
// uniform float uProgress;


uniform vec2 uSize;
varying vec2 vUv;


vec3 calcContrast(vec3 _value){
	return _value * 1.4 - 0.35;
}


void main(){
  float uvNoise = snoise3D(vec3(vUv.x * 200.0, vUv.y * 200.0, 0.0));
  float uvNoise_2 = snoise3D(vec3(vUv.x * 5.0, vUv.y * 5.0, uTick));
  // float uvNoise_3 = snoise3D(vec3(vUv.x * 5.0, vUv.y * 30.0, uTick));


  float noiseRadius = 0.4;

  float _u = vUv.x * uSize.x + rand(vUv) * noiseRadius * (1.0 + uvNoise) * 2.0 - noiseRadius;
  float _v = vUv.y * uSize.y + rand(vec2(vUv.y, vUv.x)) * noiseRadius * (1.0 + uvNoise) * 2.0 - noiseRadius;
  vec2 uvCoord_1 = vec2(_u, _v) / uSize * (1.0 + abs(uvNoise) * 0.002);
  vec2 uvCoord_2 = vec2(_u, _v) / uSize * (1.0 + abs(uvNoise) * 0.005);


  // bg
  vec4 effectColor = texture2D(tex, uvCoord_2 + uvNoise_2 * 0.001);
  vec4 baseColor = vec4(#026a73, 1.0);

  vec4 objColor = texture2D(tObjs, uvCoord_1);
  objColor.a = (objColor.r + objColor.g + objColor.b) / 3.0;


  vec4 bgColor = vec4(1.0);
  bgColor.rgb = blendHardLight(baseColor, effectColor);

  objColor.rgb = blendHardLight(vec4(#fff663, 1.0), effectColor).rgb;

  vec4 color = vec4(1.0);
  color.rgb = mix(bgColor.rgb, objColor.rgb, objColor.a);
  // color.rgb += 0.05;
  color.rgb = calcContrast(color.rgb);
  // color.rgb += (vUv.y - 1.0) * 0.8;

  gl_FragColor = vec4(color);
}