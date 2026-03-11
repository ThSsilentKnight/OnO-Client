import { leaveGameRequest, requestClientRoomInfo, requestJoinRoom, requestNewRoom, requestStartGame, validateRoomId, } from "../network/requests.js";
import { changeClientWindow, closeModal, drag, dragEnd, dragStart, generateRoomId, getClientId, getRoomId, onReloadFunction, openModal, restart, } from "../utils/helpers.js";
import { gameContainer, closeModalButtons, createGameButton, exitButton, joinButton, openModalButtons, overlay, startButton, platform, } from "./dom.js";
/*
This function is run everytime the page realods
*/
onReloadFunction();
/*
  TODO Add Comments here
*/
platform.forEach((button) => {
    button.addEventListener("click", () => {
        const platformType = button.classList[1];
        if (platformType === "mobile") {
            sessionStorage.setItem("platform", "mobile");
        }
        else if (platformType === "desktop") {
            sessionStorage.setItem("platform", "desktop");
        }
    });
});
/*
  TODO Add Comments here
*/
createGameButton?.addEventListener("click", async () => {
    const roomId = generateRoomId();
    const username = (createGameButton?.parentElement?.querySelector(".username")).value;
    if (username.length < 1) {
        const modal = document.getElementById("hostSettingsModal");
        const errorMessage = document.querySelector(".creationErrorMessage");
        if (errorMessage && modal) {
            restart(errorMessage, "floatUpFade");
            restart(modal, "shake");
            errorMessage.classList.add("floatUpFade");
            errorMessage.textContent = "Please Enter A Username";
            modal?.classList.add("shake");
        }
        return;
    }
    requestNewRoom(roomId);
    requestJoinRoom(getClientId(), roomId, username);
    sessionStorage.setItem("username", username);
    console.log(username);
    await requestClientRoomInfo(roomId);
    changeClientWindow("game", String(roomId));
});
/*
  TODO Add Comments here
*/
joinButton?.addEventListener("click", async () => {
    const roomId = Number(document.getElementById("roomId").value);
    const username = (joinButton?.parentElement?.querySelector(".username")).value;
    if (username.length < 1) {
        const modal = document.getElementById("codeModal");
        const errorMessage = document.querySelector(".codeErrorMessage");
        if (errorMessage && modal) {
            restart(errorMessage, "floatUpFade");
            restart(modal, "shake");
            errorMessage.classList.add("floatUpFade");
            errorMessage.textContent = "Please Enter A Username";
            modal?.classList.add("shake");
        }
        return;
    }
    if (await validateRoomId(roomId)) {
        requestJoinRoom(getClientId(), Number(roomId), username);
        sessionStorage.setItem("username", username);
        await requestClientRoomInfo(roomId);
        changeClientWindow("game", String(roomId));
    }
});
/*
  TODO Add Comments here
*/
exitButton?.forEach((b) => b.addEventListener("click", () => {
    leaveGameRequest(getRoomId());
    // TODO Tell the server we are going back to the main page
    // TODO we should kill this room
}));
/*
  TODO Add Comments here
*/
startButton?.addEventListener("click", () => {
    console.log("game started");
    requestStartGame(getRoomId());
});
/*
  TODO Add Comments here
*/
gameContainer?.addEventListener("touchstart", dragStart, { passive: false });
gameContainer?.addEventListener("touchend", dragEnd);
gameContainer?.addEventListener("touchmove", drag, { passive: false });
gameContainer?.addEventListener("mousedown", dragStart);
gameContainer?.addEventListener("mouseup", dragEnd);
gameContainer?.addEventListener("mousemove", drag);
/*
  TODO Add Comments here
*/
overlay?.addEventListener("click", () => {
    if (!overlay?.classList.contains("deny")) {
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach((modal) => {
            closeModal(modal);
        });
    }
});
/*
  TODO Add Comments here
*/
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
/*
  TODO Add Comments here
*/
closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});
