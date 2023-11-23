import { shoot } from "./sphere-math.js";
import { D30, D360, D60 } from "./trig.js";

const defFn = ([ lat, lon ]) => {};

export class SphericalMinimizer {
	constructor({
		fn = defFn,
		coord = [ 0, 0 ],
		azimuth = 0,
		radius = D30,
	}) {
		this.fn = fn;
		this.coord = coord;
		this.azimuth = azimuth;
		this.radius = radius;
		this.value = fn(coord);
	}
	iterate() {
		const { fn, coord, azimuth, radius } = this;
		let newAzimuth = null;
		let newCoord = null;
		let newValue = this.value;
		const n = 6;
		for (let i=0; i<n; ++i) {
			const testAzimuth = (azimuth + i/n*D360) % D360;
			const testCoord = shoot(coord, testAzimuth, radius);
			const testValue = fn(testCoord);
			if (testValue < newValue) {
				newCoord = testCoord;
				newAzimuth = testAzimuth;
				newValue = testValue;
			}
		}
		if (newCoord !== null) {
			this.azimuth = newAzimuth;
			this.coord = newCoord;
			this.value = newValue;
			this.radius = Math.min(D60, radius*1.25);
		} else {
			this.azimuth = (azimuth + Math.SQRT2) % D360;
			this.radius *= 0.75;
		}
		return this;
	}
}
