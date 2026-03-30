/**
 * Predictive Physics Engine - COS30002 (Refactored for Svelte 5 Reactivity)
 * Implements Hitscan, Simple Kinematics, and Iterative Ballistics with Drag.
 */

export class BallisticsSim {
  constructor(stats) {
    this.stats = stats; // Reference to reactive Svelte 5 state
    this.reset();
  }

  reset() {
    this.turret = { x: 0.1, y: 0.5, angle: 0 };
    this.target = { 
      x: 0.8, y: 0.5, 
      baseY: 0.5, 
      velocity: { x: 0, y: 0 },
      time: 0 
    };
    
    this.projectiles = []; 
    this.prediction = { x: 0, y: 0, active: false, time: 0 };
    this.fixedDelta = 1 / 60;
  }

  update(params, canvasSize) {
    const { targetSpeed, muzzleVelocity, gravity, dragK, mode } = params;

    // 1. Update Target
    this.target.time += this.fixedDelta;
    this.target.y = this.target.baseY + Math.sin(this.target.time * targetSpeed) * 0.3;
    this.target.velocity.y = Math.cos(this.target.time * targetSpeed) * 0.3 * targetSpeed;

    // 2. Perform Prediction
    this.predictIntercept(params, canvasSize);

    // 3. Update Projectiles
    const targetPxX = this.target.x * canvasSize.width;
    const targetPxY = this.target.y * canvasSize.height;

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        
        if (p.type === 'projectile') {
            p.vy += gravity * this.fixedDelta;
            
            if (p.hasDrag) {
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const dragForce = dragK * speed;
                p.vx -= (p.vx / (speed || 1)) * dragForce * this.fixedDelta;
                p.vy -= (p.vy / (speed || 1)) * dragForce * this.fixedDelta;
            }

            p.x += p.vx * this.fixedDelta;
            p.y += p.vy * this.fixedDelta;

            const dist = Math.sqrt(Math.pow(p.x - targetPxX, 2) + Math.pow(p.y - targetPxY, 2));
            if (dist < 30) {
                this.stats.hits++;
                this.projectiles.splice(i, 1);
                continue;
            }
        } else if (p.type === 'laser') {
            if (p.life === 9) {
                const distToLine = this.pointLineDist(targetPxX, targetPxY, p.x1, p.y1, p.x2, p.y2);
                if (distToLine < 35) {
                    this.stats.hits++;
                } else {
                    this.stats.misses++;
                }
            }
            p.life--;
        }

        if (p.x > canvasSize.width + 100 || p.x < -100 || p.y > canvasSize.height + 100 || p.y < -100) {
            if (p.type === 'projectile') this.stats.misses++;
            this.projectiles.splice(i, 1);
        }
    }
  }

  pointLineDist(px, py, x1, y1, x2, y2) {
    const A = px - x1; const B = py - y1;
    const C = x2 - x1; const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    return Math.sqrt(Math.pow(px - xx, 2) + Math.pow(py - yy, 2));
  }

  predictIntercept(params, canvasSize) {
    const { mode, muzzleVelocity, gravity, dragK } = params;
    const turX = this.turret.x * canvasSize.width;
    const turY = this.turret.y * canvasSize.height;
    const tx = this.target.x * canvasSize.width;
    const ty = this.target.y * canvasSize.height;

    const dx = tx - turX;
    const dy = ty - turY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    let t = dist / muzzleVelocity;

    if (mode === 'advanced') {
        for (let j = 0; j < 15; j++) {
            let traveledDist = 0; let v = muzzleVelocity; let curT = 0; let step = 0.016;
            while (curT < t) { traveledDist += v * step; v -= dragK * v * step; curT += step; }
            const error = dist - traveledDist;
            this.stats.lastError = error;
            t += error / muzzleVelocity;
        }
    }

    const pyInter = ty + (this.target.velocity.y * canvasSize.height * t);
    const drop = 0.5 * gravity * t * t;
    
    this.prediction.x = tx;
    this.prediction.y = pyInter;
    this.prediction.time = t;
    this.prediction.active = true;

    if (mode === 'hitscan') {
        this.turret.angle = Math.atan2(ty - turY, tx - turX);
    } else {
        // Aim at Intercept Point minus Drop compensation
        this.turret.angle = Math.atan2(pyInter - drop - turY, tx - turX);
    }
  }

  fire(params, canvasSize) {
    const { mode, muzzleVelocity } = params;
    const turX = this.turret.x * canvasSize.width;
    const turY = this.turret.y * canvasSize.height;
    this.stats.totalFires++;

    if (mode === 'hitscan') {
        const angle = this.turret.angle;
        this.projectiles.push({ 
            x1: turX, y1: turY, 
            x2: turX + Math.cos(angle) * 2000, 
            y2: turY + Math.sin(angle) * 2000, 
            type: 'laser', life: 10 
        });
    } else {
        this.projectiles.push({
            x: turX, y: turY,
            vx: Math.cos(this.turret.angle) * muzzleVelocity,
            vy: Math.sin(this.turret.angle) * muzzleVelocity,
            type: 'projectile',
            hasDrag: mode === 'advanced'
        });
    }
  }
}
