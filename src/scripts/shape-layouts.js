// Where each background shape sits on each page. left / top are offsets in
// vw / vh, r is rotation in degrees, s is scale. Changing page eases the
// shapes from one layout to the next.
export const shapeLayouts = {
    home: {
        orb: { left: 60, top: 6, r: 0, s: 1 },
        ring: { left: -22, top: 34, r: 0, s: 1 },
        diamond: { left: 82, top: 64, r: 45, s: 1 },
        triangle: { left: 4, top: -4, r: 14, s: 1 },
        capsule: { left: 34, top: 82, r: -18, s: 1 },
        dots: { left: 90, top: 16, r: 0, s: 1 },
        axis: { left: 92, top: 86, r: 0, s: 1 },
    },
    projects: {
        orb: { left: 68, top: 48, r: 0, s: 0.95 },
        ring: { left: 14, top: -34, r: 180, s: 1.1 },
        diamond: { left: 2, top: 56, r: 72, s: 0.9 },
        triangle: { left: 46, top: 0, r: 42, s: 1.1 },
        capsule: { left: 62, top: 8, r: -36, s: 1 },
        dots: { left: 88, top: 84, r: 0, s: 1 },
        axis: { left: 4, top: 90, r: 0, s: 1 },
    },
    caseStudy: {
        orb: { left: 28, top: -22, r: 0, s: 1.25 },
        ring: { left: 58, top: 38, r: 270, s: 0.9 },
        diamond: { left: -6, top: 22, r: 12, s: 1 },
        triangle: { left: 86, top: 30, r: 64, s: 0.8 },
        capsule: { left: 70, top: 86, r: 16, s: 1 },
        dots: { left: 10, top: 72, r: 0, s: 1 },
        axis: { left: 96, top: 62, r: 0, s: 1 },
    },
};

export function layoutFor(pathname) {
    if (pathname === "/projects" || pathname === "/projects/") return shapeLayouts.projects;
    if (pathname.startsWith("/projects/")) return shapeLayouts.caseStudy;
    return shapeLayouts.home;
}

export function shapeStyle(place) {
    return `--left: ${place.left}vw; --top: ${place.top}vh; --r: ${place.r}deg; --s: ${place.s};`;
}
