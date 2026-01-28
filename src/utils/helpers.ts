import { requestClientId } from "../network/requests.js";
import { dummyRing1, overlay } from "../ui/dom.js";

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

export function generateRoomId() {
  return Math.floor(Math.random() * 90000 + 1000);
}

export function getClientId() {
  const clientId = localStorage.getItem("clientId");

  console.log(
    `Your clientId is ${clientId} ::: Your current room ${localStorage.getItem("currentRoom")} Color: ${localStorage.getItem("color")}`,
  );

  if (clientId === "null" || !clientId) {
    console.log("No client id found. requesting new client id");
    requestClientId();
  }
  return clientId;
}
export function regenerateBoard(board: (string | null)[]) {
  let rings = 0;
  let boardMap: { color: string | null; number: number }[] = [];
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
      ring!.style.stroke = colorConversion(e.color);
    }
  });
}
export function logMessageRequests(data: string) {
  const message = JSON.parse(data);
  console.log(`Request sent: ${message.request}`);
}
export function openModal(modal: Element | null) {
  if (modal === null) return;
  modal.classList.add("active");
  overlay?.classList.add("active");
  console.log(modal.classList);
}
export function closeModal(modal: Element | null) {
  if (modal === null) return;
  modal.classList.remove("active");
  overlay?.classList.remove("active");
}
export function colorConversion(color: string): string {
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

export function dragStart(e: MouseEvent | TouchEvent) {
  console.log("start drag");
}

export function dragEnd(e: MouseEvent | TouchEvent) {
  console.log("end drag");
}

export function drag(e: MouseEvent | TouchEvent) {}
console.log("dragging");

export function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
  console.log("move Item");
}
