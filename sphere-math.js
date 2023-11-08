import { sAngle, uAngle } from './trig.js';
import { Vec3 } from './vec3.js';

const { sqrt, asin, sin, cos } = Math;

export const haversine = ([ lat1, lon1 ], [ lat2, lon2 ]) => {
	return 2*asin(
		sqrt(
			sin((lat2 - lat1)/2)**2
			+ cos(lat1)*cos(lat2)*sin((lon2 - lon1)/2)**2
		)
	);
};

export const latLonToVec3 = ([ lat, lon ]) => {
	const cosLat = cos(lat);
	const x = cos(lon)*cosLat;
	const y = sin(lon)*cosLat;
	const z = sin(lat);
	return new Vec3(x, y, z);
};

export const vec3ToLatLon = ([ x, y, z ]) => {
	const lon = sAngle(x, y);
	const lat = asin(z);
	return [ lat, lon ];
};

export const calcAzimuth = ([ lat1, lon1 ], [ lat2, lon2 ]) => {
	const dtLon = lon2 - lon1;
	const x = cos(dtLon)*cos(lat2);
	const y = sin(dtLon)*cos(lat2);
	const z = sin(lat2);
	const nz = z*cos(lat1) - x*sin(lat1);
	return uAngle(nz, y);
};

export const shoot = ([ lat, lon ], azimuth, distance) => {
	const sinR = sin(distance);
	const vec = new Vec3(
		cos(distance),
		sinR*sin(azimuth),
		sinR*cos(azimuth),
	);
	vec.rotY(lat, vec);
	vec.rotZ(-lon, vec);
	return vec3ToLatLon(vec);
};
