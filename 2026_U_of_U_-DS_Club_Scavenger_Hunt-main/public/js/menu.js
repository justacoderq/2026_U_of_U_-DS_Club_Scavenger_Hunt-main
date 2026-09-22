document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const menuDropdown = document.getElementById("menuDropdown");

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            menuDropdown.style.display =
                menuDropdown.style.display === "flex" ? "none" : "flex";
        });

        document.addEventListener("click", (event) => {
            if (
                !menuDropdown.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                menuDropdown.style.display = "none";
            }
        });
    }
});
