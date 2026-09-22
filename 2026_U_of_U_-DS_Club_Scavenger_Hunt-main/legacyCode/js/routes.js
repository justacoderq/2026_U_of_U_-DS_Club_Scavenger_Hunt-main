// ==============================
// Mock Clue Data (non-module version)
// ==============================
window.routes = {
    route1: [
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] }
    ],
    route2: [
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] }
    ],
    route3: [
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] },
        { clue: "QUESTION: answer = ans", keywords: ["ans"] }
    ]
};

// Global helper
window.getClue = function (routeName, stageIndex) {
    const route = window.routes[routeName];
    if (!route) return { clue: "Invalid route.", keywords: [] };
    return route[stageIndex - 1] || { clue: "Stage not found.", keywords: [] };
};
