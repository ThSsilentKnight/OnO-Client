import { requestClientId } from "./network/messages.js";
import { colorConversion } from "./network/socket.js";
export function generateRoomId() {
    return Math.floor(Math.random() * 90000 + 1000);
}
export function getClientId() {
    const clientId = localStorage.getItem("clientId");
    console.log(`Your clientId is ${clientId} ::: Your current room ${localStorage.getItem("currentRoom")} Color: ${localStorage.getItem("color")}`);
    if (clientId === "null" || !clientId) {
        console.log("No client id found. requesting new client id");
        requestClientId();
    }
    return clientId;
}
export function regenerateBoard(board) {
    let rings = 0;
    let boardMap = [];
    board.forEach((ring) => {
        rings++;
        boardMap.push({ color: ring, number: rings });
        if (ring) {
        }
    });
    console.log(boardMap);
    boardMap.forEach((e) => {
        if (e.color) {
            const ring = document.getElementById(String(e.number - 1));
            ring.style.stroke = colorConversion(e.color);
        }
    });
}
