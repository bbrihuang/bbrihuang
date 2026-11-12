// Tech stack, grouped from core skills to supporting tools. Each item has
// either a simple-icons `icon` (shown in its brand color) or a `glyph` from
// glyphs.js with a `color`. `certs` lists certificates for a skill; each skill with
// certificates gets a page at /certifications/<skill>/ showing them.
export const stack = [
    {
        group: "Languages",
        items: [
            {
                name: "Python",
                icon: "siPython",
                certs: [{ name: "Python Fundamentals", issuer: "Coddy", date: "November 10, 2026", href: "https://coddy.tech/certifications/kZAs2y-python-ZP9neU", image: "/certs/python-coddy.webp" }],
            },
            { name: "C++", icon: "siCplusplus" },
            { name: "C", icon: "siC" },
            { name: "TypeScript", icon: "siTypescript" },
            { name: "HTML/CSS", icon: "siHtml5" },
        ],
    },
    {
        group: "Hardware & CAD",
        items: [
            { name: "Arduino", icon: "siArduino" },
            { name: "SOLIDWORKS", glyph: "cad", color: "#da291c" },
            { name: "Onshape", glyph: "cad", color: "#00a6de" },
            { name: "MATLAB", glyph: "wave", color: "#e16737" },
            { name: "3D printing", glyph: "layers", color: "#f472b6" },
            { name: "PC assembly & overclocking", glyph: "chip", color: "#a3e635" },
            { name: "ROS 2", icon: "siRos" },
            { name: "Gazebo", glyph: "gazebo", color: "#f58113" },
        ],
    },
    {
        group: "AI / ML",
        items: [
            { name: "Ollama / llama.cpp", icon: "siOllama" },
            { name: "PyTorch", icon: "siPytorch" },
            { name: "Agents & tool calling", glyph: "agent", color: "#a78bfa" },
            { name: "Embeddings & RAG", glyph: "vector", color: "#34d399" },
        ],
    },
    {
        group: "Web & Tools",
        items: [
            { name: "Astro", icon: "siAstro" },
            { name: "React", icon: "siReact" },
            { name: "Git", icon: "siGit" },
            { name: "Vercel", icon: "siVercel" },
        ],
    },
    {
        group: "Homelab & Cloud",
        items: [
            { name: "Docker", icon: "siDocker" },
            { name: "Linux", icon: "siLinux" },
            { name: "Tailscale", icon: "siTailscale" },
        ],
    },
];

