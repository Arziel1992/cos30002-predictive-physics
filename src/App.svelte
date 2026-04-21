<script>
import { onMount } from "svelte";
import Canvas from "./lib/Canvas.svelte";
import Controls from "./lib/Controls.svelte";
import Glossary from "./lib/Glossary.svelte";
import Sidebar from "./lib/Sidebar.svelte";
import { BallisticsSim } from "./lib/Simulation.js";
import Stats from "./lib/Stats.svelte";

let stats = $state({
	hits: 0,
	misses: 0,
	totalFires: 0,
	lastError: 0,
});

let simulation = $state(new BallisticsSim(stats));
let params = $state({
	mode: "hitscan",
	targetSpeed: 2.0,
	muzzleVelocity: 600,
	gravity: 980,
	dragK: 0.05,
});

let containerRef = $state();

let leftOpen = $state(true);
let rightOpen = $state(true);

let glossaryOpen = $state(false);
let glossarySection = $state("root");

function openGlossary(section = "root") {
	glossarySection = section;
	glossaryOpen = true;
}

function fire() {
	if (containerRef) {
		const rect = containerRef.getBoundingClientRect();
		simulation.fire(params, { width: rect.width, height: rect.height });
	}
}

function handleKeydown(e) {
	if (e.code === "Space") {
		e.preventDefault();
		fire();
	}
	if (e.key === "1") params.mode = "hitscan";
	if (e.key === "2") params.mode = "distance";
	if (e.key === "3") params.mode = "advanced";
	if (e.key === "r") {
		simulation.reset();
		stats.hits = 0;
		stats.misses = 0;
		stats.totalFires = 0;
		stats.lastError = 0;
	}
}

onMount(() => {
	let animationId;
	const loop = () => {
		if (containerRef) {
			const rect = containerRef.getBoundingClientRect();
			simulation.update(params, { width: rect.width, height: rect.height });
		}
		animationId = requestAnimationFrame(loop);
	};
	loop();

	window.addEventListener("keydown", handleKeydown);

	return () => {
		cancelAnimationFrame(animationId);
		window.removeEventListener("keydown", handleKeydown);
	};
});
</script>

<main class="app-layout">
  {#if leftOpen}
  <aside class="sidebar-left">
    <div class="sidebar-inner">
      <Sidebar />
    </div>
    <div class="app-footer">
      Made with ❤️ for Swinburne — COS30002 Artificial Intelligence for Games
    </div>
  </aside>
  {/if}

  <section class="canvas-panel" bind:this={containerRef}>
    <button class="toggle-btn toggle-left" onclick={() => leftOpen = !leftOpen} aria-label="Toggle left sidebar">
      {leftOpen ? '◀' : '▶'}
    </button>
    <button class="toggle-btn toggle-right" onclick={() => rightOpen = !rightOpen} aria-label="Toggle right sidebar">
      {rightOpen ? '▶' : '◀'}
    </button>

    <Canvas {simulation} {params} {containerRef} />

    <div class="floating-bottom-right">
      <div class="kb-hint">
        Shortcuts: [Space] Fire | [1-3] Mode | [R] Reset
      </div>
    </div>
  </section>

  {#if rightOpen}
  <aside class="sidebar-right">
    <div class="sidebar-inner">
      <Controls
        bind:params
        onFire={fire}
        onReset={() => {
          simulation.reset();
          stats.hits = 0; stats.misses = 0; stats.totalFires = 0; stats.lastError = 0;
        }}
        onGlossary={openGlossary}
      />

      <hr />

      <Stats {stats} mode={params.mode} onGlossary={openGlossary} />
    </div>
    <div class="app-footer">
      &copy; E. Ketterer Ortiz - 
      <a href="https://github.com/Arziel1992/cos30002-predictive-physics/" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; font-weight: 600;">
        <svg height="11" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="11" style="fill: currentColor; vertical-align: middle; margin-top: -2px;">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg> Repository
      </a>
    </div>
  </aside>
  {/if}

  <Glossary bind:isOpen={glossaryOpen} bind:section={glossarySection} />
</main>

<style>
  /* Toggle buttons */
  .toggle-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 200; width: 28px; height: 56px;
    background: var(--glass-bg); backdrop-filter: blur(8px);
    border: 1px solid var(--panel-border); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; color: var(--text-secondary);
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .toggle-btn:hover { background: var(--accent); color: white; }
  .toggle-left { left: 0; border-radius: 0 8px 8px 0; border-left: none; }
  .toggle-right { right: 0; border-radius: 8px 0 0 8px; border-right: none; }

  .floating-bottom-right {
    position: absolute; bottom: 1.5rem; right: 1.5rem;
    pointer-events: none; z-index: 200;
  }

  .kb-hint {
    background: var(--glass-bg); backdrop-filter: blur(4px);
    padding: 0.6rem 1.2rem; border-radius: 99px;
    font-size: 0.75rem; color: var(--text-secondary);
    border: 1px solid var(--panel-border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    pointer-events: auto; cursor: default;
  }

  </style>
