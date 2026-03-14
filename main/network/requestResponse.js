import { timer } from "../ui/dom.js";
import { changeClientWindow, closeModal, colorConversion, colorToElement, gameTimer, getGameData, getRoomId, mapPlayerVisuals, openModal, regenerateBoard, restart, } from "../utils/helpers.js";
import { requestClientRoomInfo, requestWinCheck } from "./requests.js";
export function boardUpdateResponse(request) {
    const ring = document.getElementById(request.ring);
    if (ring) {
        ring.style.stroke = colorConversion(request.color);
        requestWinCheck(getRoomId(), request.color);
    }
}
export function sendMapClients(request) {
    const clientIds = request.clientIds;
    const colors = request.colors;
    const usernames = request.usernames;
    mapPlayerVisuals(clientIds, colors, usernames);
}
export function leaveGame() {
    sessionStorage.removeItem("gameData");
    console.log("exited_game");
    changeClientWindow("home");
    gameTimer(timer, "stop");
}
export function decreaseRingSize(request) {
    if (request.size === "small") {
        let cellCount = document.querySelector(".smallCellCount");
        if (cellCount) {
            let index = cellCount.textContent.split("")[0];
            index = String(Number(index) - 1);
            cellCount.textContent = `${index}X`;
        }
    }
    if (request.size === "medium") {
        let cellCount = document.querySelector(".mediumCellCount");
        if (cellCount) {
            let index = cellCount.textContent.split("")[0];
            index = String(Number(index) - 1);
            cellCount.textContent = `${index}X`;
        }
    }
    if (request.size === "large") {
        let cellCount = document.querySelector(".largeCellCount");
        if (cellCount) {
            let index = cellCount.textContent.split("")[0];
            index = String(Number(index) - 1);
            cellCount.textContent = `${index}X`;
        }
    }
}
export function ringIdUpdate(request) {
    const ring = document.getElementById(request.moveId);
    ring?.classList.add("played");
}
export function validateRoom(request) {
    const modal = document.getElementById("codeModal");
    const errorMessage = document.querySelector(".codeErrorMessage");
    if (errorMessage && modal) {
        restart(errorMessage, "floatUpFade");
        restart(modal, "shake");
        errorMessage.classList.add("floatUpFade");
        errorMessage.textContent = request.reason;
        modal?.classList.add("shake");
    }
    console.log(request.reason);
    // More code for this function is running in requests.ts/js | handling the true or false status
}
export function mapClientsResponse(request) {
    const clientIds = request.clientIds;
    const colors = request.colors;
    const usernames = request.usernames;
    mapPlayerVisuals(clientIds, colors, usernames);
}
export function leaveGameResponse() {
    sessionStorage.removeItem("gameData");
    console.log("exited_game");
    changeClientWindow("home");
    gameTimer(timer, "stop");
}
export async function startGameResponse() {
    await requestClientRoomInfo(getRoomId());
    document.documentElement.style.setProperty("--ring-color", colorConversion(getGameData("color") || "red"));
    gameTimer(timer, "start");
    closeModal(document.getElementById("waitingForStart"));
    console.log(`Game has been start. your Color Is: ${getGameData("color")}`);
}
export function declineStartGameRequest(request) {
    console.log(request.reason);
    const creationModal = document.getElementById("waitingForStart");
    const startErrorMessage = document.querySelector(".startErrorMessage");
    if (startErrorMessage && creationModal) {
        restart(startErrorMessage, "floatUpFade");
        restart(creationModal, "shake");
        startErrorMessage.classList.add("floatUpFade");
        startErrorMessage.textContent = request.reason;
        creationModal?.classList.add("shake");
    }
}
export async function regenerateBoardResponse(request) {
    document.documentElement.style.setProperty("--ring-color", colorConversion(getGameData("color") || "rba(10, 10, 10)"));
    const gameState = JSON.parse(sessionStorage.getItem("gameData"));
    if (gameState === true)
        closeModal(document.getElementById("waitingForStart"));
    regenerateBoard(request.board);
    await requestClientRoomInfo(getRoomId());
}
export async function playerHasWonResponse(request) {
    document.querySelector(".gameWinInfo").textContent =
        `${request.username} has won the game`;
    document.querySelector(".gameWinInfo").style.color =
        colorConversion(request.color);
    gameTimer(timer, "stop");
    openModal(document.getElementById("gameEnded"));
    await requestClientRoomInfo(getRoomId());
}
export function updateTurnIndicator(color) {
    document.querySelectorAll(".profile").forEach((e) => {
        e.classList.remove("active");
    });
    const colorsInGame = sessionStorage.getItem("colorMap");
    if (!colorsInGame)
        return;
    console.log(colorsInGame);
    console.log(color);
    console.log(colorToElement.get(color));
    if (colorsInGame.includes(color)) {
        const targetColor = colorToElement.get(color);
        if (!targetColor) {
            return;
        }
        targetColor.classList.add("active");
        document.documentElement.style.setProperty("--indicator-color", colorConversion(color || "rba(10, 10, 10)"));
    }
}
