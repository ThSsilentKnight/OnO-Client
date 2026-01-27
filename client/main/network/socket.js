import { getRoomId } from "../app.js";
import { getClientId, regenerateBoard } from "../helpers.js";
import { CheckForWin } from "./messages.js";
const protocol = location.protocol === "https:" ? "wss" : "ws";
export const ws = new WebSocket(`wss://online-otrio-project-production.up.railway.app`);
ws.addEventListener("open", () => {
    console.log("we are connected");
    const clientId = getClientId();
    const roomId = getRoomId();
    if (clientId) {
        ws.send(JSON.stringify({
            action: "identify",
            clientId,
        }));
    }
    if (clientId && roomId) {
        ws.send(JSON.stringify({
            action: "rejoin_room",
            clientId,
            roomId,
            color: localStorage.getItem("color"),
        }));
    }
});
ws.addEventListener("close", () => {
    console.log("Client left the room");
});
ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    console.log("CLIENT RECEIVED:", message);
    switch (message.action) {
        case "send_client_id": {
            localStorage.setItem("clientId", message.clientId);
            console.log("New client id:", message.clientId);
            break;
        }
        case "color_board_update": {
            console.log("Color board update received");
            const ring = document.getElementById(message.ring);
            if (ring) {
                ring.style.stroke = colorConversion(message.color);
                CheckForWin(getRoomId(), message.color);
            }
            else
                console.log(message.ring);
            break;
        }
        case "start_game":
            localStorage.setItem("color", message.color);
            console.log(`Game has been start. your Color Is: ${localStorage.getItem("color")}`);
            document.getElementById("game__status").innerText = "Game Started";
            break;
        case "regenerate_board":
            regenerateBoard(message.board);
            break;
        case "player_has_won":
            alert(`${message.color} has won the game`);
            break;
        default:
            console.warn("Unknown action:", message.action);
    }
});
export function colorConversion(color) {
    switch (color) {
        case "PURPLE":
            return "rgb(200, 25, 200)";
        case "BLUE":
            return "rgb(20, 130, 200)";
        case "GREEN":
            return "rgb(20, 230, 50)";
        case "RED":
            return "rgb(230, 25, 25)";
        default:
            return "black";
    }
}
