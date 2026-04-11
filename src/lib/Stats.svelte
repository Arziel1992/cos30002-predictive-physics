<script>
let { stats, mode, onGlossary = () => {} } = $props();

function getAccuracy() {
	if (stats.totalFires === 0) return 0;
	return (stats.hits / stats.totalFires) * 100;
}
</script>

<div class="stats-window">
  <div class="stat-header">Live Simulation Stats</div>
  
  <div class="stat-grid">
    <div class="stat-item">
      <span class="label">Total Fires</span>
      <span class="value">{stats.totalFires}</span>
    </div>
    <div class="stat-item">
      <span class="label">Hits / Misses</span>
      <span class="value cyan">{stats.hits} / {stats.misses}</span>
    </div>
    <div class="stat-item">
      <span class="label">Accuracy</span>
      <span class="value {getAccuracy() > 50 ? 'green' : 'red'}">{getAccuracy().toFixed(1)}%</span>
    </div>
    
    {#if mode === 'advanced'}
    <div class="stat-item full">
      <div class="label-row-stats">
        <span class="label">Iterative Convergence Error</span>
        <button class="glossary-btn-stat" onclick={() => onGlossary('error')}>?</button>
      </div>
      <span class="value small monospace">{stats.lastError.toFixed(6)} px</span>
    </div>
    {/if}
  </div>
</div>

<style>
  .stats-window {
    background: var(--bg-primary);
    border: 1px solid var(--panel-border);
    border-radius: 12px;
    padding: 1.2rem;
  }

  .stat-header {
    font-size: 0.7rem; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 1.5px;
    margin-bottom: 0.8rem; border-bottom: 1px solid var(--panel-border);
    padding-bottom: 0.4rem; font-weight: 700;
  }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem 0.8rem; }
  .stat-item { display: flex; flex-direction: column; gap: 0.2rem; }
  .stat-item.full { grid-column: span 2; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 0.8rem; }

  .label-row-stats { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px; }

  .glossary-btn-stat {
    background: none; border: none; color: var(--accent); 
    padding: 2px 5px; opacity: 0.5; font-size: 0.75rem; cursor: pointer;
    font-weight: 800; border-radius: 50%; border: 1px solid transparent;
  }

  .glossary-btn-stat:hover { opacity: 1; border-color: var(--accent); }

  .label { font-size: 0.65rem; color: var(--text-secondary); font-weight: 500; }
  .value { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
  
  .cyan { color: var(--accent); }
  .green { color: #16a34a; }
  .red { color: #dc2626; }
  .small { font-size: 0.75rem; }
  .monospace { font-family: 'JetBrains Mono', monospace; }
</style>
