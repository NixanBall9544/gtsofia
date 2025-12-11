/* ----------------------------------------
   BUILD SIDEBAR LINE LIST
-------------------------------------------*/
let directionState = {}; // track direction per line

function refreshLineList(filter = null) {
    const list = document.getElementById("lineList");
    list.innerHTML = "";

    for (const lineKey in lines) {
        const data = lines[lineKey];
        const type = data.type;

        if (filter && (type.startsWith(filter) === false)) continue;

        // Determine correct color class
        let colorClass = '';
if (type.startsWith("metro")) {
    // Extract the number from lineKey (e.g., 'metro-1' → '1')
    const metroLineNumber = lineKey.split('-')[1]; 
    colorClass = 'metro' + metroLineNumber; // 'metro1', 'metro2', etc.
    
    if (!COLORS[colorClass]) colorClass = 'metro1'; // fallback
}

        // Sidebar: pills only
        const pill = document.createElement("div");
        pill.className = `line-pill ${type} ${colorClass}`;
        if (type.startsWith("metro")) pill.classList.add("metro-pill");
        pill.textContent = type.startsWith("metro") ? `${data.number}` : data.number;

        pill.onclick = () => showLine(lineKey);

        list.appendChild(pill);
    }
}

refreshLineList();

/* FILTER BUTTONS */
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.dataset.type;
        refreshLineList(type);
    });
});

/* SEARCH BAR */
document.getElementById("searchLine").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const list = document.getElementById("lineList");
    [...list.children].forEach(pill => {
        const match = pill.textContent.toLowerCase().includes(q);
        pill.style.display = match ? "flex" : "none";
    });
});

/* LINE DISPLAY */
function showLine(lineKey) {
    const data = lines[lineKey];
    if (!(lineKey in directionState)) directionState[lineKey] = 0;
    const dir = directionState[lineKey];

    const header = document.getElementById("lineHeader");
    const color = COLORS[data.type + lineKey] || COLORS[data.type] || "#000";
    const icon = ICONS[data.type.startsWith("metro") ? "metro" : data.type];

    // Determine color class for metro pill
    let colorClass = '';
if (data.type.startsWith("metro")) {
    // Extract the number from lineKey (e.g., 'metro-1' → '1')
    const metroLineNumber = lineKey.split('-')[1]; 
    colorClass = 'metro' + metroLineNumber; // 'metro1', 'metro2', etc.
    
    if (!COLORS[colorClass]) colorClass = 'metro1'; // fallback
}

    // Header always shows icon
    // Metro: circle pill next to icon
    // Others: rectangle pill next to icon
    header.innerHTML = `
        <div class="line-header-icon" style="--line-color:${color}">
            <div class="icon"><img src="${icon}" alt="${data.type} icon"></div>
            <div class="line-pill ${data.type} ${data.type.startsWith("metro") ? "metro-pill " + colorClass : ""}">
                ${data.number}
            </div>
            <img class="arrow" src="https://sofiatraffic.bg/images/next.svg" alt="next">
            <span class="destination">${data.directions[dir].name}</span>
            <button class="switch-dir" onclick="switchDirection('${lineKey}')">Промяна на посоката</button>
        </div>
    `;

    renderStops(data.directions[dir].stops);
}

function switchDirection(lineKey) {
    directionState[lineKey] = directionState[lineKey] === 0 ? 1 : 0;
    showLine(lineKey);
}

/* STOP LIST RENDERING */
function renderStops(stops) {
    const container = document.getElementById("stopsContainer");
    container.innerHTML = "";

    stops.forEach(stop => {
        const item = document.createElement("div");
        item.className = "stop-item";
        item.textContent = (stop.onDemand ? "👋 " : "") + stop.name;
        container.appendChild(item);
    });
}


