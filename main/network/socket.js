import { colorConversion, getClientId, getRoomId, regenerateBoard, } from "../utils/helpers.js";
import { requestRejoinRoom, requestWinCheck } from "./requests.js";
//export const ws = new WebSocket(`wss://ono-server-production.up.railway.app`);
export const ws = new WebSocket("ws://localhost:8080");
ws.addEventListener("open", () => {
    console.log("Client Connected");
    const clientId = getClientId();
    const roomId = getRoomId();
    if (clientId) {
        ws.send(JSON.stringify({
            action: "identify",
            clientId,
        }));
    }
    if (clientId && roomId) {
        requestRejoinRoom(clientId, roomId, localStorage.getItem("color"));
    }
});
ws.addEventListener("close", () => {
    console.log("Client Disconnected");
});
ws.addEventListener("message", (event) => {
    const request = JSON.parse(event.data);
    console.log("Action received:", request.action);
    switch (request.action) {
        case "request_client_id": {
            localStorage.setItem("clientId", request.clientId);
            console.log("New client id:", request.clientId);
            break;
        }
        case "request_board_update": {
            console.log("Color board update received");
            const ring = document.getElementById(request.ring);
            if (ring) {
                ring.style.stroke = colorConversion(request.color);
                requestWinCheck(getRoomId(), request.color);
                break;
            }
            else
                console.log(request.ring);
            break;
        }
        case "request_start_game":
            localStorage.setItem("color", request.color);
            console.log(`Game has been start. your Color Is: ${localStorage.getItem("color")}`);
            document.getElementById("game__status").innerText = "Game Started";
            break;
        case "request_regenerate_board":
            regenerateBoard(request.board);
            break;
        case "player_has_won":
            alert(`${request.color} has won the game`);
            break;
        default:
            console.warn("Unknown action:", request.action);
    }
});
