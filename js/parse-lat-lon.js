import { parseDegree } from './parse-degree.js';

const latSignRegex = /^[ns]|[ns]$/i;
const lonSignRegex = /^[ew]|[ew]$/i;

const parseLatOrLon = (string, signRegex, lowerNeg) => {
	string = string.trim();
	const sign = string.match(signRegex)?.[0];
	if (sign == null) {
		return parseDegree(string);
	}
	string = string.replace(signRegex, '');
	if (sign.toLowerCase() == lowerNeg) {
		return - parseDegree(string);
	}
	return parseDegree(string);
};

export const parseLat = (string) => {
	return parseLatOrLon(string, latSignRegex, 's');
};

export const parseLon = (string) => {
	return parseLatOrLon(string, lonSignRegex, 'w');
};

export const parseLatLon = (string) => {
	const values = string.split(/\s*,\s*/);
	if (values.length !== 2) {
		return null;
	}
	const lat = parseLat(values[0]);
	if (isNaN(lat)) {
		return null;
	}
	const lon = parseLon(values[1]);
	if (isNaN(lon)) {
		return null;
	}
	return [ lat, lon ];
};
