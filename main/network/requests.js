import { getGameData, logMessageRequests } from "../utils/helpers.js";
import { ws } from "./socket.js";
/*
 * requestNewRoom - Document
  This function is called when the client hostsa new game
*/
export function requestNewRoom(roomId) {
    const request = JSON.stringify({
        request: "request_new_room",
        id: roomId,
    });
    ws.send(request);
    logMessageRequests(request);
}
/*
 * requestJoinRoom - Document
  This function is called either after a join or creation request
*/
export function requestJoinRoom(clientId, roomId, username) {
    const request = JSON.stringify({
        request: "request_join_room",
        roomId: roomId,
        clientId: clientId,
        username: username,
    });
    console.log(roomId, clientId, username);
    ws.send(request);
    logMessageRequests(request);
}
/*
 * requestRejoinRoom - Document
  When we reload the page, we lose connection with the server websocket, when the connection is
  reestablished, we can use the game state snapshot that we get from requestClientRoomInfo to rejoin
  the room we were in.
*/
export function requestRejoinRoom(clientId, roomId, color, smallRingCount, mediumRingCount, largeRingCount, username) {
    const request = JSON.stringify({
        request: "request_rejoin_room",
        roomId: roomId,
        clientId: clientId,
        color: color,
        small: Number(smallRingCount),
        medium: Number(mediumRingCount),
        large: Number(largeRingCount),
        username: username,
    });
    ws.send(request);
    logMessageRequests(request);
}
/*
 * requestClientId - Document
  Requesting Client ID from the server, when the client has lost the data
*/
export function requestClientId() {
    const request = JSON.stringify({
        request: "request_client_id",
    });
    ws.send(request);
    logMessageRequests(request);
}
/*
 * requestBoardAction - Document
  Main request line for taking action on the board
*/
export function requestBoardAction(move_id, roomId) {
    const request = JSON.stringify({
        request: "request_board_action",
        roomId: roomId,
        move_id: move_id,
        color: getGameData("color"),
    });
    ws.send(request);
    logMessageRequests(request);
}
/*
 * RequestStartGame - Document
  Client requesting to start the game there are in
*/
export function requestStartGame(roomId) {
    const request = JSON.stringify({
        request: "request_start_game",
        roomId: roomId,
    });
    ws.send(request);
    logMessageRequests(request);
}
/*
 * requestWinCheck - Document
  After a client requests a board update, we need to check if that client won the game
*/
export function requestWinCheck(roomId, color) {
    const request = JSON.stringify({
        request: "request_win_check",
        roomId: roomId,
        color: color,
    });
    ws.send(request);
    logMessageRequests(request);
}
/*
 * validateRoomId - Document
  When the client attempts to join, we need to make sure there is a game to join in the first place.

! This function should always be used with "await".
 */
export function validateRoomId(roomId) {
    const request = JSON.stringify({
        request: "request_validate_room",
        roomId,
    });
    ws.send(request);
    logMessageRequests(request);
    return new Promise((resolve, reject) => {
        const handleMessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.action !== "validate_room")
                    return;
                ws.removeEventListener("message", handleMessage);
                resolve(Boolean(response.status));
            }
            catch (err) {
                ws.removeEventListener("message", handleMessage);
                reject(err);
            }
        };
        ws.addEventListener("message", handleMessage);
    });
}
/*
* requestClientRoomInfo - Document
In this server-client relationship, we want the bulk of infomation to be stored and handle on the server.
This function helps us stay up to date with the state of the game, we are basically asking for a snapshot
of the game state and useing that infomation for varuis tasks

! This function should always be used with "await".
*/
export function requestClientRoomInfo(roomId) {
    const request = JSON.stringify({
        request: "request_client_room_info",
        roomId,
    });
    return new Promise((res, rej) => {
        const handleMessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.action !== "send_client_room_info")
                    return;
                ws.removeEventListener("message", handleMessage);
                sessionStorage.setItem("gameData", event.data);
                res(response);
            }
            catch (err) {
                ws.removeEventListener("message", handleMessage);
                rej(err);
            }
        };
        ws.addEventListener("message", handleMessage);
        ws.send(request);
        logMessageRequests(request);
    });
}
export function leaveGameRequest(roomId) {
    const request = JSON.stringify({
        request: "request_leave_game",
        roomId: roomId,
    });
    ws.send(request);
    logMessageRequests(request);
}
