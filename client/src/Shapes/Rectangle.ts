import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Shape from './Shapes';

class Rectangle implements Shape {
    rc: RoughSVG;
    svgE: SVGSVGElement;

    constructor(svgElement: SVGSVGElement) {
        this.rc = rough.svg(svgElement);
        this.svgE = svgElement;
    }

    makeShape = (x: number, y: number, h: number, w: number): void => {
        const roughNode = this.rc.rectangle(x, y, h, w);

        roughNode.firstChild?.addEventListener('mousedown', (event) => {
            event.stopPropagation();
        })

        roughNode.addEventListener('mousedown', (event) => {
            event.stopPropagation();

            alert("hello");
        });
        this.svgE.appendChild(roughNode);
    };


    showShape = (x: number, y: number, h: number, w: number): void => {
        const roughNode = this.rc.rectangle(x, y, h, w);
        this.svgE.appendChild(roughNode);
        setTimeout(() => {
            this.svgE.removeChild(roughNode);
        }, 1);
    };
}

export default Rectangle;