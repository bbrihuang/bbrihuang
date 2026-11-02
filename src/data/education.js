// Relevant coursework, grouped. `inProgress` marks this semester's courses.
export const coursework = [
    {
        group: "Software",
        courses: [
            { name: "Introduction to Software Engineering", code: "EC 327" },
            { name: "Introduction to Programming for Engineers", code: "EK 125" },
            { name: "Computational Linear Algebra", code: "EK 103" },
        ],
    },
    {
        group: "Hardware",
        courses: [
            { name: "Electric Circuits", code: "EK 307", inProgress: true },
            { name: "Introduction to Engineering", code: "EK 131" },
        ],
    },
    {
        group: "Math & physics",
        courses: [
            { name: "Calculus I", code: "MA 123" },
            { name: "Calculus II", code: "MA 124" },
            { name: "Multivariable Calculus", code: "MA 225", inProgress: true },
            { name: "Introduction to Discrete Mathematics", code: "MA 193", inProgress: true },
            { name: "Physics I", code: "PY 211" },
            { name: "Physics II", code: "PY 212", inProgress: true },
        ],
    },
];
