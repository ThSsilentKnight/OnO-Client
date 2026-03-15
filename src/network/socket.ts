import { status, StatusIndicator, StatusIndicatorGlow } from "../ui/dom.js";
import {
  displayWarning,
  getClientId,
  getRoomId,
} from "../utils/helpers.js";
import {
  boardUpdateResponse,
  declineStartGameRequest,
  decreaseRingSize,
  leaveGameResponse,
  mapClientsResponse,
  playerHasWonResponse,
  regenerateBoardResponse,
  ringIdUpdate,
  startGameResponse,
  updateTurnIndicator,
  validateRoom,
} from "./requestResponse.js";
import { requestRejoinRoom } from "./requests.js";
export const ws = new WebSocket(`wss://api.silentknightssh.com`);
//export const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", async () => {
  connectClientSetUp();
});

ws.addEventListener("close", () => {
  disconnectClient();
});

ws.addEventListener("message", async (event) => {
  const request = JSON.parse(event.data);
  console.log("Request received:", request.action);

  switch (request.action) {
    case "request_client_id": {
      sessionStorage.setItem("clientId", request.clientId);
      break;
    }

    case "request_board_update": {
      boardUpdateResponse(request);
      break;
    }

    case "request_start_game":
      await startGameResponse();
      break;

    case "decline_start_game_request":
      declineStartGameRequest(request);
      break;

    case "request_regenerate_board":
      await regenerateBoardResponse(request);
      break;

    case "player_has_won":
      await playerHasWonResponse(request);
      break;

    case "request_decrease_ring_size":
      decreaseRingSize(request);
      break;

    case "request_ring_id_update":
      ringIdUpdate(request);
      break;

    case "not_enough_rings":
      displayWarning("You've Run out of this size");
      break;

    case "ring_taken":
      displayWarning("This Ring Is Already in Play");
      break;

    case "premature_placement":
      displayWarning("It Is Currently Not Your Turn");
      break;

    case "game_started_status":
      document.getElementById("overlay")?.classList.remove("active");
      break;

    case "validate_room":
      validateRoom(request);
      break;

    case "send_client_room_info":
      // Code for this function is running in
      // requests.ts/js | data gets pushed to session storage
      break;

    case "send_map_clients":
      mapClientsResponse(request);
      break;

    case "send_leave_game":
      leaveGameResponse();
      break;

    case "request_profile_update":
      updateTurnIndicator(request.color);
      break;

    default:
      console.warn("Unknown action:", request.action);
  }
});

function connectClientSetUp() {
  if (status && StatusIndicator && StatusIndicatorGlow) {
    status.innerHTML = "Connected";

    StatusIndicator.setAttribute("fill", "#78B159");
    StatusIndicatorGlow.style.setProperty("--status-color", "#78B159");
  } else {
    console.log("no status box");
  }

  const data = sessionStorage.getItem("gameData");

  const clientId = getClientId();
  const roomId = getRoomId();

  ws.send(
    JSON.stringify({
      request: "identify",
      clientId,
    }),
  );
  console.log("Client Connected");

  if (!data || !clientId || !roomId) return;

  const parsed = JSON.parse(data);

  requestRejoinRoom(
    clientId,
    roomId,
    parsed.color,
    parsed.smallRings,
    parsed.mediumRings,
    parsed.largeRings,
    sessionStorage.getItem("username")!,
  );
}
function disconnectClient() {
  console.log("Client Disconnected");
  if (status && StatusIndicator && StatusIndicatorGlow) {
    status!.innerHTML = "Disconnected";
    StatusIndicator.setAttribute("fill", "#c12c2c");
    StatusIndicatorGlow.style.setProperty("--status-color", "#b94646");
  } else {
    console.log("no status box");
  }
}

/*
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⢛⣛⣩⣭⣭⣭⣭⣙⣩⣭⣭⣭⣭⣙⣛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⣋⣵⣶⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡷⣦⣙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⣴⣿⣿⡟⡿⢻⣿⣿⡟⣿⠸⣿⡙⣿⣿⣇⢻⣿⣿⣿⣿⣿⣷⣍⡻⣷⣬⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢣⣶⢿⡿⢋⠍⢰⠃⣾⣿⣿⢡⣿⡆⢿⣧⠹⣿⣿⣆⢻⣿⣿⣿⣿⣿⣿⣿⣦⡹⣷⣌⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⣴⡿⡡⠋⡴⢣⠢⠃⣼⣿⣿⢃⣾⣿⡇⣌⠻⣷⡈⠻⢿⣦⡙⢿⣿⣿⣿⣿⣿⣿⣷⣌⢿⣷⡜⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢋⣼⡟⠁⠄⣨⠞⡁⢀⣾⣿⡿⢃⣾⣿⢏⣴⣿⣷⣮⣙⡂⠄⠨⢙⡂⠙⠻⢿⣿⣿⣿⣿⣿⣧⡙⢿⣆⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣸⣿⠃⣴⣶⣿⠖⣣⣾⣿⠟⣡⡾⠟⣫⣼⣿⣿⣿⣿⣿⣷⣶⣤⣼⣷⣶⣦⣬⣙⡻⢿⣿⣿⣿⣷⣜⠿⣎⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢠⣿⣯⣼⡿⢟⣡⣾⠿⢛⣡⣤⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣬⡙⣿⣿⣿⣷⣶⣆⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⣾⣿⣿⣦⣤⣤⢀⣶⣾⢛⡭⠐⠒⠒⠬⡛⢿⣿⣿⢸⣿⣿⡌⣿⣿⡿⢋⠅⠒⠐⠒⢬⡝⢿⣷⡘⣿⣿⣿⣿⣿⣷⡜⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⢃⣾⣿⡡⡏⠀⠐⠀⠂⠀⣈⣼⣿⡇⢾⣿⣿⡆⢿⣿⣧⣀⠀⠰⠠⠅⠀⢹⡎⣿⣷⡘⣿⣿⣿⣿⣿⡿⠷⠬⢙⢻⢿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⡏⣼⣿⣿⣿⡿⠶⠶⠶⢞⣫⣼⣿⠟⣡⣭⣶⣦⣽⣌⠻⣿⣦⣙⡲⠶⠶⠶⢿⣿⣿⣿⣧⠸⣿⣿⣿⣿⣿⣦⣤⣭⡭⢀⣿⣿⣿⣿⣿
⣿⣿⡟⢻⣿⣿⣿⣿⡏⣸⣿⣿⣿⡿⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢋⣴⡿⠓⠹⣿⡏⠙⠿⢷⣎⢻⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢻⣿⣿⣿⣿⣿⡟⢉⣒⡁⣼⣿⣿⣿⡿
⣿⣿⣷⠠⣉⡛⠿⢛⣠⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⡿⢋⣵⣿⣦⣛⣠⣴⣾⣿⣷⣶⣤⣛⣛⣼⣿⣦⣙⢿⣿⣿⣿⣿⣿⣿⣷⢸⣿⣿⣿⣿⣿⣿⣿⡿⢡⣿⣿⣿⡿⠞
⣿⠋⢛⠷⠍⠛⢻⣿⣿⣿⣿⣿⣿⢰⣿⣿⣿⣿⣿⡿⣫⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣍⢻⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⡿⣡⣾⣿⣿⣿⣿⡌
⣿⠀⠦⡻⢿⣿⣿⣿⣿⣿⣿⣿⣟⢸⣿⣿⣿⣿⢏⣴⣿⣿⣿⠿⠟⠛⣛⡛⠉⠉⣉⠉⠉⢛⣛⠛⡛⠿⠿⣿⣿⣿⣷⡹⣿⣿⣿⣿⢸⣿⣿⣿⣿⠟⣫⠴⠟⣻⣿⣿⣿⡿⠁
⣿⣆⠳⣦⣤⣽⣿⣿⣿⣿⣿⣿⣗⢸⣿⣿⣿⠇⣾⣿⡟⠋⠀⣬⢡⣶⣎⣰⣿⣿⣀⣾⣿⣷⣱⣶⡎⣥⡔⡂⢍⢿⣿⣷⢹⣿⣿⡟⢸⣿⣿⠿⣷⡶⠖⣫⣴⣿⡿⠏⠁⠀⠒
⣿⣿⠣⠜⠻⢿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣿⡏⢸⣿⡏⢠⢸⢇⣿⢻⣿⣿⣿⣿⣿⡛⣿⣿⣿⢿⣿⠿⣿⣇⣿⢈⠂⢹⣿⡌⣿⣿⡇⣿⡿⠛⠦⠄⣀⣿⡿⠉⠁⠀⠀⠀⠀⠀
⣿⣿⣷⣬⡐⠻⢿⢿⣿⣿⣿⣿⣿⡆⢻⣿⣿⢸⣿⠀⢆⢆⠣⠍⠀⠀⠀⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢒⣋⠟⡄⠈⣿⡇⣿⡿⢰⡿⢁⣶⣤⣍⠻⠁⠀⠀⠀⠀⣀⣠⣀⣀
⣿⣿⣿⣿⣷⣀⠨⢼⣿⣿⣿⣿⣿⣧⠸⣿⣿⢸⣿⠀⠘⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠐⠁⠀⣿⢣⣿⠇⡼⢃⣼⣿⣿⣿⣦⡐⢶⣶⣴⣶⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣷⣶⣤⣭⣭⣄⠙⢿⣆⢻⣿⡌⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣯⣼⡿⢀⣴⣿⣿⣿⣿⡏⢿⣷⣄⡙⢾⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢠⡆⢲⣬⡈⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⡄⢿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠟⣠⣾⣿⣷⠸⣿⡇⢻⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⢠⣿⣿⣿⣿⣿⣿⡏⣼⣿⣿⣿⡇⠸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⠛⠰⣿⣿⣿⣿⣆⢹⣿⠸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡟⣸⣿⣿⣿⣿⣿⡟⣰⣿⣿⣿⡿⢁⣷⣤⡹⣿⣿
⣿⣿⣿⣿⡟⢉⣴⣾⣆⠹⣿⣿⣿⣿⣆⠻⡆⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠇⣿⣿⣿⣿⡿⢋⣴⣿⣿⣿⠟⣠⣾⣿⣿⣷⡌⢿
⣿⣿⣿⠋⣴⣿⣿⣿⣿⣷⡈⠻⣿⣿⣿⣿⣧⢸⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⢰⣿⣿⣿⣿⣷⣿⣿⣿⡿⢃⣴⣿⣿⣿⣿⣿⣿⡌
⣿⣿⢃⣾⣿⣿⣿⣿⣿⣿⣿⣦⡈⠻⣿⣿⣿⡈⣿⣿⣧⢠⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠴⠆⣾⣿⡏⣸⣿⣿⣿⣿⣿⣿⡿⢋⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⠇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣌⠻⢿⡇⢿⣿⣿⠰⢿⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠇⣿⣿⡇⣿⣿⣿⣿⣿⡿⢋⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣦⢸⣿⣿⡄⢿⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣛⠻⢸⣿⣿⢁⣿⣿⣿⠟⣁⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⣿⣿⣇⠙⣫⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠿⡇⣸⣿⡟⢸⠿⢋⣥⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠇⣿⣿⣿⣿⣿⣆⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢻⣿⣿⡄⠿⣯⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡻⣿⢀⣿⣿⡏⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⣿⣿⣿⣿⣿⣿⡀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢸⣿⣿⣇⢰⣿⢗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢴⣧⠙⢸⣿⣿⠃⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠰⣿⣿⣿⣿⣿⣿⣧⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⣿⣿⣿⣆⢣⣿⢃⡀⠀⠀⠀⠀⠀⠀⣀⢰⣧⠻⢡⣿⣿⣿⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠘⣿⣿⣿⣿⣿⣿⣿⡆⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢿⣿⣯⠻⣦⠉⢿⡇⣿⡷⣶⢲⣿⡞⣿⠺⠟⣠⢿⣿⣿⡇⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠈⣿⣿⣿⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣿⣷⡙⢷⣦⣔⣈⠉⠛⠩⠛⢁⣉⣴⡾⢋⣼⣿⣟⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡄⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⢿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢻⣿⣿⣿⣷⣭⣛⠻⠿⠿⠿⠿⠿⢛⣫⣴⣿⣿⣿⠇⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠹⣿⣿⣿⣿⣿⣿⣿⣿⡌⠿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⢿⢿⣿⣿⣿⡿⠏⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
*/
