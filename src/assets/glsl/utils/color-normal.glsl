#pragma glslify: export(normalColor);

vec3 normalColor(vec4 c1, vec4 c2){
  return mix(c1.rgb + c2.rgb, c1.rgb, c1.a);
}