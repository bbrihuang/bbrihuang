// Tech stack, grouped from core skills to supporting tools. Each item has
// either a simple-icons `icon` (shown in its brand color) or a `glyph` from
// glyphs.js with a `color`.
export const stack = [
    {
        group: "Languages",
        items: [
            { name: "Python", icon: "siPython" },
            { name: "C++", icon: "siCplusplus" },
            { name: "C", icon: "siC" },
            { name: "TypeScript", icon: "siTypescript" },
            { name: "JavaScript", icon: "siJavascript" },
            { name: "Java", glyph: "java", color: "#f89820" },
            { name: "SQL", glyph: "db", color: "#336791" },
            { name: "HTML/CSS", icon: "siHtml5" },
            { name: "R", icon: "siR" },
        ],
    },
    {
        group: "Hardware & CAD",
        items: [
            { name: "Arduino", icon: "siArduino" },
            { name: "SOLIDWORKS", glyph: "cad", color: "#da291c" },
            { name: "Onshape", glyph: "cad", color: "#00a6de" },
            { name: "Blender", icon: "siBlender" },
            { name: "MATLAB", glyph: "wave", color: "#e16737" },
            { name: "UltiMaker Cura", glyph: "slicer", color: "#196ef0" },
            { name: "3D printing", glyph: "layers", color: "#f472b6" },
            { name: "PC assembly & overclocking", glyph: "chip", color: "#a3e635" },
            { name: "AV systems", glyph: "av", color: "#38bdf8" },
        ],
    },
    {
        group: "Robotics",
        items: [
            { name: "ROS 2", icon: "siRos" },
            { name: "Gazebo", glyph: "gazebo", color: "#f58113" },
        ],
    },
    {
        group: "AI / ML",
        items: [
            { name: "Ollama / llama.cpp", icon: "siOllama" },
            { name: "PyTorch", icon: "siPytorch" },
            { name: "LM Studio", glyph: "studio", color: "#8b8cf8" },
            { name: "ComfyUI", glyph: "nodes", color: "#f2c94c" },
            { name: "MCP", icon: "siModelcontextprotocol" },
            { name: "Agents & tool calling", glyph: "agent", color: "#a78bfa" },
            { name: "Embeddings & RAG", glyph: "vector", color: "#34d399" },
            { name: "Claude Code", icon: "siClaude" },
        ],
    },
    {
        group: "Web & Tools",
        items: [
            { name: "Astro", icon: "siAstro" },
            { name: "React", icon: "siReact" },
            { name: "Vite", icon: "siVite" },
            { name: "Tailwind CSS", icon: "siTailwindcss" },
            { name: "Node.js", icon: "siNodedotjs" },
            { name: "Git", icon: "siGit" },
            { name: "GitHub Actions", icon: "siGithubactions" },
            { name: "Vercel", icon: "siVercel" },
            { name: "VS Code", glyph: "editor", color: "#3b9fe8" },
        ],
    },
    {
        group: "Homelab & Cloud",
        items: [
            { name: "Docker", icon: "siDocker" },
            { name: "Linux", icon: "siLinux" },
            { name: "WSL2 (Ubuntu)", icon: "siUbuntu" },
            { name: "Tailscale", icon: "siTailscale" },
            { name: "n8n", icon: "siN8n" },
            { name: "Oracle Cloud", glyph: "cloud", color: "#e5483a" },
        ],
    },
];
