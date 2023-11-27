export class Mat3 extends Array {
	constructor(...values) {
		super(9);
		if (values.length === 0) {
			for (let i=0; i<9; ++i) {
				this[i] = ((i & 3) === 0)|0;
			}
		} else if (values.length === 9) {
			for (let i=0; i<9; ++i) {
				this[i] = values[i];
			}
		} else if (values.length === 1 && values[0] instanceof Array) {
			for (let i=0; i<9; ++i) {
				this[i] = values[0][i];
			}
		}
	}
	sinCosRotX(sin, cos, dst = new Mat3()) {
		const [
			ix, iy, iz,
			jx, jy, jz,
			kx, ky, kz,
		] = this;

		dst[0] = ix;
		dst[1] = iy*cos + iz*sin;
		dst[2] = iz*cos - iy*sin;

		dst[3] = jx;
		dst[4] = jy*cos + jz*sin;
		dst[5] = jz*cos - jy*sin;

		dst[6] = kx;
		dst[7] = ky*cos + kz*sin;
		dst[8] = kz*cos - ky*sin;

		return dst;
	}
	sinCosRotY(sin, cos, dst = new Mat3()) {
		const [
			ix, iy, iz,
			jx, jy, jz,
			kx, ky, kz,
		] = this;

		dst[0] = ix*cos - iz*sin;
		dst[1] = iy;
		dst[2] = iz*cos + ix*sin;

		dst[3] = jx*cos - jz*sin;
		dst[4] = jy;
		dst[5] = jz*cos + jx*sin;

		dst[6] = kx*cos - kz*sin;
		dst[7] = ky;
		dst[8] = kz*cos + kx*sin;

		return dst;
	}
	sinCosRotZ(sin, cos, dst = new Mat3()) {
		const [
			ix, iy, iz,
			jx, jy, jz,
			kx, ky, kz,
		] = this;

		dst[0] = ix*cos + iy*sin;
		dst[1] = iy*cos - ix*sin;
		dst[2] = iz;

		dst[3] = jx*cos + jy*sin;
		dst[4] = jy*cos - jx*sin;
		dst[5] = jz;

		dst[6] = kx*cos + ky*sin;
		dst[7] = ky*cos - kx*sin;
		dst[8] = kz;

		return dst;
	}
	rotX(ang, dst = new Mat3()) {
		return this.sinCosRotX(Math.sin(ang), Math.cos(ang), dst);
	}
	rotY(ang, dst = new Mat3()) {
		return this.sinCosRotY(Math.sin(ang), Math.cos(ang), dst);
	}
	rotZ(ang, dst = new Mat3()) {
		return this.sinCosRotZ(Math.sin(ang), Math.cos(ang), dst);
	}
	mulMat(mat, dst = new Mat3()) {
		const [
			aix, aiy, aiz,
			ajx, ajy, ajz,
			akx, aky, akz,
		] = this;

		const [
			bix, biy, biz,
			bjx, bjy, bjz,
			bkx, bky, bkz,
		] = mat;

		dst[0] = aix*bix + aiy*bjx + aiz*bkx;
		dst[1] = aix*biy + aiy*bjy + aiz*bky;
		dst[2] = aix*biz + aiy*bjz + aiz*bkz;

		dst[3] = ajx*bix + ajy*bjx + ajz*bkx;
		dst[4] = ajx*biy + ajy*bjy + ajz*bky;
		dst[5] = ajx*biz + ajy*bjz + ajz*bkz;

		dst[6] = akx*bix + aky*bjx + akz*bkx;
		dst[7] = akx*biy + aky*bjy + akz*bky;
		dst[8] = akx*biz + aky*bjz + akz*bkz;

		return dst;
	}
}

export const mat3 = (...args) => {
	return new Mat3(...args);
};
