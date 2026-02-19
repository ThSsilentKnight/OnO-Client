"use strict";
fetch("../components/buttons.html")
    .then((res) => res.text())
    .then((html) => {
    document.querySelectorAll("[data-text]").forEach((container) => {
        container.innerHTML = html;
        const label = container.querySelector(".label");
        if (label) {
            label.textContent = container.getAttribute("data-text");
        }
    });
});
fetch("../components/otrioBoard.fragment")
    .then((res) => res.text())
    .then((html) => {
    document.querySelectorAll("[data-size]").forEach((cell) => {
        cell.innerHTML = html;
        const values = cell.getAttribute("data-values");
        const fullRing = cell.querySelectorAll(".otrioCell");
        if (values) {
            const ringIndexes = values.split(" ");
            ringIndexes.forEach((ringIndex) => {
                const ring = document.getElementById(ringIndex);
                if (ring) {
                    ring.style.stroke = "rgb(20, 130, 200)";
                }
            });
        }
        if (fullRing) {
            fullRing.forEach((element) => {
                element.setAttribute("width", `${cell.getAttribute("data-size")}px`);
            });
        }
    });
});
