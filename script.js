const shapes = document.querySelectorAll(".shape");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reduceMotion.matches) {
    window.addEventListener("mousemove", (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        shapes.forEach((shape) => {
            const depth = Number(shape.dataset.depth);
            shape.style.setProperty("--x", `${x * depth}px`);
            shape.style.setProperty("--y", `${y * depth}px`);
        });
    });
}
