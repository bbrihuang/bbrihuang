import { setUpSectionBuild } from "./section-build.js";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// The orange corner switches light and dark. The new theme wipes in from the
// corner toward the bottom left; without view transitions, or for people who ask
// for less motion, it switches at once. The choice lasts for this visit; every new visit opens light.
function setUpThemeCorner() {
    const corner = document.querySelector(".corner");
    if (!corner) return;
    const isDark = () => root.dataset.theme === "dark";
    const label = () => corner.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
    const flip = () => {
        root.dataset.theme = isDark() ? "light" : "dark";
        try {
            sessionStorage.setItem("theme", root.dataset.theme);
        } catch {}
        label();
        // Apply the new colours now, while fades are still off.
        void document.body.offsetWidth;
    };
    corner.addEventListener("click", async () => {
        // While the theme changes, colour fades are off (see html.peeling in global.css),
        // so nothing fades from the old theme's colours after the switch.
        root.classList.add("peeling");
        if (!document.startViewTransition || reduceMotion.matches) {
            flip();
            return root.classList.remove("peeling");
        }
        try {
            const transition = document.startViewTransition(flip);
            // The browser cancels the animation if the tab is hidden; the theme still changes.
            transition.ready.catch(() => {});
            await transition.finished;
        } finally {
            root.classList.remove("peeling");
        }
    });
    label();
}

// Experience: each role is a button that opens its details (one at a time).
// Up and down arrows move between the buttons.
function setUpJobTabs() {
    const tabs = [...document.querySelectorAll(".job-tab")];
    if (!tabs.length) return;

    function select(tab) {
        tabs.forEach((other) => {
            const open = other === tab;
            other.setAttribute("aria-expanded", String(open));
            document.getElementById(other.getAttribute("aria-controls")).hidden = !open;
        });
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            select(tab);
            // On narrow screens the details open under the button, so keep that button in view.
            if (window.matchMedia("(max-width: 860px)").matches) tab.scrollIntoView({ block: "nearest" });
        });
        tab.addEventListener("keydown", (event) => {
            const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
            if (!step) return;
            event.preventDefault();
            tabs[(index + step + tabs.length) % tabs.length].focus();
        });
    });

    select(tabs.find((tab) => tab.getAttribute("aria-expanded") === "true") ?? tabs[0]);
}

// Projects: filter by topic tags (any selected) and a range of years.
function setUpProjectFilters() {
    const panel = document.querySelector(".filter-panel");
    if (!panel) return;
    panel.hidden = false;

    const tags = [...panel.querySelectorAll(".filter-tag")];
    const from = panel.querySelector("#year-from");
    const to = panel.querySelector("#year-to");
    const clear = panel.querySelector(".filter-clear");
    const count = panel.querySelector(".project-count");
    const empty = document.querySelector(".projects-empty");
    const grid = document.querySelector("#projects .project-grid");
    const slots = [...grid.querySelectorAll(".project-slot")];
    const full = { from: Number(from.options[0].value), to: Number(to.options[to.options.length - 1].value) };

    function apply() {
        const topics = tags.filter((tag) => tag.getAttribute("aria-pressed") === "true").map((tag) => tag.dataset.topic);
        const low = Number(from.value);
        const high = Number(to.value);
        const narrowed = low > full.from || high < full.to;
        let shown = 0;
        slots.forEach((slot) => {
            const topicMatch = !topics.length || slot.dataset.topics.split(" ").some((topic) => topics.includes(topic));
            // A project with no year only shows while the whole range is selected.
            const yearMatch = !narrowed || (slot.dataset.from && Number(slot.dataset.from) <= high && Number(slot.dataset.to) >= low);
            slot.hidden = !(topicMatch && yearMatch);
            if (!slot.hidden) {
                slot.style.setProperty("--k", shown);
                shown += 1;
            }
        });
        count.textContent = `${shown} project${shown === 1 ? "" : "s"}`;
        clear.hidden = !topics.length && !narrowed;
        empty.hidden = shown > 0;
        // Replay the rise on every card that is showing, so the ones that stay answer too.
        grid.classList.remove("is-switching");
        void grid.offsetWidth;
        grid.classList.add("is-switching");
    }

    tags.forEach((tag) => tag.addEventListener("click", () => {
        tag.setAttribute("aria-pressed", String(tag.getAttribute("aria-pressed") !== "true"));
        apply();
    }));
    from.addEventListener("change", () => {
        if (Number(from.value) > Number(to.value)) to.value = from.value;
        apply();
    });
    to.addEventListener("change", () => {
        if (Number(to.value) < Number(from.value)) from.value = to.value;
        apply();
    });
    clear.addEventListener("click", () => {
        tags.forEach((tag) => tag.setAttribute("aria-pressed", "false"));
        from.value = full.from;
        to.value = full.to;
        apply();
    });
}

// The hot-fire clip plays once on its own when its tile scrolls into view, and again when you point at it, then returns to its still.
function setUpClips() {
    if (reduceMotion.matches) return;
    const seen = "IntersectionObserver" in window && new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            seen.unobserve(entry.target);
            entry.target.querySelector("video").play().catch(() => {});
        });
    }, { threshold: 0.6 });
    document.querySelectorAll(".tile video").forEach((video) => {
        const tile = video.closest(".tile");
        tile.addEventListener("mouseenter", () => video.play().catch(() => {}));
        video.addEventListener("ended", () => video.load());
        if (seen) seen.observe(tile);
    });
}

// Hero builder: Bill Durr walks the gradient line, laying it behind himself, and under
// each word he hops; the word pops in as he bumps it. Then he assembles a portal to his elevator.
// With reduced motion the name is just there and Bill waits in the elevator.
function setUpBuilder() {
    const hero = document.querySelector(".hero");
    const builder = hero?.querySelector(".builder");
    if (!builder) return;
    if (reduceMotion.matches || !root.classList.contains("awaiting-bill")) {
        finishName();
        hero.classList.add("bill-gone");
        return;
    }
    const rule = hero.querySelector(".bb-grad-rule");
    const portal = hero.querySelector(".builder-portal");
    const ground = builder.parentElement;
    const letters = [...hero.querySelectorAll(".letter")];
    const words = [letters.slice(0, 5), letters.slice(5)];
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const speed = 0.8; // pixels per millisecond
    let run = 0;
    let x = 0;

    function finishName() {
        hero.classList.add("built");
        root.classList.remove("awaiting-build");
        try { sessionStorage.setItem("bill-built-hero", "1"); } catch {}
    }

    function reachElevator() {
        hero.classList.add("bill-gone");
        root.classList.remove("awaiting-bill");
        window.removeEventListener("scroll", skipWhenLeavingHero);
        reduceMotion.removeEventListener("change", skipForReducedMotion);
        document.dispatchEvent(new Event("bill-arrived"));
    }

    function skipIntro() {
        run += 1;
        [builder, rule, portal, ...letters].forEach((element) => {
            element.getAnimations().forEach((animation) => animation.cancel());
        });
        portal.hidden = true;
        finishName();
        reachElevator();
    }

    function skipWhenLeavingHero() {
        if (window.scrollY > 24 && ground.getBoundingClientRect().bottom < window.innerHeight * 0.3) skipIntro();
    }

    function skipForReducedMotion() {
        if (reduceMotion.matches) skipIntro();
    }

    async function build() {
        const id = ++run;
        const current = () => id === run;
        const width = ground.clientWidth;
        const size = builder.offsetWidth;
        const origin = ground.getBoundingClientRect().left;
        const middleOf = (box) => (box.left + box.right) / 2 - origin - size / 2;

        // Walk to `to`, laying the line up to where Bill is.
        async function walkTo(to) {
            const duration = Math.abs(to - x) / speed;
            const timing = { duration, easing: "linear", fill: "forwards" };
            builder.animate([{ transform: `translateX(${x}px)` }, { transform: `translateX(${to}px)` }], timing);
            rule.animate([{ clipPath: `inset(0 ${width - x}px 0 0)` }, { clipPath: `inset(0 ${width - to}px 0 0)` }], timing);
            const steps = setInterval(() => (builder.dataset.pose = builder.dataset.pose === "walk-b" ? "walk-a" : "walk-b"), 110);
            await wait(duration);
            clearInterval(steps);
            builder.dataset.pose = "stand";
            x = to;
        }

        // A short pop jump: a beat to wind up, a quick hop that bumps the word, a beat after landing.
        async function jump(word) {
            await wait(160);
            if (!current()) return;
            const lift = ground.clientHeight - builder.offsetHeight + 6;
            builder.dataset.pose = "up";
            builder.animate([
                { transform: `translateX(${x}px) translateY(0)`, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
                { transform: `translateX(${x}px) translateY(-${lift}px)`, offset: 0.4, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
                { transform: `translateX(${x}px) translateY(0)` },
            ], { duration: 300, fill: "forwards" });
            await wait(120);
            if (!current()) return;
            popIn(word);
            await wait(180);
            builder.dataset.pose = "stand";
            await wait(180);
        }

        // The word pops in letter by letter: each one fills and pops.
        function popIn(word) {
            word.forEach((letter, index) => {
                setTimeout(() => letter.classList.add("on"), index * 35);
                // From small and hidden, a swell past full size, then settle.
                letter.animate([
                    { transform: "translateY(0.1em) scale(0.6)" },
                    { transform: "translateY(-0.04em) scale(1.1)", offset: 0.55 },
                    { transform: "translateY(0) scale(1)" },
                ], { duration: 420, delay: index * 35, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" });
            });
        }

        async function enterPortal() {
            builder.dataset.pose = "up";
            await wait(100);
            if (!current()) return;
            builder.dataset.pose = "down";
            portal.hidden = false;
            await wait(220);
            if (!current()) return;
            builder.dataset.pose = "up";
            await wait(100);
            if (!current()) return;
            builder.dataset.pose = "down";
            portal.dataset.active = "";
            await wait(110);
            if (!current()) return;

            const opening = portal.offsetLeft + (portal.offsetWidth - size) / 2;
            builder.dataset.pose = "walk-b";
            const entry = builder.animate([
                { transform: `translateX(${x}px)`, opacity: 1 },
                { opacity: 1, offset: 0.35 },
                { transform: `translateX(${opening}px)`, opacity: 0 },
            ], { duration: 260, easing: "linear", fill: "forwards" });
            await wait(110);
            if (current()) builder.dataset.pose = "walk-a";
            await entry.finished.catch(() => {});
        }

        for (const word of words) {
            const box = { left: word[0].getBoundingClientRect().left, right: word.at(-1).getBoundingClientRect().right };
            await walkTo(middleOf(box));
            if (!current()) return;
            await jump(word);
            if (!current()) return;
        }
        await walkTo(width - size - 24);
        if (!current()) return;
        rule.getAnimations().forEach((animation) => animation.cancel());
        finishName();

        await enterPortal();
        if (!current()) return;
        document.querySelector(".car")?.classList.add("portal-arrival");
        reachElevator();
        await portal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220 }).finished.catch(() => {});
        portal.hidden = true;
    }

    window.addEventListener("scroll", skipWhenLeavingHero, { passive: true });
    reduceMotion.addEventListener("change", skipForReducedMotion);
    build();
    skipWhenLeavingHero();
}

// The car follows the home sections and rides into the basement for dedicated pages.
function setUpElevator() {
    const elevator = document.querySelector(".elevator");
    if (!elevator) return;
    const car = elevator.querySelector(".car");
    const panel = elevator.querySelector(".where-to");
    const tip = elevator.querySelector(".elevator-tip");
    const stops = [...panel.querySelectorAll("a[data-floor]")];
    const floors = stops.filter((link) => link.dataset.section);
    const basement = stops.slice(floors.length);
    const onHome = location.pathname === "/";
    const sections = floors.map((link) => document.getElementById(link.dataset.section));
    const headings = sections.map((section) => section?.querySelector(".bb-section-word"));
    const initial = Number(elevator.style.getPropertyValue("--at"));
    let current = initial;
    let riding = false;
    let parkedAt = null;
    let ride = 0;
    let leaving = false;
    let tipTimer;
    let switchedTheme = false;
    const labelled = window.matchMedia("(min-width: 1640px) and (min-height: 461px)");

    // Bill's theme tip, for a few seconds or until the visitor scrolls.
    function showTip() {
        tip.hidden = false;
        window.addEventListener("scroll", hideTip, { once: true, passive: true });
        tipTimer = setTimeout(hideTip, 3500);
    }

    function arriveAt(floor) {
        current = floor;
        elevator.style.setProperty("--at", floor);
        elevator.toggleAttribute("data-basement", floor >= floors.length);
        stops.forEach((link, index) => {
            if (index === floor) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }

    function waitForCar() {
        return Promise.allSettled(car.getAnimations().map((animation) => animation.finished));
    }

    function plainClick(event) {
        return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    }

    function floorFor(url) {
        if (url.pathname === "/") {
            return Math.max(0, floors.findIndex((link) => url.hash === `#${link.dataset.section}`));
        }
        if (url.pathname.startsWith("/certifications/")) return floors.findIndex((link) => link.dataset.section === "skills");
        const stop = basement.find((link) => url.pathname.startsWith(link.pathname) || url.pathname === link.pathname.slice(0, -1));
        return stop ? Number(stop.dataset.floor) : undefined;
    }

    function open(show) {
        hideTip();
        panel.hidden = !show;
        car.setAttribute("aria-expanded", String(show));
        if (show) (stops.find((link) => link.hasAttribute("aria-current")) ?? stops[0]).focus();
    }
    car.addEventListener("click", () => {
        if (leaving) return;
        // Wide screens name every floor beside the shaft, so there is no list to open.
        if (!labelled.matches) open(panel.hidden);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        hideTip();
        if (!panel.hidden) {
            open(false);
            car.focus();
        }
    });
    document.addEventListener("click", (event) => !panel.hidden && !elevator.contains(event.target) && open(false));

    function hideTip() {
        clearTimeout(tipTimer);
        tip.hidden = true;
        window.removeEventListener("scroll", hideTip);
    }

    document.querySelector(".corner")?.addEventListener("click", () => {
        switchedTheme = true;
        tip.hidden = true;
    });

    document.addEventListener("bill-arrived", () => {
        if (window.scrollY > 24 || !panel.hidden) return;
        if (!switchedTheme) showTip();
    });

    function follow() {
        if (riding || leaving || (parkedAt !== null && Math.abs(window.scrollY - parkedAt) <= 2)) return;
        parkedAt = null;
        const scrolled = window.scrollY > 8;
        const atEnd = scrolled && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        let floor = 0;
        if (scrolled) {
            headings.forEach((heading, index) => {
                if (heading && heading.getBoundingClientRect().top <= window.innerHeight * 0.85) floor = index;
            });
        }
        if (atEnd) floor = sections.length - 1;
        if (floor !== current) arriveAt(floor);
    }

    document.addEventListener("click", async (event) => {
        if (!plainClick(event)) return;
        const link = event.target.closest("a[href]");
        if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
        const url = new URL(link.href);
        if (url.origin !== location.origin || url.pathname === location.pathname) return;
        const floor = floorFor(url);
        if (floor === undefined) return;
        if (reduceMotion.matches) return;
        event.preventDefault();
        if (leaving) return;
        const trip = ++ride;
        leaving = true;
        open(false);
        arriveAt(floor);
        await waitForCar();
        if (trip === ride) location.assign(url.href);
    });

    window.addEventListener("pagehide", () => { ride += 1; });

    // A page restored from the back-forward cache still has the car's departure position.
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            leaving = riding = false;
            parkedAt = null;
        }
        if (onHome) follow();
        else if (event.persisted) arriveAt(initial);
    });

    // Update the car's floor before the builder checks whether a heading needs work.
    if (onHome) window.addEventListener("scroll", follow, { passive: true });
    const sectionBuild = setUpSectionBuild({
        car,
        reduceMotion,
        // At the Lobby, Bill's next job is About, which is already on screen under the name.
        getSection: onHome ? () => sections[current === 0 ? 1 : current] : undefined,
        canBuild: () => !riding && !leaving,
    });

    if (!onHome) return;

    function floorScrollY(floor) {
        if (floor === 0) return 0;
        const top = window.scrollY + sections[floor].getBoundingClientRect().top;
        const bottom = Math.max(0, root.scrollHeight - window.innerHeight);
        return Math.min(top, bottom);
    }

    function scrollToFloor(floor) {
        const behavior = reduceMotion.matches ? "instant" : "smooth";
        const top = floorScrollY(floor);
        const move = () => window.scrollTo({ top, behavior });
        if (reduceMotion.matches || Math.abs(window.scrollY - top) < 1) return move();

        return new Promise((resolve) => {
            const fallback = setTimeout(done, 1000);
            function done() {
                clearTimeout(fallback);
                window.removeEventListener("scrollend", done);
                resolve();
            }
            window.addEventListener("scrollend", done);
            move();
        });
    }

    floors.forEach((link, floor) => link.addEventListener("click", async (event) => {
        if (!plainClick(event)) return;
        event.preventDefault();
        if (leaving) return;
        const trip = ++ride;
        const keyboard = event.detail === 0;
        if (keyboard) car.focus({ preventScroll: true });
        open(false);
        riding = true;
        arriveAt(floor);
        history.replaceState(history.state, "", floor ? `#${link.dataset.section}` : location.pathname + location.search);
        await Promise.all([waitForCar(), scrollToFloor(floor)]);
        if (trip !== ride || leaving) return;
        // The ride's scroll can bring another heading into view. Stay at the chosen
        // stop until the page moves again, unless the scroll was interrupted.
        parkedAt = Math.abs(window.scrollY - floorScrollY(floor)) <= 2 ? window.scrollY : null;
        riding = false;
        follow();
        const build = sectionBuild.build(sections[current]);
        sectionBuild.check();
        await build;
        if (keyboard && trip === ride && current === floor && document.activeElement === car) {
            const heading = floor === 0 ? document.querySelector(".hero h1") : headings[floor];
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
        }
    }));

    if (location.hash) arriveAt(floorFor(location));
    else {
        arriveAt(0);
        follow();
    }
    sectionBuild.check();
}

// Entrances: blocks fade and rise as they scroll into view, once. The CSS holds
// them back (see .js-reveal in global.css); this marks each one .is-in when it shows.
function setUpReveal() {
    window.__revealReady = true;
    const blocks = document.querySelectorAll(".js-reveal :is(" + revealBlocks + ")");
    if (!("IntersectionObserver" in window)) return root.classList.remove("js-reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -8% 0px" });
    blocks.forEach((block) => observer.observe(block));
}
// Keep in step with the selector list in global.css.
const revealBlocks = "main > section:not(.hero) > :not(.project-grid, .club-cards), .project-grid > *, .club-cards > *, .page-head > *, .case-header > *, .case-rail, .case-body > *, .certs > *, .site-footer > *, .not-found-actions";

setUpReveal();
setUpBuilder();
setUpElevator();
setUpThemeCorner();
setUpJobTabs();
setUpProjectFilters();
setUpClips();
