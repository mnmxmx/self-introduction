#pragma glslify: export(multiplyColor);

vec3 multiplyColor(vec4 c1, vec4 c2){
  return c2.rgb * c1.rgb;
}