import * as THREE from "three"

// Cel paint has a few flat bands of light rather than a smooth falloff:
// shadow, mid tone and lit.
function bands(levels: number[]) {
  const data = new Uint8Array(levels.length * 4)
  levels.forEach((level, i) => data.set([level, level, level, 255], i * 4))
  const texture = new THREE.DataTexture(data, levels.length, 1)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true
  return texture
}

export const celBands = bands([105, 185, 255])

const paintNoise = /* glsl */ `
varying vec3 vPaintPos;
uniform float uBrush;
uniform float uBrushScale;
float paintHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float paintNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(paintHash(i), paintHash(i + vec3(1, 0, 0)), f.x),
        mix(paintHash(i + vec3(0, 1, 0)), paintHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(paintHash(i + vec3(0, 0, 1)), paintHash(i + vec3(1, 0, 1)), f.x),
        mix(paintHash(i + vec3(0, 1, 1)), paintHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
`

type PaintedOptions = THREE.MeshToonMaterialParameters & {
  // How much the colour wanders, as a fraction of its brightness.
  brush?: number
  // Size of the colour patches; larger numbers give smaller patches.
  brushScale?: number
}

// A toon material whose flat colour is broken up by soft, low-frequency
// patches, like gouache laid down by hand instead of a computer fill.
export function paintedToon({
  brush = 0.1,
  brushScale = 0.35,
  ...params
}: PaintedOptions = {}) {
  const material = new THREE.MeshToonMaterial({
    gradientMap: celBands,
    ...params,
  })
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBrush = { value: brush }
    shader.uniforms.uBrushScale = { value: brushScale }
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vPaintPos;"
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vec4 paintPos = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          paintPos = instanceMatrix * paintPos;
        #endif
        vPaintPos = (modelMatrix * paintPos).xyz;`
      )
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${paintNoise}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float paint = paintNoise(vPaintPos * uBrushScale) * 0.65
          + paintNoise(vPaintPos * uBrushScale * 3.7) * 0.35;
        diffuseColor.rgb *= 1.0 + (paint - 0.5) * 2.0 * uBrush;`
      )
  }
  // Materials with different brush settings must not share a program.
  material.customProgramCacheKey = () => `painted-${brush}-${brushScale}`
  return material
}

// The island's palette: a bright summer afternoon in the hills.
export const palette = {
  grass: "#7fa94c",
  grassDeep: "#5d8f3f",
  meadow: "#a3bf5c",
  sand: "#e7d6a6",
  soil: "#8a6a48",
  waterDeep: "#4a8fb6",
  waterShallow: "#8fd0d0",
  foam: "#f4f8f2",
  leaf: "#467f3a",
  leafLight: "#7ca94a",
  pine: "#2f6a43",
  trunk: "#4f4237",
  skyZenith: "#3b7fd4",
  skyHorizon: "#d4e9f3",
  snow: "#f2f5f8",
}
