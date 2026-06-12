import {
  Color,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
} from "three"
import { BallTextureFactory } from "./balltexturefactory"
import { BallCubeTextureFactory } from "./ballcubetexturefactory"

export class BallMaterialFactory {
  private static readonly materialCache: Map<
    string,
    MeshBasicMaterial | MeshPhongMaterial | MeshPhysicalMaterial
  > = new Map()

  static createTexturedDotsMaterial(color: Color): MeshPhysicalMaterial {
    const key = `texturedDots_${color.getHex()}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshPhysicalMaterial
    }

    const cubeTexture = BallCubeTextureFactory.getOrCreateTexture(color)
    const material = new MeshPhysicalMaterial({
      color: color,
      roughness: 0.1,
      metalness: 0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.25,
    })

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.uCubeMap = { value: cubeTexture }

      shader.vertexShader = `
        varying vec3 vLocalPos;
        ${shader.vertexShader}
      `.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vLocalPos = position;`
      )

      shader.fragmentShader = `
        uniform samplerCube uCubeMap;
        varying vec3 vLocalPos;
        ${shader.fragmentShader}
      `.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb = textureCube(uCubeMap, normalize(vLocalPos)).rgb;`
      )
    }

    this.materialCache.set(key, material)
    return material
  }

  static createDottedMaterial(color: Color): MeshPhongMaterial {
    const key = `dotted_${color.getHex()}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshPhongMaterial
    }

    const material = new MeshPhongMaterial({
      emissive: 0,
      flatShading: true,
      vertexColors: true,
      forceSinglePass: true,
      shininess: 25,
      specular: 0x555533,
      transparent: false,
      depthWrite: true,
    })
    this.materialCache.set(key, material)
    return material
  }

  static createCueBallMaterial(): MeshPhysicalMaterial {
    const key = "cue_white"
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshPhysicalMaterial
    }
    const material = new MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.3,
    })
    this.materialCache.set(key, material)
    return material
  }

  /**
   * 目标球：MeshBasicMaterial + map，贴图原色显示，不受 PBR 高光影响（避免灰白大理石纹）
   */
  static createProjectedMaterial(
    label: number,
    color: Color,
    size = 512
  ): MeshBasicMaterial {
    const key = `basic_ball_${label}_${size}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshBasicMaterial
    }

    const numberTexture = BallTextureFactory.getOrCreateTexture(
      label,
      color,
      size
    )

    const material = new MeshBasicMaterial({
      map: numberTexture,
      toneMapped: false,
    })

    this.materialCache.set(key, material)
    return material
  }
}
