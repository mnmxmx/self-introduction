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