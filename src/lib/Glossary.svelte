<script>
let {
	isOpen = $bindable(false),
	section = $bindable("root"),
	onClose,
} = $props();

const entries = [
	{
		id: "root",
		title: "Glossary: Physics & Targeting",
		body: "Predictive modelling is the art of anticipating a target s future position. Select a term below or from the simulator controls to dive into the mathematical and pedagogical background.",
	},
	{
		id: "mode",
		title: "Targeting Modes",
		body: "The AI uses different levels of predictive logic. Hitscan is instantaneous, Kinematics uses T=D/V math, and Advanced uses an iterative loop to solve for drag.",
	},
	{
		id: "speed",
		title: "Target Speed",
		body: "The angular velocity of the target periodic movement. Higher speeds demand greater lead angles and faster intercept calculations.",
	},
	{
		id: "velocity",
		title: "Muzzle Velocity",
		body: "The initial speed of the projectile. High muzzle velocity reduces time-to-intercept, making the prediction more robust against target velocity changes.",
	},
	{
		id: "gravity",
		title: "Gravity compensation",
		body: "Downward acceleration (9.8m/s²). The AI must calculate the Vertical Offset (Aim point) based on the square of the travel time.",
	},
	{
		id: "drag",
		title: "Iterative Drag Solving",
		body: "Atmospheric friction causes non-linear deceleration. AI must loop through guest-estimates (iterative refinement) to find the true intercept point.",
	},
	{
		id: "error",
		title: "Convergence Error",
		body: "The distance between the predicted intercept point and the actual location where the projectile would cross the targets plane. Small error values (<0.001) indicate a stable, accurate solution.",
	},
];

function handleClose() {
	isOpen = false;
	onClose?.();
}

function scrollToSection(id) {
	const el = document.getElementById(`glossary-${id}`);
	if (el) el.scrollIntoView({ behavior: "smooth" });
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
</style>
