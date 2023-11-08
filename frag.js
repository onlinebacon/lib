const defFn = ((x, y) => {
	const r = Math.min(255, Math.max(0, x*255|0));
	const g = Math.min(255, Math.max(0, y*255|0));
	return `rgb(${r}, ${g}, 255)`;
});

const delay = (ms) => {
	return new Promise((done) => setTimeout(done, ms));
};

export default class Frag {
	constructor({
		canvas = document.createElement('canvas'),
		fragColor = defFn,
		bounds = {
			left: 0,
			right: 1,
			top: 1,
			bottom: 0,
		},
	}) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.fragColor = fragColor;
		this.bounds = bounds;
		this.resetTransform();
		this.renderId = 0;
		this.render();
	}

	async render() {
		const { width, height } = this.canvas;
		const { ctx, fragColor, mx, cx, my, cy } = this;
		const interval = 20;
		const renderId = ++this.renderId;
		
		let stopAt = Date.now() + interval;
		let cell = 81;
		
		for (let y=0; y<height; y+=cell) {
			const vy = (y + cell/2)*my + cy;
			for (let x=0; x<width; x+=cell) {
				const vx = (x + cell/2)*mx + cx;
				ctx.fillStyle = fragColor(vx, vy);
				ctx.fillRect(x, y, cell, cell);
				if (Date.now() >= stopAt) {
					await delay(0);
					if (renderId !== this.renderId) {
						return;
					}
					stopAt = Date.now() + interval;
				}
			}
		}

		do {
			let sub = cell/3; 
			for (let y=0; y<height; y+=cell) {
				for (let x=0; x<width; x+=cell) {
					for (let i=0; i<9; ++i) {
						i += i === 4;
						const row = Math.floor(i/3);
						const col = i % 3;
						const nx = x + col*sub;
						const ny = y + row*sub;
						const vx = (nx + sub/2)*mx + cx;
						const vy = (ny + sub/2)*my + cy;
						ctx.fillStyle = fragColor(vx, vy);
						ctx.fillRect(nx, ny, sub, sub);
						if (Date.now() >= stopAt) {
							await delay(0);
							if (renderId !== this.renderId) {
								return;
							}
							stopAt = Date.now() + interval;
						}
					}
				}
			}
			cell = sub;
		} while (cell > 1);
	}

	resetTransform() {
		const { width, height } = this.canvas;
		const { left, right, top, bottom } = this.bounds;
		this.cx = left;
		this.mx = (right - left)/width;
		this.cy = top;
		this.my = (bottom - top)/height;
		return this;
	}

	zoom(scale, x, y) {
		const { mx, cx, my, cy } = this;
		const sx = mx*scale;
		this.mx = sx;
		this.cx = x*mx + cx - x*sx;
		const sy = my*scale;
		this.my = sy;
		this.cy = y*my + cy - y*sy;
		return this;
	}

	translate(dx, dy) {
		this.cx -= dx*this.mx;
		this.cy -= dy*this.my;
		return this;
	}

	bindZoom() {
		const { canvas } = this;
		canvas.addEventListener('wheel', e => {
			const scale = 1 + e.deltaY*1e-3;
			const x = e.offsetX;
			const y = e.offsetY;
			this.zoom(scale, x, y);
			delay(0).then(() => this.render());
		});
	}

	bindMove({ button = 0, ctrlKey = false, shiftKey = false, altKey = false } = {}) {
		const { canvas } = this;
		let lastPos = null;

		canvas.addEventListener('mousedown', e => {
			if (e.button !== button) {
				return;
			}
			if (e.ctrlKey !== ctrlKey || e.shiftKey !== shiftKey || e.altKey !== altKey) {
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			const x = e.offsetX;
			const y = e.offsetY;
			lastPos = { x, y };
		});

		canvas.addEventListener('mouseup', e => {
			if (e.button !== button) {
				return;
			}
			lastPos = null;
		});

		canvas.addEventListener('mousemove', e => {
			if (lastPos === null) {
				return;
			}
			const x = e.offsetX;
			const y = e.offsetY;
			const dx = x - lastPos.x;
			const dy = y - lastPos.y;
			lastPos.x = x;
			lastPos.y = y;
			this.translate(dx, dy);
			delay(0).then(() => this.render());
		});
	}
}
