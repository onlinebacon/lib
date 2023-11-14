import { D180, D30, D360, D45, D90, DEG } from './trig.js';

class Projection {
    constructor({
        name = '',
        toNormal = ([ lat, lon ]) => [ 0, 0 ],
        toLatLon = ([ x, y ]) => [ 0, 0 ],
        buildArg = () => {},
        ratio = 1,
        cylindrical = false,
        azimuthal = false,
    }) {
        this.name = name;
        this.toNormal = toNormal;
        this.toLatLon = toLatLon;
        this.buildArg = buildArg;
        this.ratio = ratio;
        this.cylindrical = cylindrical;
        this.azimuthal = azimuthal;
    }
}

export const equirectangular = new Projection({
    name: 'Equirectangular',
    toNormal: ([ lat, lon ]) => {
        if (Math.abs(lat) > D90 || Math.abs(lon) > D180) {
            return [ NaN, NaN ];
        }
        const x = lon/D360 + 0.5;
        const y = lat/D180 + 0.5;
        return [ x, y ];
    },
    toLatLon: ([ x, y ]) => {
        if (x < 0 || x > 1 || y < 0 || y > 1) {
            return [ NaN, NaN ]
        }
        const lat = (y - 0.5)*D180;
        const lon = (x - 0.5)*D360;
        return [ lat, lon ];
    },
    ratio: 2,
    cylindrical: true,
});

export const azimuthalEquidistant = new Projection({
    name: 'Ezimuthal equidistant',
    toNormal: ([ lat, lon ]) => {
        const rad = 0.25 - lat/D360;
        const sin = Math.sin(lon);
        const cos = Math.cos(lon);
        const x = 0.5 + sin*rad;
        const y = 0.5 - cos*rad;
        return [ x, y ];
    },
    toLatLon: ([ x, y ]) => {
        const dx = x - 0.5;
        const dy = y - 0.5;
        const len = Math.sqrt(dx**2 + dy**2);
        if (len === 0) {
            return [ D90, 0 ];
        }
        if (len > 0.5) {
            return [ NaN, NaN ];
        }
        const lat = (0.5 - len/0.5)*D180;
        const abs = Math.acos(-dy/len);
        const lon = dx >= 0 ? abs : - abs;
        return [ lat, lon ];
    },
    ratio: 1,
    azimuthal: true,
});

const projectStereographicLatitude = (lat) => {
    return Math.cos(lat)/(1 + Math.sin(lat));
};
const reverseStereographicLatitude = (l) => {
    const lSqr = l**2;
    const a = lSqr + 1;
    const b = 2*lSqr;
    const c = lSqr - 1;
    const d = b**2 - 4*a*c;
    return Math.asin((Math.sqrt(d) - b)/(2*a));
};
const defStereographicEdgeLat = - D30;
const defStereographicArg = projectStereographicLatitude(defStereographicEdgeLat);

export const stereographic = new Projection({
    name: 'Stereographic',
    buildArg: ({
        edgeLatitude = defStereographicEdgeLat,
    }) => {
        return projectStereographicLatitude(edgeLatitude);
    },
    toNormal: ([ lat, lon ], arg = defStereographicArg) => {
        const rad = projectStereographicLatitude(lat)/arg*0.5;
        const x = 0.5 + Math.sin(lon)*rad;
        const y = 0.5 - Math.cos(lon)*rad;
        return [ x, y ];
    },
    toLatLon: ([ x, y ], arg = defStereographicArg) => {
        const dx = x - 0.5;
        const dy = y - 0.5;
        const len = Math.sqrt(dx**2 + dy**2);
        if (len === 0) {
            return [ D90, 0 ];
        }
        const abs = Math.acos(-dy/len);
        const lon = dx >= 0 ? abs : - abs;
        return [ reverseStereographicLatitude(len*arg*2), lon ];
    },
    azimuthal: true,
    ratio: 1,
});

export const all = [
    equirectangular,
    azimuthalEquidistant,
    stereographic,
];
