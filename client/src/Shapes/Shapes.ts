import { RoughSVG } from "roughjs/bin/svg";

interface Shape {
    rc: RoughSVG;
    svgE: SVGSVGElement;

    makeShape(x: number, y: number, h: number, w: number): void;

    showShape(x: number, y: number, h: number, w: number): void;
}
export default Shape;