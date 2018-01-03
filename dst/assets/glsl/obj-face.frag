#define GLSLIFY 1
varying vec3 vColor;
varying vec3 vPosition;

vec3 calcIrradiance_dir(vec3 newNormal, vec3 lightPos, vec3 light){
  float dotNL = dot(newNormal, normalize(lightPos));

  return light * max(0.0, dotNL);
}

// directional light color
const vec3 dirLight = vec3(0.4, 0.4, 0.4);

const vec3 dirLightPos = vec3(4, 6, 10);

void main() {
  vec3 fdx = dFdx( vPosition );
  vec3 fdy = dFdy( vPosition );
  vec3 n = normalize(cross(fdx, fdy));
  
  vec3 dirColor = vec3(0.0);
  dirColor += calcIrradiance_dir(n, dirLightPos, dirLight);

  vec3 color = vColor;
  color += dirColor;

  gl_FragColor = vec4(color, 1.0);
}