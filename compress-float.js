const alphabet = [...new Array(64)].map((_, i) => {
	if (i < 26) {
		return String.fromCharCode(i + 'A'.charCodeAt(0));
	}
	i -= 26;
	if (i < 26) {
		return String.fromCharCode(i + 'a'.charCodeAt(0));
	}
	i -= 26;
	if (i < 10) {
		return String.fromCharCode(i + '0'.charCodeAt(0));
	}
	i -= 10;
	return '-_'[i];
});

const truncateNormal = (value) => {
	return Math.max(0, Math.min(1, value));
};

export const compressFloat = (value, min, max, bits) => {
	const nDigits = Math.ceil(bits/6);
	const nBits = nDigits*6;
	const range = 2**nBits;
	let normal = truncateNormal((value - min)/(max - min))*(1 - 1/range);
	let res = '';
	for (let i=0; i<nDigits; ++i) {
		normal *= 64;
		const int = Math.floor(normal);
		normal -= int;
		res += alphabet[int];
	}
	return res;
};

export const decompressFloat = (string, min, max) => {
	let normal = 0;
	let mask = 1;
	const range = 64**string.length;
	for (let i=0; i<string.length; ++i) {
		mask /= 64;
		const int = alphabet.indexOf(string[i]);
		normal += int*mask;
	}
	const value = normal*(range/(range - 1))*(max - min) + min;
	return value;
};
