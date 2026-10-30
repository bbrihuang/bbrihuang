import { layoutFor } from "./shape-layouts.js";

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

// The background stays in place between pages, so each new page moves its
// shapes to that page's layout and the CSS transition eases them there.
function placeShapes() {
    const layout = layoutFor(window.location.pathname);
    document.querySelectorAll(".shape-pos").forEach((shape) => {
        const place = layout[shape.dataset.shape];
        shape.style.setProperty("--left", `${place.left}vw`);
        shape.style.setProperty("--top", `${place.top}vh`);
        shape.style.setProperty("--r", `${place.r}deg`);
        shape.style.setProperty("--s", place.s);
    });
}

const terminalScript = [
    { command: "whoami", reply: "Brian Huang | Computer Engineering at Boston University" },
    { command: "cat interests.txt", reply: "robotics | embedded systems | AI inference" },
    { command: "echo $STATUS", reply: "open to summer 2027 internships" },
];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function addLine(output, className, text) {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    return line;
}

async function runTerminal(output) {
    for (const step of terminalScript) {
        const line = addLine(output, "terminal-command", "");
        const typed = document.createElement("span");
        typed.className = "typing";
        line.appendChild(typed);

        for (const character of step.command) {
            typed.textContent += character;
            output.scrollTop = output.scrollHeight;
            await sleep(70);
        }

        typed.classList.remove("typing");
        await sleep(300);
        addLine(output, "terminal-reply", step.reply);
        await sleep(600);
    }
}

function showTerminalAtOnce(output) {
    for (const step of terminalScript) {
        addLine(output, "terminal-command", step.command);
        addLine(output, "terminal-reply", step.reply);
    }
}

function startTerminal() {
    const output = document.querySelector("#terminal-output");
    if (!output) return;

    if (reduceMotion.matches) {
        showTerminalAtOnce(output);
    } else {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                runTerminal(output);
            }
        });
        observer.observe(output);
    }
}

// Experience: pick a role on the left to show its details on the right.
// Up and down arrows move between roles.
function setUpJobTabs() {
    const tabs = [...document.querySelectorAll(".job-tab")];
    if (!tabs.length) return;

    function select(tab, focus) {
        tabs.forEach((other) => {
            const selected = other === tab;
            other.setAttribute("aria-selected", String(selected));
            other.tabIndex = selected ? 0 : -1;
            document.getElementById(other.getAttribute("aria-controls")).hidden = !selected;
        });
        if (focus) tab.focus();
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            select(tab, false);
            // Stacked on narrow screens, so bring the details into view.
            if (window.matchMedia("(max-width: 800px)").matches) {
                document.getElementById(tab.getAttribute("aria-controls")).scrollIntoView({ block: "start" });
            }
        });
        tab.addEventListener("keydown", (event) => {
            const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
            if (!step) return;
            event.preventDefault();
            select(tabs[(index + step + tabs.length) % tabs.length], true);
        });
    });

    select(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? tabs[0], false);
}

// Projects: show only software or hardware projects.
function setUpProjectFilters() {
    const group = document.querySelector(".filters");
    if (!group) return;
    group.hidden = false;

    const buttons = [...group.querySelectorAll("button")];
    const slots = [...document.querySelectorAll(".project-slot")];
    const count = document.querySelector(".project-count");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
            let shown = 0;
            slots.forEach((slot) => {
                slot.hidden = filter !== "all" && !slot.dataset.areas.split(" ").includes(filter);
                if (!slot.hidden) shown += 1;
            });
            count.textContent = `${shown} project${shown === 1 ? "" : "s"}`;
        });
    });
}

// Section entrances. An inline script in the layout adds .js-reveal to <html>
// before the page paints, which holds each section in its starting pose; a
// section gets .is-in when it scrolls into view (straight away if it's
// already on screen) and its CSS entrance plays. Without JavaScript the class
// is never added and everything shows as normal.
const revealGroups = "main > section:not(.hero), .page-header, .case-header, .case-body > *";

function setUpReveal() {
    const root = document.documentElement;
    root.classList.add("js-reveal");
    window.__revealReady = true;
    const groups = [...document.querySelectorAll(revealGroups)];
    if (!("IntersectionObserver" in window)) {
        groups.forEach((group) => group.classList.add("is-in"));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -12% 0px" });
    groups.forEach((group) => observer.observe(group));
}

// The new page's <html> replaces the old one's classes on navigation, so put
// the class back before the new page paints.
document.addEventListener("astro:after-swap", () => {
    document.documentElement.classList.add("js-reveal");
});

// Runs on the first load and after every page change.
document.addEventListener("astro:page-load", () => {
    placeShapes();
    startTerminal();
    setUpJobTabs();
    setUpProjectFilters();
    setUpReveal();
});
