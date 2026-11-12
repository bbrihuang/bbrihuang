// Each heading is built on its first visit in this tab. The rest of the section
// uses the regular scroll entrances after the hammer strike reveals the heading.
export function setUpSectionBuild({ car, canBuild, getSection, reduceMotion }) {
    const root = document.documentElement;
    const pending = new Map();
    let building = false;

    const ready = () => !reduceMotion.matches && canBuild()
        && !root.classList.contains("awaiting-build") && !root.classList.contains("awaiting-bill");
    const isTarget = (section) => !getSection || getSection() === section;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function finish(section, remember = true) {
        const entry = pending.get(section);
        if (!entry) return;
        section.dataset.build = "built";
        pending.delete(section);
        if (remember) {
            try { sessionStorage.setItem(entry.key, "1"); } catch {}
        }
    }

    function restore() {
        for (const [section, { key }] of pending) {
            try {
                if (sessionStorage.getItem(key)) finish(section, false);
            } catch {}
        }
    }

    function isVisible(heading, limit = window.innerHeight) {
        const { top, bottom } = heading.getBoundingClientRect();
        return top < limit && bottom > 0;
    }

    async function build(section) {
        const entry = pending.get(section);
        if (!entry || building || !ready() || !isTarget(section) || !isVisible(entry.heading)) return;

        building = true;
        try {
            car.dataset.pose = "up";
            await wait(120);
            // A fast scroll or another ride can take the heading out of view.
            if (!pending.has(section) || !ready() || !isTarget(section) || !isVisible(entry.heading)) return;
            car.dataset.pose = "down";
            section.dataset.build = "building";
            const animations = entry.heading.getAnimations().map((animation) => animation.finished.catch(() => {}));
            await wait(110);
            car.dataset.pose = "stand";
            await Promise.all(animations);
            finish(section);
        } finally {
            car.dataset.pose = "stand";
            building = false;
            check();
        }
    }

    function check() {
        if (!pending.size || building || !ready()) return;

        const limit = window.innerHeight * 0.85;
        for (const [section, { heading }] of pending) {
            if (isTarget(section) && isVisible(heading, limit)) {
                build(section);
                return;
            }
            // A direct link or a quick scroll can land below the heading.
            // The reader should see any content they have already reached.
            if (heading.getBoundingClientRect().bottom <= 0 && section.getBoundingClientRect().bottom > 0) {
                finish(section);
            }
        }
    }

    if (!car || reduceMotion.matches) return { build, check };

    const headings = document.querySelectorAll("main > section.bb-section > h2.bb-section-word, main > :is(.page-head, .case-header) > h1");
    headings.forEach((heading) => {
        const section = heading.closest("section, main");
        const key = `bill-built:${location.pathname}:${heading.id || heading.textContent.trim()}`;
        heading.classList.add("build-heading");
        section.dataset.build = "pending";
        pending.set(section, { heading, key });
    });

    restore();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.addEventListener("pageshow", () => {
        restore();
        check();
    });
    document.addEventListener("bill-arrived", check);
    reduceMotion.addEventListener("change", () => {
        if (reduceMotion.matches) pending.forEach((entry, section) => finish(section, false));
    });
    check();
    return { build, check };
}
