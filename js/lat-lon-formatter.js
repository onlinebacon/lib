import { AngleFormatter } from './angle-formatter.js';

export class LatLonFormatter {
	constructor(formatter = new AngleFormatter()) {
		this.formatter = formatter;
	}
	formatWithSigns(angle, pos, neg) {
		const { formatter } = this;
		const str = formatter.format(angle);
		if (str.startsWith('-')) {
			return str.substring(1) + formatter.sep + neg;
		}
		if (str.startsWith('+')) {
			return str.substring(1) + formatter.sep + pos;
		}
		return str + formatter.sep + pos;
	}
	formatLat(lat) {
		return this.formatWithSigns(lat, 'N', 'S');
	}
	formatLon(lon) {
		return this.formatWithSigns(lon, 'E', 'W');
	}
	format([ lat, lon ]) {
		return `${this.formatLat(lat)}, ${this.formatLon(lon)}`;
	}
}
