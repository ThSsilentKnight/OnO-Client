import { createRoom, joinRoom } from "./network/messages.js";

import { createGameBtn, joinBtn, startBtn } from "./ui/dom.js";
import "./render/presistant.js";
import { generateRoomId, getClientId } from "./helpers.js";

export function getRoomId() {
  const hash = window.location.hash;
  if (hash.startsWith("#id=")) {
    const roomId = hash.replace("#id=", "");
    localStorage.setItem("currentRoom", roomId);
    return Number(roomId);
  } else {
    console.log("You are not in a room");
    return null;
  }
}

// create game
createGameBtn?.addEventListener("click", () => {
  const roomId = generateRoomId();

  localStorage.setItem("currentRoom", String(roomId));

  createRoom(roomId);
  joinRoom(getClientId(), roomId);

  window.location.assign(`game.html#id=${roomId}`);
  localStorage.removeItem("color");
});

// join game
joinBtn?.addEventListener("click", () => {
  const code = prompt("enter code", "Code here");
  if (code) {
    joinRoom(getClientId(), Number(code));
    localStorage.removeItem("color");

    localStorage.setItem("currentRoom", String(code)); // CHANGE LATER!
    window.location.assign(
      `game.html#id=${localStorage.getItem("currentRoom")}`,
    );
  }
});
