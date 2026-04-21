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
    
    <div class="rule-card card-orange">
      <div class="rule-icon icon-orange">⚡</div>
      <div class="rule-body">
        <h3 class="color-orange" id="divergence">Hitscan vs. Projectile</h3>
        <ul>
          <li><strong>Hitscan (Raycast):</strong> Models instantaneous light. The moment the trigger is pulled, a ray is cast, and a hit is registered. No prediction is required.</li>
          <li><strong>Projectile (Ballistics):</strong> Models physical objects with travel time. The AI must "lead" the target based on relative velocities and environmental forces.</li>
        </ul>
      </div>
    </div>

    <div class="rule-card card-blue">
      <div class="rule-icon icon-blue">📐</div>
      <div class="rule-body">
        <h3 class="color-blue" id="math">Foundational Kinematics</h3>
        <div class="formula-block">
          <code>Time = Distance / BulletSpeed</code><br />
          <code>PredictedPosition = TargetPosition + (TargetVelocity * Time)</code>
        </div>
        <ul class="formula-desc">
          <li><strong>Distance</strong>: The magnitude of the vector from the shooter to the target</li>
          <li><strong>Time</strong>: The zeroeth-order prediction of how long the bullet takes to arrive</li>
          <li><strong>TargetVelocity * Time</strong>: The estimated displacement of the target during flight</li>
        </ul>
      </div>
    </div>

    <div class="rule-card card-purple">
      <div class="rule-icon icon-purple">⚠️</div>
      <div class="rule-body">
        <h3 class="color-purple" id="complications">Complications in AI</h3>
        <p>
          Simple linear algebra fails when environment variables like <strong>Gravity</strong> and <strong>Drag</strong> are added.
        </p>
        <ul>
          <li><strong>Gravity:</strong> Pulls projectiles downward in a parabolic arc. The AI must aim higher to compensate.</li>
          <li><strong>Atmospheric Drag:</strong> Decelerates the bullet non-linearly. Because the speed changes, the <code>Time</code> to intercept changes, creating a circular dependency.</li>
        </ul>
      </div>
    </div>

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
</style>
