// Clubs and activities, with cultural clubs last. Logos live in public/clubs/;
// a club with no logo gets an initials tile. `gallery` is a list of { src, alt }
// photos, shown in place of the logo cover. `projects` are slugs from projects.js.
export const clubs = [
    {
        org: "BU AI Society",
        role: "Robotics Simulation Developer & LLM Inference Researcher",
        logo: "/clubs/bu-ai-society.png",
        href: "https://www.buaisociety.com/",
        gallery: [
            { src: "/projects/jethexa/robot.png", alt: "The JetHexa hexapod robot the simulation models." },
            { src: "/projects/jethexa/ik-demo.png", alt: "The simulated hexapod standing in Gazebo." },
            { src: "/projects/local-llm-lab/cover.webp", alt: "Chart comparing plain and importance-matrix quantization." },
        ],
        projects: ["jethexa", "local-llm-research"],
    },
    {
        org: "BU Rocket Propulsion Group",
        role: "Nozzle Design Engineer",
        logo: "/clubs/burpg.png",
        href: "https://burpg.org/",
        gallery: [
            { src: "/projects/burpg-hip/nozzle-photo-1.webp", alt: "The 3D-printed resin nozzle on its flange." },
            { src: "/projects/burpg-hip/hotfire-short-poster.webp", alt: "The nozzle during a hot-fire test." },
            { src: "/projects/burpg-hip/cad-overall.webp", alt: "CAD model of the nozzle." },
        ],
        projects: ["burpg-hip"],
    },
    {
        org: "Heartfelt Connections",
        role: "VP of User Experience",
        initials: "HC",
        href: "https://www.linkedin.com/company/105780600/",
    },
    {
        org: "BU Blockchain",
        role: "Member",
        logo: "/clubs/bu-blockchain.png",
        href: "https://www.instagram.com/bu_blockchain/",
    },
    {
        org: "BU Game Design",
        role: "Member",
        logo: "/clubs/bu-game-design.jpg",
        href: "https://www.instagram.com/bugamedesign/",
    },
    {
        org: "BU Computer Science",
        role: "Member",
        logo: "/clubs/bu-computer-science.jpg",
        href: "https://www.instagram.com/bucomputerscience/",
    },
    {
        org: "BU Japanese Student Association",
        role: "Member | Kyodai Family, Member",
        logo: "/clubs/bu-jsa.png",
        href: "https://www.instagram.com/thebujsa/",
    },
    {
        org: "BU Chinese Students Association",
        role: "Member",
        logo: "/clubs/bu-csa.png",
        href: "https://www.instagram.com/teamcsa/",
    },
];
