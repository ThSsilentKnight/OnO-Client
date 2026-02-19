import { requestBoardAction, requestJoinRoom, requestNewRoom, requestStartGame, } from "../network/requests.js";
import { closeModal, drag, dragEnd, dragStart, generateRoomId, getClientId, getRoomId, openModal, } from "../utils/helpers.js";
import { body, closeModalButtons, createGameBtn, joinBtn, maxPlayers, openModalButtons, overlay, pullPlayerLimit, pushPlayerLimit, ring1, ring2, ring3, startBtn, } from "./dom.js";
// Game Creation
createGameBtn?.addEventListener("click", () => {
    const roomId = generateRoomId();
    console.log("click");
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
body?.addEventListener("touchstart", dragStart, false);
body?.addEventListener("touchend", dragEnd, false);
body?.addEventListener("touchmove", drag, false);
body?.addEventListener("mousedown", dragStart, false);
body?.addEventListener("mouseup", dragEnd, false);
body?.addEventListener("mousemove", drag, false);
overlay?.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach((modal) => {
        closeModal(modal);
    });
});
openModalButtons.forEach((button) => {
    const el = button;
    el.addEventListener("click", () => {
        const modalTarget = el.dataset.modalTarget;
        if (modalTarget) {
            const modal = document.querySelector(modalTarget);
            openModal(modal);
        }
    });
});
closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});
let limit = Number(maxPlayers?.textContent);
pushPlayerLimit?.addEventListener("click", () => {
    if (limit > 0 && limit <= 3) {
        maxPlayers?.classList.remove("hop");
        void maxPlayers?.offsetWidth;
        maxPlayers?.classList.add("hop");
        limit++;
        if (maxPlayers) {
            maxPlayers.textContent = String(limit);
        }
    }
    else {
        maxPlayers?.classList.remove("shake");
        void maxPlayers?.offsetWidth;
        maxPlayers?.classList.add("shake");
    }
});
pullPlayerLimit?.addEventListener("click", () => {
    if (limit >= 2 && limit <= 4) {
        maxPlayers?.classList.remove("hop");
        void maxPlayers?.offsetWidth;
        maxPlayers?.classList.add("hop");
        limit--;
        if (maxPlayers) {
            maxPlayers.textContent = String(limit);
        }
    }
    else {
        maxPlayers?.classList.remove("shake");
        void maxPlayers?.offsetHeight;
        maxPlayers?.classList.add("shake");
    }
});
