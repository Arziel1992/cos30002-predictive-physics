<script>
import { onMount } from "svelte";

let { simulation, params, containerRef } = $props();

let canvas;
let ctx;
let width = 0;
let height = 0;

function handleResize() {
	if (!containerRef || !canvas || !ctx) return;
	const rect = containerRef.getBoundingClientRect();
	width = rect.width;
	height = rect.height;

	const dpr = window.devicePixelRatio || 1;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	ctx.resetTransform();
	ctx.scale(dpr, dpr);
}

function drawTrajectory(turX, turY) {
	if (params.mode === "hitscan") {
		ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(turX, turY);
		ctx.lineTo(simulation.target.x * width, simulation.target.y * height);
		ctx.stroke();
		ctx.setLineDash([]);
		return;
	}

	// Predictive Arc
	const muzzleV = params.muzzleVelocity;
	const gravity = params.gravity;
	const dragK = params.dragK;
	const hasDrag = params.mode === "advanced";
	const angle = simulation.turret.angle;

	let vx = Math.cos(angle) * muzzleV;
	let vy = Math.sin(angle) * muzzleV;
	let px = turX;
	let py = turY;
	let t = 0;
	const dt = 0.05;

	ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
	ctx.setLineDash([4, 4]);
	ctx.beginPath();
	ctx.moveTo(px, py);

	// Simulate path for next 3 seconds or until off-screen
	while (t < 3 && px < width + 100 && px > -100) {
		vy += gravity * dt;
		if (hasDrag) {
			const speed = Math.sqrt(vx * vx + vy * vy);
			vx -= (vx / (speed || 1)) * dragK * speed * dt;
			vy -= (vy / (speed || 1)) * dragK * speed * dt;
		}
		px += vx * dt;
		py += vy * dt;
		ctx.lineTo(px, py);
		t += dt;
	}
	ctx.stroke();
	ctx.setLineDash([]);

	// Draw Prediction Point (where it intersects target line)
	ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
	ctx.beginPath();
	ctx.arc(simulation.prediction.x, simulation.prediction.y, 4, 0, Math.PI * 2);
	ctx.fill();
}

function render() {
	if (!ctx) return;
	ctx.clearRect(0, 0, width, height);

	// 1. Grid
	ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
	ctx.lineWidth = 1;
	for (let x = 0; x < width; x += 50) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
		ctx.stroke();
	}
	for (let y = 0; y < height; y += 50) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
		ctx.stroke();
	}

	const turX = simulation.turret.x * width;
	const turY = simulation.turret.y * height;
	const targetX = simulation.target.x * width;
	const targetY = simulation.target.y * height;

	// 2. Trajectory & Prediction
	drawTrajectory(turX, turY);

	// 3. Projectiles
	for (const p of simulation.projectiles) {
		if (p.type === "laser") {
			ctx.strokeStyle = `rgba(239, 68, 68, ${p.life / 10})`;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(p.x1, p.y1);
			ctx.lineTo(p.x2, p.y2);
			ctx.stroke();
		} else {
			const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
			gradient.addColorStop(0, "#3b82f6");
			gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// 4. Turret
	ctx.save();
	ctx.translate(turX, turY);
	ctx.rotate(simulation.turret.angle);
	ctx.fillStyle = "#475569";
	ctx.fillRect(-15, -15, 30, 30);
	ctx.fillStyle = params.mode === "hitscan" ? "#ef4444" : "#3b82f6";
	ctx.fillRect(0, -5, 50, 10);
	ctx.restore();

	// 5. Target
	ctx.fillStyle = "#ef4444";
	ctx.beginPath();
	ctx.arc(targetX, targetY, 20, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(targetX - 25, targetY);
	ctx.lineTo(targetX + 25, targetY);
	ctx.moveTo(targetX, targetY - 25);
	ctx.lineTo(targetX, targetY + 25);
	ctx.stroke();

	requestAnimationFrame(render);
}

onMount(() => {
	ctx = canvas.getContext("2d");
	render();
});

$effect(() => {
	if (containerRef && canvas) {
		const resizeObserver = new ResizeObserver(() => handleResize());
		resizeObserver.observe(containerRef);
		handleResize();
		return () => resizeObserver.disconnect();
	}
});
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas { display: block; width: 100%; height: 100%; cursor: crosshair; }
</style>
