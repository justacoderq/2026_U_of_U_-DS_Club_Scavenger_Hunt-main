// ==============================
// app.js — Landing page logic
// ==============================

// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const menuDropdown = document.getElementById("menuDropdown");
    const form = document.getElementById("teamForm");
    const routeButtons = document.querySelectorAll(".route-btn");
    let selectedRoute = null;

    // ==============================
    // Dropdown Menu Toggle
    // ==============================
    menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        menuDropdown.style.display = menuDropdown.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (event) => {
        if (!menuDropdown.contains(event.target) && !menuBtn.contains(event.target)) {
            menuDropdown.style.display = "none";
        }
    });

    // ==============================
    // Route Selection Logic
    // ==============================
    routeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            routeButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedRoute = btn.dataset.route;
        });
    });

    // ==============================
    // Form Submission Logic
    // ==============================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const teamName = document.getElementById("teamName").value.trim();
        const contactInfo = document.getElementById("contactInfo").value.trim();

        if (!teamName || !selectedRoute) {
            alert("Please enter a team name and select a route.");
            return;
        }

        // Create team object
        const teamData = {
            teamName,
            contactInfo,
            route: selectedRoute,
            startTime: Date.now(),
        };

        // TODO: Replace localStorage with backend POST request
        localStorage.setItem("teamData", JSON.stringify(teamData));

        // Dynamic fix for correct stage redirect (route1 → stage11.html, route2 → stage21.html, etc.)
        const routeNumber = selectedRoute.replace("route", ""); // "1", "2", or "3"
        const firstStageFile = `stage${routeNumber}1.html`;
        const destination = `routes/${selectedRoute}/${firstStageFile}`;

        console.log(`Redirecting to: ${destination}`); // DEBUG: confirm correct path
        window.location.href = destination;
    });

    // ==============================
    // DEBUG OVERLAY (visible on all pages)
    // ==============================
    // TODO: Remove before production
    const existingData = localStorage.getItem("teamData");
    if (existingData) {
        const team = JSON.parse(existingData);
        const stageMatch = window.location.pathname.match(/stage(\d{2})/);
        const stageLabel = stageMatch ? stageMatch[1] : "N/A";

        const debugDiv = document.createElement("div");
        debugDiv.style.position = "fixed";
        debugDiv.style.bottom = "10px";
        debugDiv.style.right = "10px";
        debugDiv.style.background = "rgba(0,0,0,0.7)";
        debugDiv.style.color = "white";
        debugDiv.style.padding = "6px 10px";
        debugDiv.style.borderRadius = "8px";
        debugDiv.style.fontSize = "0.8rem";
        debugDiv.style.fontFamily = "monospace";
        debugDiv.style.zIndex = "9999";
        debugDiv.style.opacity = "0.9";

        debugDiv.innerHTML = `
      <strong>DEBUG</strong><br>
      Team: ${team.teamName}<br>
      Route: ${team.route}<br>
      Stage: ${stageLabel}
    `;

        document.body.appendChild(debugDiv);
    }
});
