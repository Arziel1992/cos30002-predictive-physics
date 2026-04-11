<script>
let {
	params = $bindable(),
	onFire = () => {},
	onReset = () => {},
	onGlossary = () => {},
} = $props();

const modes = [
	{
		id: "hitscan",
		label: "Mode A: Hitscan",
		tooltip:
			"Instant beam. Requires zero lead time, zero prediction. The simplest targeting algorithm.",
	},
	{
		id: "distance",
		label: "Mode B: Simple Kinematics",
		tooltip:
			"Basic Newtonian intercept. Calculates lead time = distance / velocity. Compensates for gravity, but ignores drag.",
	},
	{
		id: "advanced",
		label: "Mode C: Advanced Ballistics",
		tooltip:
			'Atmospheric awareness. The AI uses an iterative "Guess, Try, Refine" loop to account for non-linear decay (Drag).',
	},
];
</script>

<div class="controls-panel">
  <header class="section-header">
    <h3>AI Targeting Mode</h3>
    <button class="glossary-btn" onclick={() => onGlossary('mode')}>?</button>
  </header>
  <div class="toggle-list">
    {#each modes as m}
      <button 
        class:active={params.mode === m.id} 
        onclick={() => params.mode = m.id}
        title={m.tooltip}
      >
        {m.label}
      </button>
    {/each}
  </div>

  <hr />

  <header class="section-header">
    <h3>Physical Environment</h3>
    <button class="glossary-btn" onclick={() => onGlossary('root')}>?</button>
  </header>
  
  <div class="control-group">
    <div class="label-row">
      <label for="target-speed">Target Speed (rad/s)</label>
      <div class="actions">
          <span>{params.targetSpeed}</span>
          <button class="glossary-btn-small" onclick={() => onGlossary('speed')}>?</button>
      </div>
    </div>
    <input 
      id="target-speed" type="range" min="0.1" max="5.0" step="0.1" 
      bind:value={params.targetSpeed}
      title="How fast the target moves along its sine-wave path. Higher speeds increase the required lead distance."
    >
  </div>

  <div class="control-group">
    <div class="label-row">
      <label for="muzzle-velocity">Muzzle Velocity (px/s)</label>
      <div class="actions">
          <span>{params.muzzleVelocity}</span>
          <button class="glossary-btn-small" onclick={() => onGlossary('velocity')}>?</button>
      </div>
    </div>
    <input 
      id="muzzle-velocity" type="range" min="100" max="2000" step="10" 
      bind:value={params.muzzleVelocity}
      title="The initial launch speed. Increasing velocity reduces the Time-to-Intercept, allowing for smaller lead angles."
    >
  </div>

  <div class="control-group">
    <div class="label-row">
      <label for="gravity">Gravity (px/s²)</label>
      <div class="actions">
          <span>{params.gravity}</span>
          <button class="glossary-btn-small" onclick={() => onGlossary('gravity')}>?</button>
      </div>
    </div>
    <input 
      id="gravity" type="range" min="0" max="2000" step="10" 
      bind:value={params.gravity}
      title="Standard downward acceleration. In Mode B & C, the AI must aim higher than the target to compensate for bullet drop."
    >
  </div>

  {#if params.mode === 'advanced'}
  <div class="control-group">
    <div class="label-row">
      <label for="drag">Air Density/Drag (K)</label>
      <div class="actions">
          <span>{params.dragK}</span>
          <button class="glossary-btn-small" onclick={() => onGlossary('drag')}>?</button>
      </div>
    </div>
    <input 
      id="drag" type="range" min="0" max="0.5" step="0.01" 
      bind:value={params.dragK}
      title="Aerodynamic friction. It continuously slows the bullet, causing it to fall short unless the AI iteratively recalibrates its aim."
    >
  </div>
  {/if}

  <hr />

  <div class="action-grid">
    <button class="fire-btn" onclick={onFire} title="Launch a probe to verify the AI's current prediction algorithm. [SPACE]">
      Fire Projectile
    </button>
    <button class="reset-btn" onclick={onReset} title="Reset target position and clear all active projectiles. [R]">
      Reset Grid
    </button>
  </div>
</div>

<style>
  .controls-panel { display: flex; flex-direction: column; gap: 0.8rem; }
  h3 { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin: 0; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin: 1rem 0 0.5rem 0; }

  .glossary-btn {
    background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);
    color: var(--accent); width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
    font-weight: 800; cursor: pointer; transition: all 0.2s;
  }

  .glossary-btn:hover { background: var(--accent); color: white; }

  .glossary-btn-small {
    background: none; border: none; color: var(--text-secondary); 
    padding: 2px 5px; opacity: 0.5; font-size: 0.7rem; cursor: pointer;
  }

  .glossary-btn-small:hover { opacity: 1; color: var(--accent); }

  .toggle-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .toggle-list button {
    padding: 0.7rem; border-radius: 6px; border: 1px solid var(--panel-border);
    background: var(--bg-primary); color: var(--text-secondary);
    font-size: 0.8rem; font-weight: 600; cursor: pointer; text-align: left;
    transition: all 0.2s;
  }
  .toggle-list button.active {
    background: var(--bg-secondary); border-color: var(--accent);
    color: var(--text-primary); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .control-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .label-row { display: flex; justify-content: space-between; font-size: 0.8rem; align-items: center; }
  .label-row .actions { display: flex; align-items: center; gap: 0.4rem; }
  .label-row span { color: var(--accent); font-family: monospace; font-weight: 700; width: 40px; text-align: right; }

  input[type="range"] { appearance: none; background: var(--panel-border); height: 4px; border-radius: 2px; }
  input[type="range"]::-webkit-slider-thumb {
    appearance: none; width: 14px; height: 14px; background: var(--accent); border-radius: 50%;
  }

  .action-grid { display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; margin-top: 1rem; }
  .fire-btn { 
    background: var(--accent); color: #fff; border: none; padding: 0.8rem; 
    border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.75rem;
  }
  .reset-btn {
    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444; padding: 0.8rem; border-radius: 6px; cursor: pointer; width: 100px;
    font-size: 0.75rem; font-weight: 700;
  }

  hr { border: 0; border-top: 1px solid var(--panel-border); margin: 1rem 0; }
</style>
