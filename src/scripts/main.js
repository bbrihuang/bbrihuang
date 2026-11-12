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
    };
    corner.addEventListener("click", async () => {
        if (!document.startViewTransition || reduceMotion.matches) return flip();
        root.classList.add("peeling");
        try {
            await document.startViewTransition(flip).finished;
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

// Top bar on Home: underline the link for the section at the top of the screen.
function setUpSectionSpy() {
    if (window.location.pathname !== "/") return;
    const links = [...document.querySelectorAll(".site-nav a[data-section]")];
    const sections = links.map((link) => document.getElementById(link.dataset.section)).filter(Boolean);
    function update() {
        const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        const current = atEnd ? sections.at(-1) : sections.findLast((section) => section.getBoundingClientRect().top <= 140);
        links.forEach((link) => (current && link.dataset.section === current.id ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current")));
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
}

// The hot-fire clip plays when you point at its tile, then returns to its still.
function setUpClips() {
    if (reduceMotion.matches) return;
    document.querySelectorAll(".tile video").forEach((video) => {
        video.closest(".tile").addEventListener("mouseenter", () => video.play().catch(() => {}));
        video.addEventListener("ended", () => video.load());
    });
}

setUpThemeCorner();
setUpJobTabs();
setUpProjectFilters();
setUpSectionSpy();
setUpClips();
