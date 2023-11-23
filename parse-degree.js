class Source {
	constructor(string) {
		this.buffer = string;
	}
	pop(regex) {
		const { buffer } = this;
		const match = buffer.match(regex)?.[0];
		if (match == null) {
			return null;
		}
		this.buffer = buffer.replace(regex, '');
		return match;
	}
	trim() {
		this.buffer = this.buffer.trim();
		return this;
	}
	empty() {
		return this.buffer === '';
	}
}
const regex = {
	number: /^\d+(\.\d+)?/,
	unit: /^\s*[°'"]\s*/,
	sign: /^[+\-]/,
};
const units = `°'"`;
const compareUnits = (a, b) => {
	return units.indexOf(a) - units.indexOf(b);
};
const toNextUnit = {
	'°': "'",
	"'": '"',
};
const unitToScale = {
	'°': 1,
	"'": 1/60,
	'"': 1/3600,
};

export const parseDegree = (string) => {
	const src = new Source(string).trim();
	const sign = src.pop(regex.sign);

	let lastUnit = null;
	let sum = 0;
	while (!src.trim().empty()) {
		const number = src.pop(regex.number);
		if (!number) {
			return NaN;
		}
		
		const unit = src.pop(regex.unit)?.trim();
		if (unit != null) {
			if (lastUnit != null && compareUnits(lastUnit, unit) >= 0) {
				return NaN;
			}
			src.trim();
			sum += unitToScale[unit]*number;
			lastUnit = unit;
			continue;
		}

		console.log({ number, lastUnit });
		
		if (lastUnit == null) {
			sum += Number(number);
			lastUnit = '°';
			continue;
		}

		const nextUnit = toNextUnit[lastUnit];
		if (nextUnit == null) {
			return NaN;
		}
		sum += unitToScale[nextUnit]*number;
		lastUnit = nextUnit;
	}

	if (lastUnit == null) {
		return NaN;
	}

	if (sign === '-') {
		return - sum;
	}
	return sum;
};
