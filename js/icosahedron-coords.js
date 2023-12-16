import { D90, D180, D360 } from './trig.js';

const buildIcoCoords = () => {
	const lat = Math.atan(0.5);
	const arr = [
		[ D90, 0 ],
	];
	for (let i=0; i<5; ++i) {
		const lon = i/5*D360 - D180;
		arr.push([ lat, lon ]);
	}
	for (let i=0; i<5; ++i) {
		const lon = (i + 0.5)/5*D360 - D180;
		arr.push([ -lat, lon ]);
	}
	arr.push([ -D90, 0 ]);
	return arr;
};

export const icosahedronCoords = buildIcoCoords();
