class Unit {
	constructor({ singular, plural, symbols, inMeters }) {
		this.singular = singular;
		this.plural = plural;
		this.symbols = symbols;
		this.inMeters = inMeters;
	}
}

export const MILE = new Unit({
	singular: 'mile',
	plural: 'miles',
	symbols: [ 'mi' ],
	inMeters: 1609.344,
});

export const YARD = new Unit({
	singular: 'yard',
	plural: 'yards',
	symbols: [ 'yd' ],
	inMeters: 0.9144,
});

export const FOOT = new Unit({
	singular: 'foot',
	plural: 'feet',
	symbols: [ 'ft' ],
	inMeters: 0.3048,
});

export const INCH = new Unit({
	singular: 'inch',
	plural: 'inches',
	symbols: [ 'in' ],
	inMeters: 0.0254,
});

export const KILOMETER = new Unit({
	singular: 'kilometer',
	plural: 'kilometers',
	symbols: [ 'km' ],
	inMeters: 1000,
});

export const METER = new Unit({
	singular: 'meter',
	plural: 'meters',
	symbols: [ 'm' ],
	inMeters: 1,
});

export const CENTIMETER = new Unit({
	singular: 'centimeter',
	plural: 'centimeters',
	symbols: [ 'cm' ],
	inMeters: 0.01,
});

export const MILLIMETER = new Unit({
	singular: 'millimeter',
	plural: 'millimeters',
	symbols: [ 'mm' ],
	inMeters: 0.001,
});

export const NAUTICAL_MILE = new Unit({
	singular: 'nautical mile',
	plural: 'nautical miles',
	symbols: [ 'NM', 'M', 'nmi' ],
	inMeters: 1852,
});

export const imperial = [ MILE, YARD, FOOT, INCH ];
export const metric = [ KILOMETER, METER, CENTIMETER ];
export const others = [ NAUTICAL_MILE ];
export const all = [
	...metric,
	...imperial,
	...others,
];

export const find = (str) => {
	const lowerCase = str.toLowerCase().trim().replace(/\s+/g, ' ');
	return all.find(unit => {
		if (unit.symbols.includes(str)) {
			return true;
		}
		if (unit.singular === lowerCase) return true;
		if (unit.plural === lowerCase) return true;
		return false;
	});
};

const numberRegex = /^\d+(\.\d+)?(e[+\-]?\d+)?/i;
export const parse = (str, unit = METER, defaultUnit) => {
	str = str.trim();
	const strNum = str.match(numberRegex)?.[0];
	if (strNum == null) {
		return NaN;
	}
	const raw = Number(strNum);
	if (isNaN(raw)) {
		return NaN;
	}
	str = str.substring(strNum.length).trim();
	if (str === '') {
		if (defaultUnit == null) return NaN;
		return raw*defaultUnit.inMeters/unit.inMeters;
	}
	const usedUnit = find(str);
	if (usedUnit == null) {
		return NaN;
	}
	return raw*usedUnit.inMeters/unit.inMeters;
};
