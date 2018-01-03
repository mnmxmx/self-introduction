#pragma glslify: import("./utils/noise3D");

vec3 snoiseVec3( vec3 x ){

  float s  = snoise3D(vec3( x ));
  float s1 = snoise3D(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise3D(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;

}

vec3 curlNoise( vec3 p ){

  const float e = .1;
  // vec3 dx = vec3( e   , 0.0 , 0.0 );
  // vec3 dy = vec3( 0.0 , e   , 0.0 );
  // vec3 dz = vec3( 0.0 , 0.0 , e   );

  // vec3 p_x0 = snoiseVec3( p - dx );
  // vec3 p_x1 = snoiseVec3( p + dx );
  // vec3 p_y0 = snoiseVec3( p - dy );
  // vec3 p_y1 = snoiseVec3( p + dy );
  // vec3 p_z0 = snoiseVec3( p - dz );
  // vec3 p_z1 = snoiseVec3( p + dz );

  // float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  // float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  // float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  float  n1 = snoise3D(vec3(p.x, p.y + e, p.z));
  float  n2 = snoise3D(vec3(p.x, p.y - e, p.z));
  float  n3 = snoise3D(vec3(p.x, p.y, p.z + e));
  float  n4 = snoise3D(vec3(p.x, p.y, p.z - e));
  float  n5 = snoise3D(vec3(p.x + e, p.y, p.z));
  float  n6 = snoise3D(vec3(p.x - e, p.y, p.z));

  float x = n2 - n1 - n4 + n3;
  float y = n4 - n3 - n6 + n5;
  float z = n6 - n5 - n2 + n1;


  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}


uniform float timer;
uniform float delta;
uniform float speed;
uniform float factor;
uniform float evolution;
uniform float radius;


void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 c = texture2D( posTex, uv );
  vec4 oldVel = texture2D( velTex, uv );

  vec3 pos = c.xyz;
  float life = oldVel.a;

  float s = life / 100.0;
  float speedInc = 1.0;

  vec3 v = factor * speedInc * delta * speed * ( curlNoise( .2 * pos) ) * (c.a + 1.0);

  pos += v;
  life -= 0.2;

  if( life <= 0.0) {

    pos = texture2D( defTex, uv ).xyz;
    life = 100.0;

  }

  gl_FragColor = vec4( pos - c.xyz, life );
}