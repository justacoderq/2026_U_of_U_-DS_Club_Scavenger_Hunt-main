// Placeholder for future backend sync
export function saveTeamData(teamData) {
    localStorage.setItem("teamData", JSON.stringify(teamData));
}

export function getTeamData() {
    return JSON.parse(localStorage.getItem("teamData"));
}
