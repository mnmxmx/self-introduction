#pragma glslify: export(addColor);

vec3 addColor(vec4 c1, vec4 c2){
  return c2.rgb * c2.a + c1.rgb;
}