import ColorPicker from '../../color-picker.js';
import Frag from '../../frag.js';
import { azimuthalEquidistant, equirectangular } from '../../sphere-projections.js';

const loadImage = (src) => new Promise((done) => {
    const img = document.createElement('img');
    img.onload = () => done(img);
    img.src = src;
});

const img = await loadImage('./map.png');
const picker = new ColorPicker(img);
const canvas = document.querySelector('canvas');

let source = equirectangular;
let target = azimuthalEquidistant;

canvas.width = canvas.height*target.ratio;

const frag = new Frag({
    canvas,
    fragColor: (x, y) => {
        const latLon = target.toLatLon([ x, y ]);
        const [ nx, ny ] = source.toNormal(latLon);
        if (isNaN(nx) || isNaN(ny)) {
            return '#222';
        }
        const col = Math.floor(nx*img.width);
        const row = Math.floor((1 - ny)*img.height);
        if (col < 0 || col >= img.width) {
            return '#222';
        }
        if (row < 0 || row >= img.height) {
            return '#222';
        }
        return picker.getRgbString(row, col);
    },
});

frag.bindMove();
frag.bindZoom();
