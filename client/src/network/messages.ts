import { ws } from "./socket.js";

export function createRoom(roomId: Number) {
  ws.send(
    JSON.stringify({
      action: "create_room",
      id: roomId,
    }),
  );
  console.log(`CLIENT SENDING > create_room`);
}

export function joinRoom(clientId: string | null, roomId: number | null) {
  ws.send(
    JSON.stringify({
      action: "join_room",
      roomId: roomId,
      clientId: clientId,
    }),
  );
  console.log(`CLIENT SENDING > join_room`);
}

export function requestClientId() {
  ws.send(
    JSON.stringify({
      action: "request_client_id",
    }),
  );
  console.log(`CLIENT SENDING > requestiong_client_id`);
}

export function makeMove(move_id: string, roomId: number | null) {
  ws.send(
    JSON.stringify({
      action: "make_move",
      roomId: roomId,
      move_id: move_id,
      color: localStorage.getItem("color"),
    }),
  );

  console.log(`CLIENT SENDING > make_move`);
  console.log(localStorage.getItem("color"));

  if (roomId === null) console.log("no room id");
}

export function requestStartGame(roomId: number | null) {
  ws.send(
    JSON.stringify({
      action: "start_game",
      roomId: roomId,
    }),
  );
}
export function CheckForWin(roomId: number | null, color: string | null) {
  ws.send(
    JSON.stringify({
      action: "check_win",
      roomId: roomId,
      color: color,
    }),
  );
}
