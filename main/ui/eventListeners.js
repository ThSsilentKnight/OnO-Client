import { requestBoardAction, requestJoinRoom, requestNewRoom, requestStartGame, } from "../network/requests.js";
import { closeModal, drag, dragEnd, dragStart, generateRoomId, getClientId, getRoomId, openModal, } from "../utils/helpers.js";
import { body, closeGameMenu, createGameBtn, createGameMenu, joinBtn, ring1, ring2, ring3, startBtn, } from "./dom.js";
// Game Creation
createGameBtn?.addEventListener("click", () => {
    const roomId = generateRoomId();
    localStorage.setItem("currentRoom", String(roomId));
    requestNewRoom(roomId);
    requestJoinRoom(getClientId(), roomId);
    window.location.assign(`game.html#id=${roomId}`);
    localStorage.removeItem("color");
});
// This is run after the client enters room Id
joinBtn?.addEventListener("click", () => {
    const code = prompt("enter code", "Code here");
    if (code) {
        requestJoinRoom(getClientId(), Number(code));
        localStorage.removeItem("color");
        localStorage.setItem("currentRoom", String(code)); // CHANGE LATER!
        window.location.assign(`game.html#id=${localStorage.getItem("currentRoom")}`);
    }
});
createGameMenu?.addEventListener("click", () => {
    const modalTarget = createGameMenu?.dataset.modalTarget;
    if (modalTarget) {
        const modal = document.querySelector(modalTarget);
        openModal(modal);
    }
});
ring1.forEach((ring) => {
    ring.addEventListener("click", () => {
        onRingClick(ring);
    });
});
ring2.forEach((ring) => {
    ring.addEventListener("click", () => {
        onRingClick(ring);
    });
});
ring3.forEach((ring) => {
    ring.addEventListener("click", () => {
        onRingClick(ring);
    });
});
export async function onRingClick(ring) {
    requestBoardAction(ring.id, getRoomId());
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
body?.addEventListener("touchstart", dragStart, false);
body?.addEventListener("touchend", dragEnd, false);
body?.addEventListener("touchmove", drag, false);
body?.addEventListener("mousedown", dragStart, false);
body?.addEventListener("mouseup", dragEnd, false);
body?.addEventListener("mousemove", drag, false);
