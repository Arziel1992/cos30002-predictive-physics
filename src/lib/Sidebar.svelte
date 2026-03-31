<section class="sidebar-content">
  <header>
    <h1>Predictive Ballistics</h1>
    <p class="tagline">Kinematic Intercept Systems for COS30002</p>
  </header>

  <div class="md-body">
    <h2 id="theory">📖 The Textbook: Predictive Modelling</h2>
    <p>
      In game development, <strong>Predictive Modelling</strong> is the art of anticipating a target's future position to ensure a successful hit. Without it, projectiles only strike where the target *was*, not where it *will be*.
    </p>
    
    <h3 id="divergence">Hitscan vs. Projectile</h3>
    <ul>
      <li><strong>Hitscan (Raycast):</strong> Models instantaneous light. The moment the trigger is pulled, a ray is cast, and a hit is registered. No prediction is required.</li>
      <li><strong>Projectile (Ballistics):</strong> Models physical objects with travel time. The AI must "lead" the target based on relative velocities and environmental forces.</li>
    </ul>

    <h2 id="math">📐 Foundational Kinematics</h2>
    <div class="formula-block">
      <code>Time = Distance / BulletSpeed</code><br />
      <code>PredictedPosition = TargetPosition + (TargetVelocity * Time)</code>
    </div>

    <h3 id="complications">Complications in AI</h3>
    <p>
      Simple linear algebra fails when environment variables like <strong>Gravity</strong> and <strong>Drag</strong> are added.
    </p>
    <ul>
      <li><strong>Gravity:</strong> Pulls projectiles downward in a parabolic arc. The AI must aim higher to compensate.</li>
      <li><strong>Atmospheric Drag:</strong> Decelerates the bullet non-linearly. Because the speed changes, the <code>Time</code> to intercept changes, creating a circular dependency.</li>
    </ul>

    <div class="game-cases">
      <article>
        <h4>RTS: Anti-Air (Command & Conquer)</h4>
        <p>
          SAM sites must calculate the intercept point for fast-moving aircraft. A slow missile speed requires a massive lead angle.
        </p>
      </article>

      <article>
        <h4>Tactical: Sniper Drop (Battlefield 2042)</h4>
        <p>
          Players and AI must account for visual bullet drop over 500m. This uses <strong>Gravity Compensation</strong> math to adjust the scope's zeroing.
        </p>
      </article>

      <article>
        <h4>The Iterative Loop</h4>
        <p>
          Advanced AI uses "Guess, Try, Refine" loops. It guesses an intercept time, simulates a bullet path, measures the error, and adjusts the aim until the intercept is within a tolerance threshold.
        </p>
      </article>
    </div>
  </div>
</section>

<style>
  header { margin-bottom: 2rem; }
  h1 { font-size: 1.8rem; color: var(--accent); margin: 0; font-weight: 800; }
  .tagline { font-size: 0.85rem; color: var(--text-secondary); margin: 0.2rem 0; }

  .md-body { line-height: 1.6; font-size: 0.95rem; color: var(--text-secondary); }

  .md-body h2 {
    font-size: 1.1rem; color: var(--text-primary);
    margin: 2rem 0 1rem 0; border-bottom: 1px solid var(--panel-border);
    padding-bottom: 0.5rem;
  }

  .md-body h3 { font-size: 1rem; color: var(--text-primary); margin: 1.5rem 0 0.5rem 0; }

  .md-body p { margin-bottom: 1rem; }
  .md-body p strong { color: var(--text-primary); font-weight: 600; }

  .formula-block {
    background: #f1f5f9; padding: 1rem; border-radius: 8px;
    margin: 1rem 0; font-family: monospace; color: var(--accent);
    border: 1px solid var(--panel-border); font-size: 0.85rem;
    text-align: center;
  }

  .game-cases article {
    margin-top: 1rem; border-left: 2px solid var(--accent);
    padding: 0.8rem; background: rgba(59, 130, 246, 0.05);
    border-radius: 0 4px 4px 0; margin-bottom: 1rem;
  }

  .game-cases h4 {
    margin: 0 0 0.4rem 0; color: var(--accent);
    font-size: 0.85rem; text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .game-cases p { margin: 0; font-size: 0.82rem; line-height: 1.4; }

  ul { padding-left: 1.2rem; margin: 1rem 0; }
  li { margin-bottom: 0.6rem; font-size: 0.9rem; }
</style>
