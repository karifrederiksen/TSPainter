﻿
export function clamp(n: number, min: number, max: number) { 
	return Math.min(Math.max(n, min), max);
}

// modulus with expected behaviour
export function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

// expects x to be in range [0, 1]
export function smoothstep(x: number) { 
	return x * x * (3 - 2 * x);
}

// expects x to be in range [0, 1]
export function smootherstep(x: number) { 
	return x * x * x * (x * (x * 6 - 15) + 10);
}

// exponentially scale from 0 to 1
export function expostep(x: number) {
	return x === 0 
		? 0 
		: 2.718281828459 ** (1 - (1 / (x * x)));
}

export function isPowerOfTwo(width: number, height: number) {
	return width > 0 && (width & (width - 1)) === 0 
		&& height > 0 && (height & (height - 1)) === 0;
}

export function distance(x0: number, y0: number, x1: number, y1: number) {
	return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
}