import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';

class Rectangle {
    rc: RoughSVG;
    svgE: SVGSVGElement;

    constructor(svgElement: SVGSVGElement) {
        this.rc = rough.svg(svgElement);
        this.svgE = svgElement;
    }

    makeRectangle = (x: number, y: number, h: number, w: number) => {
        let roughNode = this.rc.rectangle(x, y, w, h); // x, y, width, height (changed order)
        console.log(roughNode);
        roughNode.onclick = () => {
            alert("hello");
        }
        this.svgE.appendChild(roughNode);
    };

    showRectangle = async (x: number, y: number, h: number, w: number) => {
        let roughNode = this.rc.rectangle(x, y, w, h); // x, y, width, height (changed order)
        console.log(roughNode);
        this.svgE.appendChild(roughNode);
        setTimeout(() => {
            console.log('in timeout')
            this.svgE.removeChild(roughNode);
        }, 1);
    };
}

export default Rectangle;