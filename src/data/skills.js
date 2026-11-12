// Helpers shared by the skills section and the certificate pages.
import * as icons from "simple-icons";
import { stack } from "./stack.js";
import { glyphs } from "./glyphs.js";

// URL slug for a skill name, e.g. "C++" -> "cpp", "ROS 2" -> "ros-2".
export const slugOf = (name) => name.toLowerCase().replace(/\+/g, "p").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Brand colors stay; near-black or near-white marks take the text color so they show in both themes.
function tone(hex) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return light < 0.12 || light > 0.9 ? "currentColor" : `#${hex}`;
}

// The mark for a skill: a filled brand icon or a stroked glyph.
export function markOf(item) {
    if (item.icon) {
        const icon = icons[item.icon];
        return { color: tone(icon.hex), svg: `<path d="${icon.path}"/>`, filled: true };
    }
    return { color: item.color, svg: glyphs[item.glyph], filled: false };
}

export const certifiedSkills = stack.flatMap((group) => group.items).filter((item) => item.certs?.length);
