<script>
	/** @type {HTMLDivElement} */
	let penElement;
	/** @type {HTMLDivElement} */
	let penContainer;
	let newPenData = false;
	let penData = {
		pressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		clientX: 0,
		clientY: 0,
	};

	/** @type {import('svelte/elements').PointerEventHandler<Window>} */
	function handlePointerMove(event) {
		if (event.pointerType === 'pen') {
			newPenData = true;
			penData = {
				pressure: event.pressure,
				tiltX: event.tiltX,
				tiltY: event.tiltY,
				twist: event.twist || 0,
				clientX: event.clientX,
				clientY: event.clientY,
			};
		}
	}

	function updatePenDisplay() {
		if (penElement && newPenData) {
			newPenData = false;
			const scale = 1 + penData.pressure * 0.5;
			const rotateX = -penData.tiltY - 90;
			const rotateY = penData.twist;
			const rotateZ = penData.tiltX;

			penElement.style.transform = `
        scale3d(${scale}, ${scale}, ${scale})
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
      `;
			penContainer.style.left = `${penData.clientX}px`;
			penContainer.style.top = `${penData.clientY}px`;
		}
		requestAnimationFrame(updatePenDisplay);
	}
	requestAnimationFrame(updatePenDisplay);
</script>

<svelte:window on:pointermove={handlePointerMove} on:touchstart|nonpassive={(e) => e.preventDefault()} />

<div class="pen-container" bind:this={penContainer}>
	<div class="pen" bind:this={penElement}>
		<div class="pen-body">
			<div class="pen-body-front"></div>
			<div class="pen-body-back">
				<div class="pen-buttons"></div>
			</div>
			<div class="pen-body-left"></div>
			<div class="pen-body-right"></div>
			<div class="pen-body-top"></div>
			<!-- <div class="pen-body-bottom"></div> -->
		</div>
		<div class="pen-tip">
			<div class="pen-tip-front"></div>
			<div class="pen-tip-back"></div>
			<div class="pen-tip-left"></div>
			<div class="pen-tip-right"></div>
			<!-- <div class="pen-tip-top"></div> -->
			<div class="pen-tip-bottom"></div>
		</div>
	</div>
</div>

<div class="info">
	<p>Pressure: {penData.pressure.toFixed(2)}</p>
	<p>Tilt X: {penData.tiltX.toFixed(2)}°</p>
	<p>Tilt Y: {penData.tiltY.toFixed(2)}°</p>
	<p>Twist: {penData.twist.toFixed(2)}°</p>
</div>

<style>
	.pen-container {
		perspective: 1000px;
		position: absolute;
	}

	.pen {
		font-size: 1.5px; /* makes 1em = _px */
		width: 20em;
		height: 160em;
		transform-style: preserve-3d;
		transform-origin: top left;
		transition: transform 0.01s ease;
		position: relative;
		left: -10em;
	}

	.pen-body {
		width: 100%;
		height: 100%;
		position: absolute;
		transform-style: preserve-3d;
		top: -180em;
	}

	.pen-body-front,
	.pen-body-back,
	.pen-body-left,
	.pen-body-right,
	.pen-body-top,
	.pen-body-bottom {
		position: absolute;
		background-color: #4a4a4a;
	}

	.pen-body-front,
	.pen-body-back {
		width: 20em;
		height: 160em;
		left: 0;
	}

	.pen-body-left,
	.pen-body-right {
		width: 12em;
		height: 160em;
		top: 0;
	}

	.pen-body-top,
	.pen-body-bottom {
		width: 20em;
		height: 12em;
		left: 0;
	}

	.pen-body-front {
		transform: translateZ(6em);
	}
	.pen-body-back {
		transform: translateZ(-6em);
	}
	.pen-body-left,
	.pen-tip-left {
		transform: translateX(-6em) rotateY(-90deg);
	}
	.pen-body-right,
	.pen-tip-right {
		transform: translateX(14em) rotateY(90deg);
	}
	.pen-body-top {
		transform: translateY(-6em) rotateX(-90deg);
	}
	/* .pen-body-bottom {
		transform: translateY(80em) rotateX(-90deg);
	} */

	.pen-buttons {
		background: #333d;
		width: 10em;
		height: 50em;
		left: 5em;
		bottom: 15em;
		position: absolute;
	}

	.pen-tip {
		width: 20em;
		height: 20em;
		position: absolute;
		top: -20em;
		left: 0;
		transform-style: preserve-3d;
	}

	.pen-tip-front,
	.pen-tip-back,
	.pen-tip-left,
	.pen-tip-right,
	.pen-tip-top,
	.pen-tip-bottom {
		position: absolute;
		background-color: #333;
	}

	.pen-tip-front,
	.pen-tip-back {
		width: 20em;
		height: 20em;
		left: 0;
	}

	.pen-tip-left,
	.pen-tip-right {
		width: 12em;
		height: 20em;
		top: 0;
	}

	.pen-tip-top,
	.pen-tip-bottom {
		width: 20em;
		height: 12em;
		left: 0;
	}

	.pen-tip-front {
		transform: translateZ(6em);
	}
	.pen-tip-back {
		transform: translateZ(-6em);
	}
	/* .pen-tip-left {
		transform: translateX(-10em) rotateY(-90deg);
	}
	.pen-tip-right {
		transform: translateX(10em) rotateY(90deg);
	}
	.pen-tip-top {
		transform: translateY(-10em) rotateX(-90deg);
	} */
	.pen-tip-bottom {
		transform: translateY(14em) rotateX(-90deg);
	}

	.info {
		position: absolute;
		top: 20px;
		left: 20px;
		font-family: Arial, sans-serif;
	}
</style>
