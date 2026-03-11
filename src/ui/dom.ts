export const createGameButton = document.getElementById("host");
export const joinButton = document.getElementById("join");
export const startButton = document.getElementById("startGameButton");
export const createGameMenu = document.getElementById("create");
export const exitButton = document.querySelectorAll(".exitGameButton");
export const timer = document.querySelector(".timeElapsed") as HTMLElement;
export const ring1 = document.querySelectorAll(".ring.ring1");
export const ring2 = document.querySelectorAll(".ring.ring2");
export const ring3 = document.querySelectorAll(".ring.ring3");
export const StatusIndicator = document.querySelector(
  ".statusIndicator circle",
) as HTMLElement;
export const StatusIndicatorGlow = document.querySelector(
  ".statusIndicator",
) as HTMLElement;

export const fadeScreen = document.querySelector(".fadeScreen") as HTMLElement;
export const status = document.querySelector(".status");
export const platform = document.querySelectorAll(".option");
export const cellContainer = document.querySelectorAll(".cellContainer");

export const openModalButtons = document.querySelectorAll(
  "[data-modal-target]",
);
export const closeModalButtons = document.querySelectorAll(
  "[data-close-button]",
);
export const overlay = document.getElementById("overlay");
export const joinOverlay = document.getElementById("joinOverlay");

export const pushPlayerLimit = document.getElementById("pushPlayerLimit");
export const pullPlayerLimit = document.getElementById("pullPlayerLimit");

export const maxPlayers = document.getElementById("maxPlayers");

export const dragableItems = document.querySelectorAll(".cell");
export const dragableContainer = document.getElementById("gameContainer");
export const body = document.body;
export const gameContainer = document.querySelector(
  ".pageLayout",
) as HTMLElement;

if (
  window.location.pathname === "/desktopGame.html" ||
  window.location.pathname === "/mobileGame.html"
) {
  const board = document.querySelector(".otrioBoardInPlay");
  const fullRing = board!.querySelectorAll(".otrioCell");
  console.log(fullRing);

  fullRing.forEach((element) => {
    element.setAttribute("width", `${board!.getAttribute("data-size")}px`!);
  });
}

const gc = document.querySelector(".otrioBoardInPlay") as HTMLElement | null;
const dynamicWarning = document.querySelector(
  ".dynamicWarnings",
) as HTMLElement | null;
const ErrorCodeWarning = document.querySelector(
  ".codeErrorMessage",
) as HTMLElement | null;

ErrorCodeWarning?.addEventListener("animationend", () => {
  ErrorCodeWarning.classList.remove("floatUpFade");
});

gc?.addEventListener("animationend", () => {
  gc.classList.remove("shake");
});
dynamicWarning?.addEventListener("animationend", () => {
  dynamicWarning.classList.remove("active");
});
