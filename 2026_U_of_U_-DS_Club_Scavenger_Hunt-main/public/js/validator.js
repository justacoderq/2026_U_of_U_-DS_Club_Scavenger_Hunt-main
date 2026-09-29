// ==================================================================
// validator.js — Secure puzzle question validation + progression
// ==================================================================

document.addEventListener("DOMContentLoaded", async () => {
    const token = window.location.pathname.split("/").pop();

    const form = document.getElementById("clueForm");
    const questionTitle = document.getElementById("question-title");
    const questionText = document.getElementById("question-text");
    const questionVisual = document.getElementById("question-visual");
    const errorMsg = document.getElementById("errorMsg");

    const teamField = document.getElementById("teamName");
    const teamData = JSON.parse(localStorage.getItem("teamData") || "{}");

    if (teamData.teamName) {
        teamField.value = teamData.teamName; // autofill
    }

    
    if (!token) {
        questionText.textContent = "Invalid QR token.";
        return;
    }

    // ------------------------------------------------------------
    // 1) Load route + stage from token
    // ------------------------------------------------------------
    let route, stage;
    try {
        const res = await fetch(`/api/clue/${token}`);
        const data = await res.json();

        if (data.error) {
            questionText.textContent = "Invalid or expired QR code.";
            return;
        }

        route = Number(data.route.replace("route", ""));
        stage = Number(data.stage);

    } catch (err) {
        console.error(err);
        questionText.textContent = "Error loading token info.";
        return;
    }

    // ------------------------------------------------------------
    // 2) Load puzzle + hint
    // ------------------------------------------------------------
    try {
        const puzzleRes = await fetch(`/api/puzzle/${route}/${stage}`);
        const puzzle = await puzzleRes.json();

        if (!puzzleRes.ok || puzzle.error) {
            questionText.textContent = "Puzzle not found.";
            return;
        }

        questionTitle.textContent = `Question #${stage}`;
        questionText.textContent = puzzle.question;
        if (puzzle.image) {
            questionVisual.src = puzzle.image;
            questionVisual.alt = `Visual for question ${stage}`;
            questionVisual.hidden = false;
        }

        // Hint
        const hintBtn = document.getElementById("hintBtn");
        const hintText = document.getElementById("hintText");

        hintBtn.addEventListener("click", () => {
            hintText.textContent = puzzle.hint || "No hint available.";
            hintText.style.display = "block";
            hintBtn.style.display = "none";
        });
    } catch (err) {
        console.error(err);
        questionText.textContent = "Error loading puzzle.";
        return;
    }

    // ------------------------------------------------------------
    // 3) Validate answer
    // ------------------------------------------------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMsg.style.display = "none";

        try {
            const submitted = document.getElementById("answerInput").value.trim().toLowerCase();
            const teamName = document.getElementById("teamName").value.trim();
            
            const res = await fetch(`/api/checkAnswer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    route,
                    stage,
                    answer: submitted,
                    team: teamName
                })
            });

            const result = await res.json();

            if (!res.ok || result.correct !== true) {
                errorMsg.style.display = "block";
                return;
            }

            if (!result.nextToken) {
                window.location.href = "/finish.html";
                return;
            }

            window.location.href = `/interstitial.html?route=${route}&stage=${stage}`;

        } catch (err) {
            console.error("Validation error:", err);
            alert("Server error. Try again.");
        }
    });
});
