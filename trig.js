const { sqrt } = Math;
export const PI = Math.PI;
export const TAU = PI*2;
export const PI3 = PI*3;
export const DEG = PI/180;
export const IDEG = 180/PI;
export const D45 = PI/4;
export const D90 = PI/2;
export const D180 = PI;
export const D270 = PI*1.5;
export const D360 = PI*2;
export const uAngle = (adj, opp) => {
	const len = sqrt(adj**2 + opp**2);
	if (len === 0) {
		return 0;
	}
	const abs = Math.acos(adj/len);
	return (opp >= 0) ? (abs) : (TAU - abs);
};
export const sAngle = (adj, opp) => {
	const len = sqrt(adj**2 + opp**2);
	if (len === 0) {
		return 0;
	}
	const abs = Math.acos(adj/len);
	return (opp >= 0) ? (abs) : (-abs);
};
export const uTrunc = (ang) => (ang%TAU + TAU)%TAU;
export const sTrunc = (ang) => (ang%TAU + PI3)%TAU - PI;
export const Deg = {
	sin: (deg) => Math.sin(deg*DEG),
	cos: (deg) => Math.cos(deg*DEG),
	tan: (deg) => Math.tan(deg*DEG),
	asin: (sin) => Math.asin(sin)*IDEG,
	acos: (cos) => Math.acos(cos)*IDEG,
	atan: (tan) => Math.atan(tan)*IDEG,
	uTrunc: (deg) => (deg%360 + 360)%360,
	sTrunc: (deg) => (deg%360 + 540)%360 - 180,
	uAngle: (adj, opp) => uAngle(adj, opp)*IDEG,
	sAngle: (adj, opp) => sAngle(adj, opp)*IDEG,
};
