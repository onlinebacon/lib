export class Vec3 extends Array {
	constructor(a, b, c) {
		super(3);
		if (a !== undefined) {
			if (a instanceof Array) {
				this[0] = a[0];
				this[1] = a[1];
				this[2] = a[2];
			} else {
				this[0] = a;
				this[1] = b;
				this[2] = c;
			}
		}
	}
	get x() { return this[0]; }
	get y() { return this[1]; }
	get z() { return this[2]; }
	set x(value) { this[0] = value; }
	set y(value) { this[1] = value; }
	set z(value) { this[2] = value; }
	len() {
		const [ x, y, z ] = this;
		return Math.sqrt(x**2 + y**2 + z**2);
	}
	scale(value, dst = new Vec3()) {
		const [ x, y, z ] = this;
		dst[0] = x*value;
		dst[1] = y*value;
		dst[2] = z*value;
		return dst;
	}
	plus([ bx, by, bz ], dst = new Vec3()) {
		const [ ax, ay, az ] = this;
		dst[0] = ax + bx;
		dst[1] = ay + by;
		dst[2] = az + bz;
		return dst;
	}
	minus([ bx, by, bz ], dst = new Vec3()) {
		const [ ax, ay, az ] = this;
		dst[0] = ax - bx;
		dst[1] = ay - by;
		dst[2] = az - bz;
		return dst;
	}
	rotX(angle, dst = new Vec3()) {
		const [ x, y, z ] = this;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		dst[0] = x;
		dst[1] = y*cos + z*sin;
		dst[2] = z*cos - y*sin;
		return dst;
	}
	rotY(angle, dst = new Vec3()) {
		const [ x, y, z ] = this;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		dst[0] = x*cos - z*sin;
		dst[1] = y;
		dst[2] = z*cos + x*sin;
		return dst;
	}
	rotZ(angle, dst = new Vec3()) {
		const [ x, y, z ] = this;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		dst[0] = x*cos + y*sin;
		dst[1] = y*cos - x*sin;
		dst[2] = z;
		return dst;
	}
	dot([ bx, by, bz ]) {
		const [ ax, ay, az ] = this;
		return ax*bx + ay*by + az*bz;
	}
	normalize(dst = new Vec3()) {
		return this.scale(1/this.len(), dst);
	}
	mulMat(mat, dst = new Vec3()) {
		const [ x, y, z ] = this;
		const [
			ix, iy, iz,
			jx, jy, jz,
			kx, ky, kz,
		] = mat;
		dst[0] = x*ix + y*jx + z*kx;
		dst[1] = x*iy + y*jy + z*ky;
		dst[2] = x*iz + y*jz + z*kz;
		return dst;
	}
}

export const vec3 = (...values) => {
	return new Vec3(values.flat());
};
