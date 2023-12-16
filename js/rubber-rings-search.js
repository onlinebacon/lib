import { DEG, uAngle } from './trig.js';
import { calcAzimuth, haversine, shoot } from './sphere-math.js';
import { icosahedronCoords } from './icosahedron-coords.js';

class Rubber {
	constructor(coord, circles) {
		this.circles = circles;
		this.coord = coord;
		this.totalTension = null;
	}
	iterate() {
		const { circles, coord } = this;
		let dx = 0;
		let dy = 0;
		let maxDist = 0;
		for (const { center, radius } of circles) {
			const dist = haversine(coord, center);
			const azm = calcAzimuth(coord, center);
			const offset = dist - radius;
			dx += Math.sin(azm)*offset;
			dy += Math.cos(azm)*offset;
			maxDist = Math.max(maxDist, dist);
		}
		const azm = uAngle(dy, dx);
		const dist = Math.min(maxDist, Math.sqrt(dx**2 + dy**2));
		this.coord = shoot(coord, azm, dist/2);
		return this;
	}
	updateTotalTension() {
		const { circles, coord } = this;
		let sum = 0;
		for (const { center, radius } of circles) {
			const dist = haversine(coord, center);
			const tension = Math.abs(radius - dist);
			sum += tension;
		}
		this.totalTension = sum;
		return this;
	}
}

const mergeClosest = (rubbers, mergeDist) => {
	let pair = null;
	let pairDist = Infinity;
	for (let j=1; j<rubbers.length; ++j) {
		const b = rubbers[j];
		for (let i=0; i<j; ++i) {
			const a = rubbers[i];
			const dist = haversine(a.coord, b.coord);
			if (dist < mergeDist && dist < pairDist) {
				pair = [ i, j ];
				pairDist = dist;
			}
		}
	}
	if (pair === null) {
		return false;
	}
	const [ aIndex, bIndex ] = pair;
	const a = rubbers[aIndex];
	const b = rubbers[bIndex];
	if (a.totalTension < b.totalTension) {
		rubbers.splice(bIndex, 1);
	} else {
		rubbers.splice(aIndex, 1);
	}
	return true;
};

export const rubberRingsSearch = ({
	circles,
	iterations = 500,
	mergeDist = DEG/3600,
	nResults = 12,
}) => {
	const rubbers = icosahedronCoords.map(coord => {
		return new Rubber(coord, circles);
	});
	for (let i=0; i<iterations; ++i) {
		for (const rubber of rubbers) {
			rubber.iterate();
		}
	}
	rubbers.forEach(r => r.updateTotalTension());
	for (;;) {
		const removed = mergeClosest(rubbers, mergeDist);
		if (!removed) break;
	}
	rubbers.sort((a, b) => a.totalTension - b.totalTension);
	if (rubbers.length > nResults) {
		rubbers.length = nResults;
	}
	const ans = rubbers.map(r => r.coord);
	return ans;
};
