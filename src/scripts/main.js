const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

// The orange corner switches light and dark. The new theme wipes in from the
// corner toward the bottom left; without view transitions, or for people who ask
// for less motion, it switches at once. The choice is remembered.
function setUpThemeCorner() {
    const corner = document.querySelector(".corner");
    if (!corner) return;
    const isDark = () => (root.dataset.theme ?? (systemDark.matches ? "dark" : "light")) === "dark";
    const label = () => corner.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
    const flip = () => {
        root.dataset.theme = isDark() ? "light" : "dark";
        try {
            localStorage.setItem("theme", root.dataset.theme);
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
    systemDark.addEventListener("change", label);
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

// The hot-fire clip plays when you point at its tile, then returns to its still.
function setUpClips() {
    if (reduceMotion.matches) return;
    document.querySelectorAll(".tile video").forEach((video) => {
        video.closest(".tile").addEventListener("mouseenter", () => video.play().catch(() => {}));
        video.addEventListener("ended", () => video.load());
    });
}

// Hero builder: Bill Durr walks the gradient line, laying it behind himself, and under
// each word he hops; the word pops in as he bumps it. At the end he points out the
// theme corner, then walks off to his elevator (setUpElevator).
// With reduced motion the name is just there and Bill waits in the elevator.
function setUpBuilder() {
    const hero = document.querySelector(".hero");
    const builder = hero?.querySelector(".builder");
    if (!builder) return;
    if (reduceMotion.matches) return hero.classList.add("built", "bill-gone");
    const rule = hero.querySelector(".bb-grad-rule");
    const says = hero.querySelector(".builder-says");
    const ground = builder.parentElement;
    const letters = [...hero.querySelectorAll(".letter")];
    const words = [letters.slice(0, 5), letters.slice(5)];
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const speed = 0.8; // pixels per millisecond
    let run = 0;
    let x = 0;

    async function build() {
        const id = ++run;
        const current = () => id === run;
        says.hidden = true;
        const width = ground.clientWidth;
        const size = builder.offsetWidth;
        const origin = ground.getBoundingClientRect().left;
        x = 0;
        [builder, rule].forEach((element) => element.getAnimations().forEach((animation) => animation.cancel()));
        builder.dataset.pose = "stand";
        const middleOf = (box) => (box.left + box.right) / 2 - origin - size / 2;

        // Walk to `to`, with the line's end going from `from` to `until` meanwhile.
        async function walkTo(to, from, until, pace) {
            const duration = Math.abs(to - x) / pace;
            const face = to < x ? " scaleX(-1)" : "";
            const timing = { duration, easing: "linear", fill: "forwards" };
            builder.animate([{ transform: `translateX(${x}px)${face}` }, { transform: `translateX(${to}px)${face}` }], timing);
            rule.animate([{ clipPath: `inset(0 ${width - from}px 0 0)` }, { clipPath: `inset(0 ${width - until}px 0 0)` }], timing);
            const steps = setInterval(() => (builder.dataset.pose = builder.dataset.pose === "walk-b" ? "walk-a" : "walk-b"), 110);
            await wait(duration);
            clearInterval(steps);
            builder.dataset.pose = "stand";
            x = to;
        }

        // A short pop jump: a beat to wind up, a quick hop that bumps the word, a beat after landing.
        async function jump(word) {
            await wait(160);
            const lift = ground.clientHeight - builder.offsetHeight + 6;
            builder.dataset.pose = "up";
            builder.animate([
                { transform: `translateX(${x}px) translateY(0)`, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
                { transform: `translateX(${x}px) translateY(-${lift}px)`, offset: 0.4, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
                { transform: `translateX(${x}px) translateY(0)` },
            ], { duration: 300, fill: "forwards" });
            await wait(120);
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

        hero.classList.remove("built");
        letters.forEach((letter) => letter.classList.remove("on"));

        for (const word of words) {
            const box = { left: word[0].getBoundingClientRect().left, right: word.at(-1).getBoundingClientRect().right };
            await walkTo(middleOf(box), x, middleOf(box), speed);
            if (!current()) return;
            await jump(word);
            if (!current()) return;
        }
        await walkTo(width - size - 24, x, width - size - 24, speed);
        if (!current()) return;
        rule.getAnimations().forEach((animation) => animation.cancel());
        hero.classList.add("built");
        // The rest of the page now fades in.
        root.classList.remove("awaiting-build");

        // The tip pops up beside Bill.
        says.hidden = false;
        says.animate([{ opacity: 0, transform: "translateY(8px) scale(0.9)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });

        // Then Bill walks off the end of the line to his elevator, which appears with him in it.
        await wait(1800);
        if (!current()) return;
        await says.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).finished;
        says.hidden = true;
        await walkTo(width + size, width, width, speed * 1.6);
        hero.classList.add("bill-gone");
        root.classList.remove("awaiting-bill");
        document.dispatchEvent(new Event("bill-arrived"));
    }

    // Once the visitor has switched themes, the tip has done its job.
    document.querySelector(".corner")?.addEventListener("click", () => (says.hidden = true));
    build();
}

// Bill Durr's elevator. The car opens the "Where to?" panel. On the home page the
// car follows the section you're on; picking a floor rides there while the page
// scrolls, and Bill hops when he arrives.
// Off the home page the floors are ordinary links back to it.
function setUpElevator() {
    const elevator = document.querySelector(".elevator");
    if (!elevator) return;
    const car = elevator.querySelector(".car");
    const panel = elevator.querySelector(".where-to");
    const floors = [...panel.querySelectorAll("a[data-floor]")];
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // `focus` moves keyboard focus into the panel; Bill's own prompt leaves focus alone.
    function open(show, focus = true) {
        panel.hidden = !show;
        car.setAttribute("aria-expanded", String(show));
        if (show && focus) (floors.find((link) => link.hasAttribute("aria-current")) ?? floors[0]).focus();
    }
    car.addEventListener("click", () => open(panel.hidden));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            open(false);
            car.focus();
        }
    });
    document.addEventListener("click", (event) => !panel.hidden && !elevator.contains(event.target) && open(false));

    // The first time Bill gets into the elevator, he asks "Where to?" himself. Only once
    // per visitor; the panel closes again as soon as they scroll.
    document.addEventListener("bill-arrived", () => {
        try {
            if (localStorage.getItem("bill-asked")) return;
            localStorage.setItem("bill-asked", "1");
        } catch {}
        open(true, false);
        window.addEventListener("scroll", () => open(false), { once: true, passive: true });
    });

    if (window.location.pathname !== "/") return;
    const sections = floors.map((link) => (link.dataset.section === "top" ? document.querySelector(".hero") : document.getElementById(link.dataset.section)));
    let current = -1;
    let riding = false;

    function arriveAt(floor) {
        current = floor;
        elevator.style.setProperty("--at", floor);
        floors.forEach((link, index) => (index === floor ? link.setAttribute("aria-current", "location") : link.removeAttribute("aria-current")));
    }

    function follow() {
        if (riding) return;
        const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        let floor = 0;
        sections.forEach((section, index) => section && section.getBoundingClientRect().top <= window.innerHeight * 0.4 && (floor = index));
        if (atEnd) floor = sections.length - 1;
        if (floor !== current) arriveAt(floor);
    }

    // Arriving: Bill hops in the car.
    function build() {
        if (reduceMotion.matches) return;
        car.dataset.pose = "up";
        car.querySelector(".bill").animate([{ transform: "translateY(0)" }, { transform: "translateY(-3px)" }, { transform: "translateY(0)" }], { duration: 260, easing: "ease-out" });
        setTimeout(() => (car.dataset.pose = "stand"), 260);
    }

    floors.forEach((link, floor) => link.addEventListener("click", async (event) => {
        event.preventDefault();
        open(false);
        riding = true;
        arriveAt(floor);
        history.replaceState(null, "", floor ? `#${link.dataset.section}` : "/");
        sections[floor].scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
        // Arrived once both the ride and the scroll are done.
        await Promise.all([wait(700), Promise.race([new Promise((resolve) => window.addEventListener("scrollend", resolve, { once: true })), wait(1500)])]);
        riding = false;
        build();
    }));

    window.addEventListener("scroll", follow, { passive: true });
    follow();
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
