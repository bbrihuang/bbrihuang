import { terminalScript } from "../data/terminal.js";

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
    // Wait for the box to finish fading in, so the first command is seen.
    await sleep(900);
    for (const step of terminalScript) {
        const line = addLine(output, "terminal-command", "");
        const typed = document.createElement("span");
        typed.className = "typing";
        line.appendChild(typed);

        for (const character of step.command) {
            typed.textContent += character;
            output.scrollTop = output.scrollHeight;
            await sleep(35 + Math.random() * 50);
        }

        typed.classList.remove("typing");
        await sleep(200);
        addLine(output, "terminal-reply", step.reply);
        await sleep(450);
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
    output.replaceChildren();

    // Typing is a first-visit touch; coming back to Home shouldn't mean waiting again.
    let seen = false;
    try {
        seen = sessionStorage.getItem("terminal-seen") === "1";
        sessionStorage.setItem("terminal-seen", "1");
    } catch {}

    if (reduceMotion.matches || seen) {
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
            // On narrow screens each role opens under its own button, so keep that button in view.
            if (window.matchMedia("(max-width: 800px)").matches) tab.scrollIntoView({ block: "start" });
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
            document.querySelector("#projects").classList.add("is-filtered");
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

// Mail icon in the top bar: click to copy the email, "Copied!" shows for a
// moment. If the browser won't allow copying, open the mail app instead.
function setUpCopyEmail() {
    document.querySelectorAll("[data-copy]").forEach((button) => {
        const bubble = button.querySelector(".copy-bubble");
        let timer = 0;
        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
            } catch {
                window.location.href = `mailto:${button.dataset.copy}`;
                return;
            }
            bubble.textContent = "Copied!";
            button.classList.add("is-copied");
            clearTimeout(timer);
            timer = setTimeout(() => {
                bubble.textContent = "";
                button.classList.remove("is-copied");
            }, 1600);
        });
    });
}

// Involvement: each club's photos take turns, one card at a
// time so they don't all change together. Hovering a card holds its photo.
let clubTimers = [];

function setUpClubPhotos() {
    clubTimers.forEach(clearInterval);
    clubTimers = [];
    if (reduceMotion.matches) return;

    document.querySelectorAll(".club-cover").forEach((cover, index) => {
        const photos = [...cover.querySelectorAll(".club-photo")];
        if (photos.length < 2) return;
        let current = 0;
        setTimeout(() => {
            clubTimers.push(setInterval(() => {
                if (cover.matches(":hover")) return;
                photos[current].classList.remove("is-active");
                current = (current + 1) % photos.length;
                photos[current].classList.add("is-active");
            }, 3500));
        }, index * 900);
    });
}

// Top bar on Home: mark the section at the top of the screen. Sections with no
// link of their own, like the hero, count as Home. A section that was clicked
// stays marked until the visitor scrolls, because short sections near the end
// of the page can't reach the top.
let sectionSpy;

function setUpSectionSpy() {
    sectionSpy?.abort();
    if (window.location.pathname !== "/") return;
    sectionSpy = new AbortController();
    const { signal } = sectionSpy;

    const links = [...document.querySelectorAll(".site-header nav ul a")];
    const sections = [...document.querySelectorAll("main > section")];
    const linkFor = (hash) => links.find((link) => link.getAttribute("href") === `/${hash}`);
    const mark = (active) => links.forEach((link) => (link === active ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current")));
    // No hash means nothing is held; linkFor("") would match the Home link and freeze the bar.
    let held = window.location.hash ? linkFor(window.location.hash) : undefined;

    function update() {
        if (held) return mark(held);
        const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        const section = atEnd ? sections.at(-1) : sections.findLast((item) => item.getBoundingClientRect().top <= 120);
        mark(section && linkFor(`#${section.id}`) || links[0]);
    }

    links.forEach((link) => link.addEventListener("click", (event) => {
        held = link === links[0] ? undefined : link;
        if (!held) {
            // Already on Home: glide to the top rather than reloading the hero.
            event.preventDefault();
            history.replaceState(null, "", "/");
            window.scrollTo({ top: 0 });
        }
        update();
    }, { signal }));
    ["wheel", "touchmove", "keydown", "pointerdown"].forEach((type) => {
        window.addEventListener(type, () => { held = undefined; }, { signal, passive: true });
    });
    window.addEventListener("scroll", update, { signal, passive: true });
    update();
}

// Section entrances. An inline script in the layout adds .js-reveal to <html>
// before the page paints, which holds each section in its starting pose; a
// section gets .is-in when it scrolls into view (straight away if it's
// already on screen) and its CSS entrance plays. Without JavaScript the class
// is never added and everything shows as normal.
const revealGroups = "main > section:not(.hero), .page-header, .case-header, .case-rail, .case-body > *";

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
    setUpCopyEmail();
    setUpClubPhotos();
    setUpSectionSpy();
    // Hiding the other Experience panels shrinks the page, so coming from another
    // page the section is no longer where the browser scrolled to. Land on it again.
    if (window.location.hash) {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "instant" });
    }
});
