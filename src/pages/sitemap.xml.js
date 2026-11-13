import { clubs } from "../data/clubs.js";
import { projects } from "../data/projects.js";
import { certifiedSkills, slugOf } from "../data/skills.js";

export function GET({ site }) {
    const paths = [
        "/",
        "/projects/",
        "/involvement/",
        ...projects.map((project) => `/projects/${project.slug}/`),
        ...clubs.filter((club) => club.slug && club.description).map((club) => `/involvement/${club.slug}/`),
        ...certifiedSkills.map((skill) => `/certifications/${slugOf(skill.name)}/`),
    ];
    const urls = paths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join("");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
        headers: { "Content-Type": "application/xml" },
    });
}
