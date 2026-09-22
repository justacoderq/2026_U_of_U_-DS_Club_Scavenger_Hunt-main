// ========================================================
// app.js — Landing page logic for secure token-based system
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("teamForm");
    const routeButtons = document.querySelectorAll(".route-btn");
    let selectedRoute = null;

    // ------------------------------
    // Route selection
    // ------------------------------
    routeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            routeButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedRoute = btn.dataset.route; // e.g. "route1"
        });
    });

    // ------------------------------
    // Form submission
    // ------------------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const teamName = document.getElementById("teamName").value.trim();
        const contactInfo = document.getElementById("contactInfo").value.trim();

        if (!teamName || !selectedRoute) {
            alert("Please enter a team name and select a route.");
            return;
        }

        // Register team in backend
        let backendTeam;
        try {
            const regRes = await fetch("/api/team/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamName, contact: contactInfo })
            });

            backendTeam = await regRes.json();

            if (!regRes.ok) {
                alert(backendTeam.error || "Unable to register team.");
                return;
            }
        } catch (err) {
            console.error("Team registration failed:", err);
            alert("Network error registering your team. Try again.");
            return;
        }

        // Save local data for finish page
        localStorage.setItem("teamData", JSON.stringify({
            teamName,
            contact: contactInfo,
            route: selectedRoute,
            startTime: backendTeam.team.startTime
        }));

        // Convert "route2" → 2
        const numericRoute = Number(selectedRoute.replace("route", ""));

        // Redirect to stage 0 interstitial
        window.location.href = `/interstitial.html?route=${numericRoute}&stage=0`;
    });

    // ------------------------------
    // Dropdown menu
    // ------------------------------
    const menuBtn = document.getElementById("menuBtn");
    const menuDropdown = document.getElementById("menuDropdown");

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            menuDropdown.style.display =
                menuDropdown.style.display === "flex" ? "none" : "flex";
        });

        document.addEventListener("click", (event) => {
            if (!menuDropdown.contains(event.target) && !menuBtn.contains(event.target)) {
                menuDropdown.style.display = "none";
            }
        });
    }
});
