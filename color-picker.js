export default class ColorPicker {
    constructor(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const { width, height } = img;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, width, height);
        this.data = [ ...data ];
        this.width = width;
        this.lineSize = width*4;
    }
    getRgbString(row, col) {
        const { data, lineSize } = this;
        const index = lineSize*row + col*4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        return `rgb(${r}, ${g}, ${b})`;
    }
}
