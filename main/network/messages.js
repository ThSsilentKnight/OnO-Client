import { logMessageRquests } from "../utils/helpers.js";
import { ws } from "./socket.js";
export function requestNewRoom(roomId) {
    const message = JSON.stringify({
        request: "request_new_room",
        id: roomId,
    });
    ws.send(message);
    logMessageRquests(message);
}
export function requestJoinRoom(clientId, roomId) {
    const message = JSON.stringify({
        request: "request_join_room",
        roomId,
        clientId,
    });
    ws.send(message);
    logMessageRquests(message);
}
export function requestClientId() {
    const message = JSON.stringify({
        request: "request_client_id",
    });
    ws.send(message);
    logMessageRquests(message);
}
export function requestBoardAction(move_id, roomId) {
    const message = JSON.stringify({
        request: "request_board_update",
        roomId,
        move_id,
        color: localStorage.getItem("color"),
    });
    ws.send(message);
    logMessageRquests(message);
}
export function requestStartGame(roomId) {
    const message = JSON.stringify({
        request: "start_game",
        roomId,
    });
    ws.send(message);
    logMessageRquests(message);
}
export function requestWinCheck(roomId, color) {
    const message = JSON.stringify({
        request: "request_check_win",
        roomId,
        color,
    });
    ws.send(message);
    logMessageRquests(message);
}
