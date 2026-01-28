import { logMessageRequests } from "../utils/helpers.js";
import { ws } from "./socket.js";
export function requestNewRoom(roomId) {
    const request = JSON.stringify({
        request: "request_new_room",
        id: roomId,
    });
    ws.send(request);
    logMessageRequests(request);
}
export function requestJoinRoom(clientId, roomId) {
    const request = JSON.stringify({
        request: "request_join_room",
        roomId: roomId,
        clientId: clientId
    });
    ws.send(request);
    logMessageRequests(request);
}
export function requestRejoinRoom(clientId, roomId, color) {
    const request = JSON.stringify({
        request: "request_rejoin_room",
        roomId: roomId,
        clientId: clientId,
        color: color,
    });
    ws.send(request);
    logMessageRequests(request);
}
export function requestClientId() {
    const request = JSON.stringify({
        request: "request_client_id",
    });
    ws.send(request);
    logMessageRequests(request);
}
export function requestBoardAction(move_id, roomId) {
    const request = JSON.stringify({
        request: "request_board_action",
        roomId: roomId,
        move_id: move_id,
        color: localStorage.getItem("color"),
    });
    ws.send(request);
    logMessageRequests(request);
}
export function requestStartGame(roomId) {
    const request = JSON.stringify({
        request: "request_start_game",
        roomId: roomId,
    });
    ws.send(request);
    logMessageRequests(request);
}
export function requestWinCheck(roomId, color) {
    const request = JSON.stringify({
        request: "request_win_check",
        roomId: roomId,
        color: color,
    });
    ws.send(request);
    logMessageRequests(request);
}
