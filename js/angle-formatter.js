const { abs } = Math;

const ronud = (value, figures = 0) => {
	return Number(value.toFixed(figures));
};

const formatToDecimals = (degrees, figures = 3) => {
	return ronud(degrees, figures) + '°';
};

const formatToMinutes = (degrees, figures = 1, sep = '') => {
	const totalMin = ronud(abs(degrees)*60, figures);
	const min = ronud(totalMin % 60, figures);
	const deg = ronud((totalMin - min)/60);
	return `${degrees < 0 ? '-' : ''}${deg}°${sep}${min}'`;
};

const formatToSeconds = (degrees, figures = 1, sep = '') => {
	const totalSec = ronud(abs(degrees)*60*60, figures);
	const sec = ronud(totalSec % 60, figures);
	const totalMin = ronud((totalSec - sec)/60);
	const min = ronud(totalMin % 60);
	const deg = ronud((totalMin - min)/60);
	return `${degrees < 0 ? '-' : ''}${deg}°${sep}${min}'${sep}${sec}"`;
};

export class AngleFormatter {
	constructor({
		func      = formatToDecimals,
		figures   = undefined,
		sep       = undefined,
		forceSign = false,
	} = {}) {
		this.func = func;
		this.figures = figures;
		this.sep = sep;
		this.forceSign = forceSign;
	}
	format(angle) {
		const str = this.func(angle, this.figures, this.sep);
		if (this.forceSign && !str.startsWith('-')) {
			return '+' + str;
		}
		return str;
	}
	withFigures(figures) {
		const res = new AngleFormatter(this);
		res.figures = figures;
		return res;
	}
	withSep(sep) {
		const res = new AngleFormatter(this);
		res.sep = sep;
		return res;
	}
	forcingSign(forceSign) {
		const res = new AngleFormatter(this);
		res.forceSign = forceSign;
		return res;
	}
	decimals() {
		const res = new AngleFormatter(this);
		res.func = formatToDecimals;
		return res;
	}
	minutes() {
		const res = new AngleFormatter(this);
		res.func = formatToMinutes;
		return res;
	}
	seconds() {
		const res = new AngleFormatter(this);
		res.func = formatToSeconds;
		return res;
	}
}
