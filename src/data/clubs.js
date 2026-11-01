// Clubs and activities, with cultural clubs and high school last. Logos live in public/clubs/;
// a club with no logo gets an initials tile. `gallery` is a list of { src, alt }
// photos, shown on its card. `projects` are slugs from projects.js.
// A club with a `slug` and `description` gets its own page at /involvement/<slug>/,
// with optional `achievements`, and its card opens that page.
export const clubs = [
    {
        org: "BU AI Society",
        slug: "bu-ai-society",
        description: "At BU AI Society I work across robotics and local AI. I build the simulation an 8-person team uses to train a walking gait for the JetHexa hexapod, and in the Local LLM Division I run hands-on experiments on language models on my own PC.",
        achievements: [
            "Built a ROS 2 and Gazebo simulation of an 18-DOF hexapod robot with lidar, RGB-D camera, and IMU.",
            "Documented reproducible Docker, WSL, and VM setups for an 8-person team training a PPO walking gait.",
            "Ran twelve local LLM experiments on an RTX 5070, including a 2-bit model whose damage an importance matrix cut about 4x.",
        ],
        role: "Officer & Local LLM Lead",
        logo: "/clubs/bu-ai-society.png",
        href: "https://www.buaisociety.com/",
        gallery: [
            { src: "/projects/jethexa/cover.webp", alt: "The JetHexa hexapod robot the simulation models." },
            { src: "/projects/jethexa/ik-demo.png", alt: "The simulated hexapod standing in Gazebo." },
            { src: "/projects/local-llm-lab/cover.webp", alt: "Chart comparing plain and importance-matrix quantization." },
        ],
        projects: ["jethexa", "local-llm-research"],
    },
    {
        org: "BU Rocket Propulsion Group",
        slug: "burpg",
        description: "For BURPG’s intro project, I designed, analyzed, printed and hot-fire tested a nozzle for a small hybrid rocket motor with Jacob Knight and Hikaru Uribe. We presented the Critical Design Review on 3/4/26.",
        achievements: [
            "Sized a de Laval nozzle from the chamber conditions: 7.22 mm throat, 18.45 mm exit, area ratio 6.52.",
            "Ran FEA in SOLIDWORKS Simulation, with a minimum factor of safety of about 25.",
            "3D printed the nozzle in ABS-type resin and hot-fire tested it.",
        ],
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
    {
        org: "Forest Hills High School",
        role: "Boys Varsity Volleyball Captain",
        initials: "FH",
    },
];
