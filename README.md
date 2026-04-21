# Predictive Physics & Kinematic Modelling (COS30002)

An interactive, pedagogical simulator for visualizing **Projectile Ballistics** and **Predictive Targeting** in Game AI. This module demonstrates the mathematical transition from instantaneous hitscan models to complex, non-linear physical interactions involving gravity and atmospheric drag.

## 🚀 Key Features

- **Svelte 5 + HTML5 Canvas:** High-performance rendering engine with optimized particle trails and fixed-timestep physics.
- **Three Core Targeting Modes:**
    - **Mode A: Hitscan (Raycast):** Instantaneous "Laser" targeting.
    - **Mode B: Simple Kinematics:** Newtonian intercept math accounting for velocity and gravity compensation.
    - **Mode C: Advanced Ballistics:** Iterative "Guess, Try, Refine" loop to solve non-linear drag deceleration.
- **Interactive Environment:** Real-time sliders for Muzzle Velocity, Gravity, Target Speed, and Air Density.
- **Visual Pedagogy:** Dashed prediction lines, intercept markers, and crosshair-tracked targets.
- **Responsive Layout:** Drag-resizable sidebar with "Textbook" content and industry case studies.

## 📐 Mathematical Models

### Basic Linear Intercept
$$Time = \frac{Distance}{BulletSpeed}$$
$$PredictedPosition = TargetPosition + (TargetVelocity \times Time)$$

### Gravity Compensation
$$AimHeight = TargetHeight + \frac{1}{2} g \times Time^2$$

### Iterative Ballistics (Drag)
The AI guesses a time-to-intercept, calculates the bullet's deceleration, and refines its estimate until the error falls within a negligible threshold.

## 💻 Tech Stack

- **Framework:** [Svelte 5](https://svelte.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Rendering:** HTML5 Canvas API
- **Styling:** CSS variables via Master Template (`app.css`)

## 👨‍🏫 Local Development & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Dev Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production (Canvas RCE Deployment):**
   ```bash
   npm run build
   ```

## 📄 License

This repository is licensed under the terms described in the [LICENSE](./LICENSE) file. 

---
_Made with ❤️ for Swinburne — COS30002 Artificial Intelligence for Games — By E. Ketterer_
