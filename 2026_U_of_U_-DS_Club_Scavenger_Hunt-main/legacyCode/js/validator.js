// =========================================
// validator.js — clue logic + debug overlay
// (plain JS, no modules; safe for static hosting)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // ----- Elements (exist on clue pages) -----
    const form = document.getElementById("clueForm");
    const errorMsg = document.getElementById("errorMsg");
    const clueText = document.getElementById("clue-text");
    const clueTitle = document.getElementById("clue-title");

    // =========================================
    // Route + Stage detection from URL
    // Examples:
    //   /routes/route1/stage11.html  -> routeName=route1, fullStageNum=11
    //   /routes/route2/stage22.html  -> routeName=route2, fullStageNum=22
    // =========================================
    const pathParts = window.location.pathname.split("/");
    const routeName = pathParts[pathParts.length - 2];        // "route1", "route2", "route3"
    const pageName  = pathParts[pathParts.length - 1];        // "stage11.html"

    const routeNum = parseInt((routeName || "").replace("route", ""), 10) || 1;

    // Pull the full stage number from filename; fallback to first stage of this route
    const m = pageName.match(/stage(\d+)\.html/i);
    const fullStageNum = m ? parseInt(m[1], 10) : routeNum * 10 + 1; // 11, 21, 31, etc.

    // Stage index within the route (1..5) used for display & clue lookup
    const stageIndex = fullStageNum % 10 || 1; // 11 -> 1, 22 -> 2, etc.

    // =========================================
    // Load clue content (requires routes.js loaded first)
    // =========================================
    if (typeof window.getClue === "function") {
        const currentClue = window.getClue(routeName, stageIndex); // { clue, keywords }

        if (clueText)  clueText.textContent  = currentClue.clue || "Clue not found.";
        if (clueTitle) clueTitle.textContent = `Clue #${stageIndex}`;

        // =========================================
        // Form submission / validation
        // =========================================
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const answer = document.getElementById("answerInput").value.trim().toLowerCase();

                if (!answer) return;

                const isCorrect = currentClue.keywords.some(keyword =>
                    answer.includes(keyword.toLowerCase())
                );

                if (isCorrect) {
                    console.log(`✅ Correct: ${routeName} stage ${fullStageNum}`);
                    const nextIndex = stageIndex + 1;

                    if (nextIndex > 5) {
                        window.location.href = "../../finish.html";
                    } else {
                        // Build next file name properly
                        const nextPage = `stage${routeNum}${nextIndex}.html`;
                        const nextUrl = `../../routes/route${routeNum}/${nextPage}`;
                        console.log(`➡️ Redirecting to ${nextUrl}`);
                        window.location.href = nextUrl;
                    }
                } else {
                    if (errorMsg) {
                        errorMsg.textContent = "❌ Incorrect answer. Try again!";
                        errorMsg.style.display = "block";
                    }
                    console.warn(`❌ Wrong answer for ${routeName} stage ${fullStageNum}: "${answer}"`);
                }
            });
        }
    } else {
        console.error("routes.js (window.getClue) not found. Ensure <script src='.../routes.js'> loads before validator.js.");
    }

    // =========================================
    // DEV BUTTON LOGIC (universal + dynamic)
    // =========================================
    const devBtn = document.getElementById("devBtn");
    if (devBtn) {
        devBtn.addEventListener("click", () => {
            const teamData = JSON.parse(localStorage.getItem("teamData") || "{}");
            const route = teamData.route || routeName || "route1";
            const routeNum = parseInt(route.replace("route", ""), 10);

            const nextIndex = stageIndex + 1;
            const nextPage = `stage${routeNum}${nextIndex}.html`;
            const nextUrl = `../../routes/${route}/${nextPage}`;

            console.log(`🧭 DEV Redirect → ${nextUrl}`);
            window.location.href = nextUrl;
        });
    }

    // =========================================
    // Dropdown menu toggle (shared)
    // =========================================
    const menuBtn = document.getElementById("menuBtn");
    const menuDropdown = document.getElementById("menuDropdown");

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            menuDropdown.style.display = menuDropdown.style.display === "flex" ? "none" : "flex";
        });
        document.addEventListener("click", (e) => {
            if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                menuDropdown.style.display = "none";
            }
        });
    }

    // =========================================
    // DEBUG OVERLAY (TODO: remove before production)
    // Shows team, route, and stage on every page where teamData exists
    // =========================================
    try {
        const existingData = localStorage.getItem("teamData");
        if (existingData) {
            const team = JSON.parse(existingData);
            const debugDiv = document.createElement("div");
            debugDiv.style.position = "fixed";
            debugDiv.style.bottom = "10px";
            debugDiv.style.right = "10px";
            debugDiv.style.background = "rgba(0,0,0,0.75)";
            debugDiv.style.color = "white";
            debugDiv.style.padding = "6px 10px";
            debugDiv.style.borderRadius = "8px";
            debugDiv.style.fontSize = "0.8rem";
            debugDiv.style.fontFamily = "monospace";
            debugDiv.style.zIndex = "9999";
            debugDiv.style.opacity = "0.95";
            debugDiv.innerHTML = `
                <strong>DEBUG</strong><br>
                Team: ${team.teamName || "?"}<br>
                Route: ${team.route || routeName}<br>
                Stage: ${fullStageNum} (index ${stageIndex})
            `;
            document.body.appendChild(debugDiv);
        }
    } catch (e) {
        console.warn("DEBUG overlay skipped:", e);
    }
});
