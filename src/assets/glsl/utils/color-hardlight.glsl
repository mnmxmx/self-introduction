#pragma glslify: import(./color-overlay)

vec3 blendHardLight(vec3 base, vec3 blend) {
  return blendOverlay(blend,base);
}

vec3 blendHardLight(vec4 base, vec4 blend) {
  return (blendHardLight(base.rgb, blend.rgb) * 1.0 + base.rgb * 0.0);
}