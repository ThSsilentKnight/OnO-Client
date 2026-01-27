import { getRoomId } from "../app.js";
import { makeMove, requestStartGame } from "../network/messages.js";
export const createGameBtn = document.getElementById("host");
export const joinBtn = document.getElementById("join");
export const startBtn = document.getElementById("startBtn");
export const createGameMenu = document.getElementById("create");
export const closeGameMenu = document.querySelectorAll("[data-close-button]");
export const overlay = document.getElementById("overlay");
export const r1 = document.querySelectorAll(".ring.r1");
export const r2 = document.querySelectorAll(".ring.r2");
export const r3 = document.querySelectorAll(".ring.r3");
createGameMenu?.addEventListener("click", () => {
    const modalTarget = createGameMenu.dataset.modalTarget;
    if (modalTarget) {
        const modal = document.querySelector(modalTarget);
        openModal(modal);
    }
});
r1.forEach((ring) => {
    ring.addEventListener("click", () => {
        onRingClick(ring);
    });
});
r2.forEach((ring) => {
    ring.addEventListener("click", () => {
        onRingClick(ring);
    });
});
r3.forEach((ring) => {
    ring.addEventListener("click", () => {
        onRingClick(ring);
    });
});
export async function onRingClick(ring) {
    makeMove(ring.id, getRoomId());
}
startBtn?.addEventListener("click", () => {
    console.log("A Player Has Started The Game");
    requestStartGame(getRoomId());
});
closeGameMenu.forEach((button) => {
    const el = button;
    el.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});
function openModal(modal) {
    if (modal === null)
        return;
    modal.classList.add("active");
    overlay?.classList.add("active");
    console.log(modal.classList);
}
function closeModal(modal) {
    if (modal === null)
        return;
    modal.classList.remove("active");
    overlay?.classList.remove("active");
}
