varying vec2 vUv;
uniform sampler2D uTitle;

void main(){
  vec4 color = texture2D(uTitle, vUv);
  color.rgb /= color.a;
  gl_FragColor = vec4(color);
}