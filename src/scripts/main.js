const shapes = document.querySelectorAll(".shape");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Shapes drift with the mouse, and deeper ones also slide up as you scroll.
// Updates wait for the next frame so a fast mouse doesn't restyle every event.
let mouseX = 0;
let mouseY = 0;
let frame = 0;

function moveShapes() {
    frame = 0;
    shapes.forEach((shape) => {
        const depth = Number(shape.dataset.depth);
        shape.style.setProperty("--x", `${mouseX * depth}px`);
        shape.style.setProperty("--y", `${mouseY * depth - window.scrollY * depth * 0.003}px`);
    });
}

function queueMove() {
    if (!frame) frame = requestAnimationFrame(moveShapes);
}

if (!reduceMotion.matches) {
    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
        queueMove();
    }, { passive: true });
    window.addEventListener("scroll", queueMove, { passive: true });
}

const terminalOutput = document.querySelector("#terminal-output");

const terminalScript = [
    { command: "whoami", reply: "Brian Huang | Computer Engineering at Boston University" },
    { command: "cat interests.txt", reply: "robotics | embedded systems | AI inference" },
    { command: "echo $STATUS", reply: "open to summer 2027 internships" },
];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function addLine(className, text) {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    terminalOutput.appendChild(line);
    return line;
}

async function runTerminal() {
    for (const step of terminalScript) {
        const line = addLine("terminal-command", "");
        const typed = document.createElement("span");
        typed.className = "typing";
        line.appendChild(typed);

        for (const character of step.command) {
            typed.textContent += character;
            await sleep(70);
        }

        typed.classList.remove("typing");
        await sleep(300);
        addLine("terminal-reply", step.reply);
        await sleep(600);
    }
}

function showTerminalAtOnce() {
    for (const step of terminalScript) {
        addLine("terminal-command", step.command);
        addLine("terminal-reply", step.reply);
    }
}

if (terminalOutput) {
    if (reduceMotion.matches) {
        showTerminalAtOnce();
    } else {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                runTerminal();
            }
        });
        observer.observe(terminalOutput);
    }
}
