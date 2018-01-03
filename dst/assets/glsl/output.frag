#define GLSLIFY 1

//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3D(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

float rand(vec2 co){
  float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
  float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
  float t = fract(s * 43758.5453);

  return t;
}
// softlight
float blendSoftLight(float base, float blend) {
  return (blend < 0.5)?( 2.0 * base * blend + base * base * (1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
  return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec4 base, vec4 blend) {
  return base.rgb * (1.0 - blend.a) + blend.a * (blendSoftLight(base.rgb, blend.rgb) * base.a + blend.rgb * (1.0 - base.a));
}
vec3 blendOverlay(vec4 c1, vec4 c2){
  float r = (c1.r < 0.5) ? 2.0 * c1.r * c2.r : 1.0 - 2.0 * (1.0 - c1.r) * (1.0 - c2.r);
  float g = (c1.g < 0.5) ? 2.0 * c1.g * c2.g : 1.0 - 2.0 * (1.0 - c1.g) * (1.0 - c2.g);
  float b = (c1.b < 0.5) ? 2.0 * c1.b * c2.b : 1.0 - 2.0 * (1.0 - c1.b) * (1.0 - c2.b);

  return vec3(r, g, b);
}

vec3 blendOverlay(vec3 c1, vec3 c2){
  float r = (c1.r < 0.5) ? 2.0 * c1.r * c2.r : 1.0 - 2.0 * (1.0 - c1.r) * (1.0 - c2.r);
  float g = (c1.g < 0.5) ? 2.0 * c1.g * c2.g : 1.0 - 2.0 * (1.0 - c1.g) * (1.0 - c2.g);
  float b = (c1.b < 0.5) ? 2.0 * c1.b * c2.b : 1.0 - 2.0 * (1.0 - c1.b) * (1.0 - c2.b);

  return vec3(r, g, b);
}

vec3 blendHardLight(vec3 base, vec3 blend) {
  return blendOverlay(blend,base);
}

vec3 blendHardLight(vec4 base, vec4 blend) {
  return (blendHardLight(base.rgb, blend.rgb) * 1.0 + base.rgb * 0.0);
}
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
  vec4 baseColor = vec4(vec3(0.00784313725490196,0.41568627450980394,0.45098039215686275), 1.0);

  vec4 objColor = texture2D(tObjs, uvCoord_1);
  objColor.a = (objColor.r + objColor.g + objColor.b) / 3.0;

  vec4 bgColor = vec4(1.0);
  bgColor.rgb = blendHardLight(baseColor, effectColor);

  objColor.rgb = blendHardLight(vec4(vec3(1.,0.9647058823529412,0.38823529411764707), 1.0), effectColor).rgb;

  vec4 color = vec4(1.0);
  color.rgb = mix(bgColor.rgb, objColor.rgb, objColor.a);
  // color.rgb += 0.05;
  color.rgb = calcContrast(color.rgb);
  // color.rgb += (vUv.y - 1.0) * 0.8;

  gl_FragColor = vec4(color);
}