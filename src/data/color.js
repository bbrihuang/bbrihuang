// Brand colors on a dark ground. Some brands are navy or black, which would
// vanish on the graphite background, so those are mixed toward white until
// they read clearly. Everything else keeps its official color.
const BG = 0.0065; // relative luminance of --coal

function luminance(hex) {
    const [r, g, b] = [0, 2, 4].map((i) => {
        const v = parseInt(hex.slice(i, i + 2), 16) / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mixWithWhite(hex, t) {
    return [0, 2, 4]
        .map((i) => {
            const v = parseInt(hex.slice(i, i + 2), 16);
            return Math.round(v + (255 - v) * t).toString(16).padStart(2, "0");
        })
        .join("");
}

export function onDark(hex, minContrast = 4.5) {
    const base = hex.replace("#", "");
    // Black marks (Vercel, Ollama, ...) are monochrome brands: show them white.
    if (luminance(base) < 0.005) return "#e4e4e7";
    let h = base;
    for (let t = 0; (luminance(h) + 0.05) / (BG + 0.05) < minContrast && t < 1; ) {
        t += 0.05;
        h = mixWithWhite(base, t);
    }
    return `#${h}`;
}
