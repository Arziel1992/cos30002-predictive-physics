<script>
  let { isOpen = $bindable(false), section = $bindable('root'), onClose } = $props();

  const entries = [
    { id: 'root', title: 'Glossary: Physics & Targeting', body: 'Predictive modelling is the art of anticipating a target s future position. Select a term below or from the simulator controls to dive into the mathematical and pedagogical background.' },
    { id: 'mode', title: 'Targeting Modes', body: 'The AI uses different levels of predictive logic. Hitscan is instantaneous, Kinematics uses T=D/V math, and Advanced uses an iterative loop to solve for drag.' },
    { id: 'speed', title: 'Target Speed', body: 'The angular velocity of the target periodic movement. Higher speeds demand greater lead angles and faster intercept calculations.' },
    { id: 'velocity', title: 'Muzzle Velocity', body: 'The initial speed of the projectile. High muzzle velocity reduces time-to-intercept, making the prediction more robust against target velocity changes.' },
    { id: 'gravity', title: 'Gravity compensation', body: 'Downward acceleration (9.8m/s²). The AI must calculate the Vertical Offset (Aim point) based on the square of the travel time.' },
    { id: 'drag', title: 'Iterative Drag Solving', body: 'Atmospheric friction causes non-linear deceleration. AI must loop through guest-estimates (iterative refinement) to find the true intercept point.' },
    { id: 'error', title: 'Convergence Error', body: 'The distance between the predicted intercept point and the actual location where the projectile would cross the targets plane. Small error values (<0.001) indicate a stable, accurate solution.' }
  ];

  function handleClose() {
    isOpen = false;
    onClose?.();
  }

  function scrollToSection(id) {
    const el = document.getElementById(`glossary-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    section = id;
  }

  $effect(() => {
    if (isOpen && section) {
      setTimeout(() => scrollToSection(section), 10);
    }
  });
</script>

{#if isOpen}
<div class="modal-overlay" onclick={handleClose} onkeydown={(e) => e.key === 'Escape' && handleClose()} tabindex="-1">
  <div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="0">
    <aside class="toc">
      <h3>Glossary</h3>
      <ul>
        {#each entries as entry}
          <li>
            <button 
              class:active={section === entry.id} 
              onclick={() => scrollToSection(entry.id)}
            >
              {entry.title.split(':')[1]?.trim() || entry.title}
            </button>
          </li>
        {/each}
      </ul>
      <button class="close-main-btn" onclick={handleClose}>Close Modal</button>
    </aside>

    <div class="content-view">
      {#each entries as entry}
        <section id="glossary-{entry.id}">
          <h2>{entry.title}</h2>
          <p>{entry.body}</p>
          <hr />
        </section>
      {/each}
      <div class="footer-note">Note: For university-level AI, we focus on the transition from static rules to iterative physical simulations.</div>
    </div>
  </div>
</div>
{/if}

<style>
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--bg-secondary); border: 1px solid var(--panel-border);
    border-radius: 12px; width: 800px; max-width: 90%; height: 600px;
    box-shadow: 0 10px 50px rgba(0,0,0,0.1);
    display: flex; overflow: hidden;
  }

  .toc {
    width: 220px; background: var(--bg-primary); 
    border-right: 1px solid var(--panel-border);
    padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
  }

  .toc h3 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); margin: 0; }
  
  .toc ul { list-style: none; padding: 0; margin: 0; flex: 1; }
  
  .toc button {
    background: none; border: none; font-size: 0.85rem; color: var(--text-secondary);
    padding: 0.5rem 0; cursor: pointer; display: block; text-align: left; width: 100%;
    transition: color 0.2s;
  }

  .toc button:hover, .toc button.active { color: var(--accent); font-weight: 600; }

  .content-view { flex: 1; padding: 2rem; overflow-y: auto; scroll-behavior: smooth; }
  
  section { margin-bottom: 3rem; scroll-margin-top: 2rem; }

  h2 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 1rem; }
  p { line-height: 1.6; color: var(--text-secondary); font-size: 1rem; }
  
  hr { border: 0; border-top: 1px solid var(--panel-border); margin: 2rem 0; }

  .footer-note { font-style: italic; font-size: 0.85rem; color: var(--accent); opacity: 0.8; margin-top: 2rem; }

  .close-main-btn {
    background: var(--bg-secondary); border: 1px solid var(--panel-border); padding: 0.6rem;
    border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);
  }
</style>
