<script>
	import { onMount } from 'svelte';

	// major parts of code from https://github.com/patrickhlauke/touch/tree/gh-pages/coalesced-predicted-events
	// licensed under MIT (c) 2015 Patrick H. Lauke

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D} */
	let ctx;
	/** @type {HTMLDivElement} */
	let container;
	/** @type {DOMRect} */
	let rect;
	/** @type {ReturnType<typeof requestAnimationFrame> | null}*/
	let frame;

	/** @typedef {[number, number, number]} Point */

	/** @type {(Point | null)[]} */
	let allPoints = [];
	/** @type {Point[]} */
	let predictedPoints = [];

	let activePointerId = null;

	const eventPos = (/** @type {PointerEvent | TouchEvent} */ event) => ('clientX' in event ? { x: event.clientX, y: event.clientY } : { x: event.touches[0].clientX, y: event.touches[0].clientY });

	function startDrawing(/** @type {PointerEvent} */ event) {
		if (activePointerId || !event.isPrimary || event.buttons & 32) return;
		// todo: implement eraser
		activePointerId = event.pointerId;
		rect = canvas.getBoundingClientRect();
		allPoints.push([eventPos(event).x - rect.left, eventPos(event).y - rect.top, event.pressure]);
		frame = requestAnimationFrame(drawPoints);
	}

	function savePoints(/** @type {PointerEvent} */ event) {
		if (event.pointerId === activePointerId) {
			event.preventDefault();
			if (typeof event.getCoalescedEvents === 'function') {
				const events = event.getCoalescedEvents();
				for (const event of events) {
					allPoints.push([eventPos(event).x - rect.left, eventPos(event).y - rect.top, event.pressure]);
				}
			} else {
				allPoints.push([eventPos(event).x - rect.left, eventPos(event).y - rect.top, event.pressure]);
			}
			if (typeof event.getPredictedEvents === 'function') {
				const events = event.getPredictedEvents();
				// only show latest prediction when rendering
				predictedPoints = events.map((event) => [eventPos(event).x - rect.left, eventPos(event).y - rect.top, event.pressure]);
			}
		}
	}

	function drawPoints() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// ctx.lineWidth = 1;
		// ctx.strokeStyle = '#888888';
		// predictedPoints.forEach((point) => {
		// 	ctx.beginPath();
		// 	ctx.arc(point[0], point[1], 4, 0, Math.PI * 2, true);
		// 	ctx.stroke();
		// });

		ctx.lineWidth = 5;

		allPoints.forEach((point, index) => {
			let lastPoint = allPoints[index - 1];
			if (point !== null) {
				ctx.beginPath(); // Begin a new path for the next point to avoid continuous lines
				if (lastPoint) ctx.moveTo(lastPoint[0], lastPoint[1]);
				ctx.lineTo(point[0], point[1]);
				ctx.strokeStyle = `rgba(238, 238, 238, ${point[2]})`;
				ctx.stroke();
			}
		});

		// maybe a bit much
		predictedPoints.forEach((point) => {
			ctx.lineTo(point[0], point[1]);
		});
		ctx.stroke();
		predictedPoints = [];

		if (frame) frame = requestAnimationFrame(drawPoints);
	}

	function stopDrawing() {
		activePointerId = null;
		if (frame) cancelAnimationFrame(frame);
		frame = null;
		predictedPoints = [];
		allPoints.push(null); // line break
		drawPoints();
	}

	function resetCanvas() {
		allPoints = [];
		predictedPoints = [];
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	onMount(() => {
		ctx = /** @type {any} */ (canvas.getContext('2d'));
		const containerRect = container.getBoundingClientRect();
		canvas.width = containerRect.width * window.devicePixelRatio;
		canvas.height = containerRect.height * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		resetCanvas();
	});
</script>

<div class="container" bind:this={container}>
	<canvas bind:this={canvas} width="400" height="300" on:pointerdown={startDrawing} on:pointermove={savePoints} on:pointerup={stopDrawing} />
</div>

<style>
	.container {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	canvas {
		box-sizing: border-box;
		touch-action: none;
		width: 100%;
		height: 100%;
		/* background: #f9f9f9; */
	}
</style>
