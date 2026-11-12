// Work experience, newest start date first. Dates are
// "YYYY-MM" so durations can be worked out; `end: null` means a current role,.
export const experience = [
    {
        role: "Lead Software Engineer",
        org: "GradientV LLC",
        orgNote: "Technology & systems integration agency",
        url: "https://gradientv.com/",
        logo: "/logos/gradientv.png",
        place: "New York, NY (Hybrid)",
        start: "2026-10",
        end: null,
        bullets: [
            "Delivered 3 production websites for small-business clients (a tax advisory firm, a Filipino cafe, a food truck) by building them in React and deploying on Vercel with custom domains, SEO metadata and mobile-responsive, accessible layouts.",
            "Gave clients a way to estimate their IRS penalty exposure by industry, by building a self-assessment tool plus catering and signup forms.",
            "Let business owners ask questions about their own data, by developing LLM agents with RAG and API integrations.",
        ],
        skills: ["React", "Vercel", "LLM agents", "RAG", "SEO", "Accessibility"],
    },
    {
        role: "Student TechOps Assistant",
        org: "Boston University College of Communication",
        orgNote: "TechOps Center",
        url: "https://www.bu.edu/comtech/",
        logo: "/logos/bu.png",
        place: "Boston, MA",
        start: "2026-09",
        end: null,
        bullets: [
            "Kept evening broadcast studios, podcast suites and classrooms running by troubleshooting AV, Zoom and macOS editing workstations as the evening point of contact.",
        ],
        skills: ["AV systems", "macOS", "Adobe Creative Cloud", "Zoom", "Tech support"],
    },
    {
        role: "Audio and Video Recorder",
        org: "Babel Audio",
        orgNote: "AI training data",
        logo: "/logos/babel-audio.svg",
        place: "Remote",
        start: "2026-02",
        end: "2026-05",
        bullets: [
            "Delivered usable AI speech training data across 500+ recording sessions by following detailed audio and video recording protocols.",
        ],
        skills: ["AI training data", "Audio/video capture", "Quality assurance"],
    },
    {
        role: "Founder",
        org: "PolygonPCs",
        orgNote: "Custom PC building business",
        logo: "/logos/polygon-pcs.svg",
        place: "New York, NY",
        start: "2023-01",
        end: null,
        bullets: [
            "Generated $10K+ in revenue by building and selling 10+ custom PCs at a $1,000 average, tailored to each client's budget and use (gaming, streaming).",
            "Delivered reliable systems to clients across the US by stress testing every build with Prime95, MemTest86, OCCT and FurMark.",
            "Gave customers a way to choose parts online by designing and building the storefront in React, with a live part customizer and a guided configurator.",
        ],
        skills: ["PC assembly", "Stress testing", "Overclocking", "Watercooling", "React"],
    },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(ym) {
    if (!ym) return "Present";
    const [year, month] = ym.split("-").map(Number);
    return `${MONTHS[month - 1]} ${year}`;
}

export function formatRange(start, end) {
    return `${formatMonth(start)} – ${formatMonth(end)}`;
}

// Inclusive month count, e.g. Feb to May is 4 mos.
export function duration(start, end) {
    const [startYear, startMonth] = start.split("-").map(Number);
    const now = new Date();
    const [endYear, endMonth] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
    const total = Math.max(1, (endYear - startYear) * 12 + (endMonth - startMonth) + 1);
    const years = Math.floor(total / 12);
    const months = total % 12;
    const parts = [];
    if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
    return parts.join(" ");
}
