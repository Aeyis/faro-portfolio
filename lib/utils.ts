import type { CSSProperties } from "react";
import { CANVAS } from "./constants";

type Layer = { x: number; y: number; w: number; h: number };

// Convertit les coordonnées Figma (px) en positions CSS (%)
// relatives au canvas de référence 1920x1258
export function figmaToCSS(layer: Layer): CSSProperties {
  return {
    position: "absolute",
    left:   `${(layer.x / CANVAS.width)  * 100}%`,
    top:    `${(layer.y / CANVAS.height) * 100}%`,
    width:  `${(layer.w / CANVAS.width)  * 100}%`,
    height: `${(layer.h / CANVAS.height) * 100}%`,
  };
}
