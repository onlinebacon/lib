export const parseDegree = (string) => {
	// TODO: Refactor this to allow arcminutes and seconds
	string = string.replace(/\s*[°'"]\s*|\s+/g, ' ').trim();
	const sign = /(^[sw\-]|[sw]$)/i.test(string) ? -1 : 1;
	string = string.replace(/^[nsew+\-]|[nsew]$/i, '').trim();
	return string.split(' ').map((v, i) => v*60**-i).reduce((a, b) => a + b, 0)*sign;
};
