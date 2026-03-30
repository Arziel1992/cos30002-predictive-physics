<script>
  import Sidebar from './lib/Sidebar.svelte';
  import Canvas from './lib/Canvas.svelte';
  import Controls from './lib/Controls.svelte';
  import Stats from './lib/Stats.svelte';
  import Glossary from './lib/Glossary.svelte';
  import { BallisticsSim } from './lib/Simulation.js';
  import { onMount } from 'svelte';

  let stats = $state({
    hits: 0,
    misses: 0,
    totalFires: 0,
    lastError: 0
  });

  let simulation = $state(new BallisticsSim(stats));
  let params = $state({
    mode: 'hitscan',
    targetSpeed: 2.0,
    muzzleVelocity: 600,
    gravity: 980,
    dragK: 0.05
  });
  
  let sidebarWidth = $state(400);
  let isResizing = $state(false);
  let containerRef = $state();

  let glossaryOpen = $state(false);
  let glossarySection = $state('root');

  function openGlossary(section = 'root') {
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
    if (e.code === 'Space') { e.preventDefault(); fire(); }
    if (e.key === '1') params.mode = 'hitscan';
    if (e.key === '2') params.mode = 'distance';
    if (e.key === '3') params.mode = 'advanced';
    if (e.key === 'r') {
        simulation.reset();
        stats.hits = 0; stats.misses = 0; stats.totalFires = 0; stats.lastError = 0;
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

    const handleGlobalResize = (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(300, Math.min(e.clientX, window.innerWidth * 0.25));
        sidebarWidth = newWidth;
    };
    const stopResizing = () => { isResizing = false; };

    window.addEventListener('mousemove', handleGlobalResize);
    window.addEventListener('mouseup', stopResizing);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleGlobalResize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<main class="app-layout" class:resizing={isResizing}>
  <aside class="sidebar-container" style="width: {sidebarWidth}px">
    <div class="sidebar-inner">
      <Sidebar />
      <hr />
      <Controls 
        bind:params 
        onFire={fire} 
        onReset={() => {
            simulation.reset();
            stats.hits = 0; stats.misses = 0; stats.totalFires = 0; stats.lastError = 0;
        }} 
        onGlossary={openGlossary}
      />
    </div>
    <div class="app-footer">
      Made with ❤️ for Swinburne — COS30002 Artificial Intelligence for Games
    </div>
    <button class="resizer" onmousedown={() => isResizing = true} aria-label="Resize Sidebar"></button>
  </aside>
  
  <section class="canvas-panel" bind:this={containerRef}>
    <Canvas {simulation} {params} {containerRef} />
    
    <div class="floating-top-right">
       <Stats {stats} mode={params.mode} onGlossary={openGlossary} />
    </div>

    <div class="floating-bottom-right">
        <div class="kb-hint">
            Shortcuts: [Space] Fire | [1-3] Mode | [R] Reset
        </div>
    </div>
  </section>

  <Glossary bind:isOpen={glossaryOpen} bind:section={glossarySection} />
</main>

<style>
  :global(:root) {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --accent: #2563eb;
    --panel-border: #e2e8f0;
    --glass-bg: rgba(255, 255, 255, 0.85);
  }

  :global(body) {
    margin: 0; padding: 0;
    background-color: var(--bg-primary); color: var(--text-primary);
    font-family: 'Inter', system-ui, sans-serif; overflow: hidden;
  }

  .app-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }
  .app-layout.resizing { cursor: col-resize; user-select: none; }

  .sidebar-container {
    background-color: var(--bg-secondary); border-right: 1px solid var(--panel-border);
    display: flex; flex-direction: column; position: relative;
    box-shadow: 1px 0 10px rgba(0,0,0,0.05); z-index: 100; flex-shrink: 0;
  }

  .sidebar-inner { flex: 1; overflow-y: auto; padding: 1.5rem; }

  .resizer {
    position: absolute; right: -3px; top: 0;
    width: 6px; height: 100%; cursor: col-resize;
    background: transparent; border: none; z-index: 110;
  }
  .resizer:hover, .app-layout.resizing .resizer { background: var(--accent); }

  .app-footer {
    padding: 1rem; font-size: 0.7rem; color: var(--text-secondary);
    text-align: center; border-top: 1px solid var(--panel-border); background: var(--bg-primary);
  }

  /* Fixed: The canvas panel must be overflow: hidden to contain the floating elements correctly */
  .canvas-panel { flex: 1; position: relative; background-color: #f1f5f9; overflow: hidden; }

  .floating-top-right {
    position: absolute; top: 1.5rem; right: 1.5rem;
    pointer-events: none; z-index: 200;
  }

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

  hr { border: 0; border-top: 1px solid var(--panel-border); margin: 1.5rem 0; }
</style>
