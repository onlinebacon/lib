import ColorPicker from '../../color-picker.js';
import Frag from '../../frag.js';
import { mat3 } from '../../mat3.js';
import { haversine, latLonToVec3, vec3ToLatLon } from '../../sphere-math.js';
import { equirectangular, orthographic } from '../../sphere-projections.js';
import { D30, D90, DEG } from '../../trig.js';

const loadImage = (src) => new Promise((done) => {
    const img = document.createElement('img');
    img.onload = () => done(img);
    img.src = src;
});

const img = await loadImage('./map.png');
const picker = new ColorPicker(img);
const canvas = document.querySelector('canvas');

let source = equirectangular;
let target = orthographic;

canvas.width = canvas.height*target.ratio;

let viewLat = 0;
let viewLon = 0;
let mat = mat3();

const updateMat = () => {
    mat = mat3().rotY(viewLat - D90).rotZ(-viewLon);
};

updateMat();

const rollCoord = (coord) => {
    const vec = latLonToVec3(coord);
    vec.mulMat(mat, vec);
    return vec3ToLatLon(vec);
};

const frag = new Frag({
    canvas,
    fragColor: (x, y) => {
        const latLon = target.toLatLon([ x, y ]);
        if (isNaN(latLon[0])) {
            return '#222';
        }
        const coord = rollCoord(latLon);
        const [ nx, ny ] = source.toNormal(coord);
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
