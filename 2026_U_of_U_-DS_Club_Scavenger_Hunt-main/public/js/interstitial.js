// ==================================================================
// interstitial.js — Shows next clue based on route + stage
// ==================================================================

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);

    const route = Number(params.get("route"));
    const stage = Number(params.get("stage"));
    const clueText = document.getElementById("clueText");

    if (!route || isNaN(stage)) {
        clueText.textContent = "Invalid link.";
        return;
    }

    const nextStage = stage + 1;

    try {
        const res = await fetch(`/api/clueForStage?route=${route}&stage=${nextStage}`);
        const data = await res.json();

        if (!res.ok || data.error || !data.clue) {
            clueText.textContent = "Clue unavailable.";
            return;
        }

        clueText.textContent = data.clue;

    } catch (err) {
        console.error("Error loading clue:", err);
        clueText.textContent = "Error loading clue.";
    }
});
