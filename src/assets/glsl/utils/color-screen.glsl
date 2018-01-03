#pragma glslify: export(screenColor);

vec3 screenColor(vec4 c1, vec4 c2){
  return c2.rgb * (vec3(1.0) - c1.rgb) + c1.rgb;
}