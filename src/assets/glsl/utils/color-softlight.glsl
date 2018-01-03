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