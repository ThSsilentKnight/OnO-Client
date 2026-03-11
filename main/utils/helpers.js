import { requestBoardAction, requestClientId, requestClientRoomInfo, } from "../network/requests.js";
import { dragableItems, fadeScreen, overlay, timer } from "../ui/dom.js";
/*
  * File Global Variables
  I tried to avoid these but it works so I'm not complaining
 */
let active = false;
let initialX = 0;
let initialY = 0;
let currentElement;
let pointer = { x: 0, y: 0 };
let timerInterval = null;
/*
  * getRoomId - Document
  This gets the current room we are in by grapping it from the url
  I acknowledge that this is a bad/unreliable way to handle room IDs
  but honestly I'm ok with that.
 */
export function getRoomId() {
    const hash = window.location.hash;
    if (hash.startsWith("#id=")) {
        const roomId = hash.replace("#id=", "");
        return Number(roomId);
    }
    else {
        console.log("You are not in a room");
        return null;
    }
}
/*
  * generateRoomId - Document
  Simply geting a random number - yea not a good way for room ID indexing, let's continue.
*/
export function generateRoomId() {
    return Math.floor(Math.random() * 90000 + 1000);
}
/*
  * getClientId - Document
  When the client first opens the website, we ask the server if we already have a client ID
  if not we ask the server for one. The server gives us back a UUID
*/
export function getClientId() {
    const clientId = sessionStorage.getItem("clientId");
    if (clientId === "null" || !clientId) {
        console.log("No client id found. requesting new client id");
        requestClientId();
    }
    return clientId;
}
/*
  * regenerateBoard - Document
  Simply geting a random number - yea not a good way for room ID indexing, let's continue.
*/
export function regenerateBoard(board) {
    let rings = 0;
    let boardMap = [];
    board.forEach((ring) => {
        rings++;
        boardMap.push({ color: ring, number: rings });
        if (ring) {
        }
    });
    boardMap.forEach((e) => {
        if (e.color) {
            const ring = document.getElementById(String(e.number - 1));
            ring.style.stroke = colorConversion(e.color);
        }
    });
}
/*
  * logMessageRequests - Document
  For the sake of debugging we log everything the client sends here
*/
export function logMessageRequests(data) {
    const message = JSON.parse(data);
    console.log(`Request sent: ${message.request}`);
}
/*
  * openModal - Document
  We use this function for opening multiple modals
*/
export function openModal(modal) {
    if (modal === null)
        return;
    modal.classList.add("active");
    overlay?.classList.add("active");
}
/*
  * closeModal - Document
  We use this function for closing multiple modals
*/
export function closeModal(modal) {
    if (modal === null)
        return;
    modal.classList.remove("active");
    overlay?.classList.remove("active");
}
/*
  * colorConversion - Document
  The server stores colors as strings, e.g: PURPLE, BLUE. this function takes
  that and returns the respective rgb colors
*/
export function colorConversion(color) {
    switch (color) {
        case "PURPLE":
            return "rgb(200, 25, 200)";
        case "BLUE":
            return "rgb(20, 130, 200)";
        case "GREEN":
            return "rgb(54, 205, 77)";
        case "RED":
            return "rgb(230, 25, 25)";
        default:
            return "black";
    }
}
/*
  * cloneCell - Document
  Probs the dumbest way to clone an element but hey, it works.
*/
function cloneCell(source, x, y) {
    const clone = source.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("draggable", "false");
    clone.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    clone.style.transformOrigin = "center";
    clone.style.transition = "transform 0.05s ease";
    clone.style.position = "fixed";
    clone.style.left = `calc(${x}px - 40px)`;
    clone.style.top = `calc(${y}px - 40px)`;
    clone.style.pointerEvents = "none";
    clone.id = source.id;
    clone.classList.add("dragging");
    document.body.appendChild(clone);
    return clone;
}
/*
  * dragStart - Document
  These drag functions are used for the Drag n' Drop functionality of the each ring.
  Here we clone the element, and set the element selected to the cloned Element
*/
export function dragStart(e) {
    if (Array.from(dragableItems).includes(e.target)) {
        active = true;
        const source = e.target;
        const [clientX, clientY] = getClientPointerPos(e);
        currentElement = cloneCell(source, clientX, clientY);
        if (currentElement) {
            e.preventDefault();
            if (e instanceof TouchEvent && e.type === "touchstart") {
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            }
            if (e instanceof MouseEvent) {
                initialX = e.clientX;
                initialY = e.clientY;
            }
        }
    }
}
/*
  * drag - Document
  Here we basically just teleport the selected clone element to the pointer position
*/
export function drag(e) {
    if (currentElement) {
        e.preventDefault();
    }
    if (active && currentElement) {
        const [clientX, clientY] = getClientPointerPos(e);
        let pointerX = clientX - initialX;
        let pointerY = clientY - initialY;
        setTranslate(pointerX, pointerY, currentElement);
        const elementAtPointer = document.elementFromPoint(clientX, clientY);
        if (elementAtPointer?.classList.contains("centerHitBox")) {
            selectedRingOperations(currentElement.id, elementAtPointer.parentElement, "hover");
        }
        else {
            removeAllHoveredElements();
        }
    }
}
/*
  * dragEnd - Document
  When the client stops dragging we need to delete the clone element first,
  then if the we decided to drop it over one of the cells, intending to play that ring
  we let the server know we are making a move
*/
export function dragEnd(e) {
    const [clientX, clientY] = getClientPointerPos(e);
    const elementAtPointer = document.elementFromPoint(clientX, clientY);
    if (elementAtPointer?.classList.contains("centerHitBox")) {
        selectedRingOperations(currentElement?.id, elementAtPointer.parentElement, "play");
        removeAllHoveredElements();
    }
    deleteClone(currentElement);
    currentElement = null;
    active = false;
}
/*
  * selectedRingOperations - Document
  This function is mainly for visuals, I don't esspically like using this type of function
  where we have an options parameter and basically use one function for multiple things that are
  closely related. but honestly it's not big deal
*/
export function selectedRingOperations(ringSize, selectedRing, option) {
    if (!selectedRing?.classList.contains("otrioCell")) {
        console.log(selectedRing?.classList);
        return;
    }
    if (ringSize && selectedRing) {
        const rings = selectedRing.querySelectorAll(".ring");
        const smallRing = rings[2];
        const mediumRing = rings[1];
        const largeRing = rings[0];
        if (option === "hover") {
            switch (ringSize) {
                case "large":
                    if (!largeRing.classList.contains("played")) {
                        largeRing.classList.add("hover");
                    }
                    break;
                case "medium":
                    if (!mediumRing.classList.contains("played")) {
                        mediumRing.classList.add("hover");
                    }
                    break;
                case "small":
                    if (!smallRing.classList.contains("played")) {
                        smallRing.classList.add("hover");
                    }
                    break;
            }
        }
        if (option === "play") {
            switch (ringSize) {
                case "large":
                    requestBoardAction(rings[0].id, getRoomId());
                    rings[0].classList.remove("hover");
                    break;
                case "medium":
                    requestBoardAction(rings[1].id, getRoomId());
                    rings[1].classList.remove("hover");
                    break;
                case "small":
                    requestBoardAction(rings[2].id, getRoomId());
                    rings[2].classList.remove("hover");
                    break;
            }
        }
    }
    return;
}
/*
  * getClientPointerPos - Document
  we use thing function to better keep track of the pointer posistion at all times
*/
export function getClientPointerPos(event) {
    let clientX = 0;
    let clientY = 0;
    if (event instanceof TouchEvent) {
        const touch = event.touches[0] ?? event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    }
    else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    return [clientX, clientY];
}
/*
  * setTranslate - Document
  This just moves the cloned element we the pointer posistion
*/
export function setTranslate(xPos, yPos, el) {
    if (el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}
/*
  * removeAllHoveredElements - Document
  I made this function because sometimes we would miss the time to remove the hover style
  so this is just to ensure all elements hover styles are off when there should be off
*/
function removeAllHoveredElements() {
    const board = document.querySelector(".otrioBoardInPlay");
    const cells = board?.querySelectorAll(".otrioCell");
    cells?.forEach((cell) => {
        const rings = cell.querySelectorAll(".ring");
        rings.forEach((ring) => {
            if (!ring.classList.contains("played")) {
                ring.classList.remove("hover");
            }
        });
    });
}
/*
  * deleteClone - Document
  this will just deleted whatever cloned element is at the pointer
*/
export async function deleteClone(selectedElement) {
    if (selectedElement) {
        for (let size = 90; size >= 11; size = size - 8) {
            selectedElement.style.width = `${size}px`;
            selectedElement.style.height = `${size}px`;
            await new Promise((resolve) => setTimeout(resolve, 1));
        }
        document.querySelectorAll(".dragging").forEach((el) => el.remove());
        selectedElement.remove();
    }
}
/*
  * deleteClone - Document
  this is just a simple function to make animation queing easier
*/
export const restart = (el, cls) => {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
};
/*
  * displayWarning - Document
  When the client does something thay shouldn't we warn them!
  with a shake animation and message flash
*/
export function displayWarning(warning) {
    const gc = document.querySelector(".otrioBoardInPlay");
    const dynamicWarning = document.querySelector(".dynamicWarnings");
    if (!gc || !dynamicWarning)
        return;
    dynamicWarning.textContent = warning;
    dynamicWarning.style.left = `calc(${pointer.x}px - 60px)`;
    dynamicWarning.style.top = `${pointer.y}px`;
    restart(gc, "shake");
    restart(dynamicWarning, "active");
}
window.addEventListener("pointermove", updatePointer);
/*
  * updatePointer - Document
  It does what it does
*/
export function updatePointer(e) {
    const [x, y] = getClientPointerPos(e);
    pointer.x = x;
    pointer.y = y;
}
/*
  * getGameDatar - Document
  I felt smart making this simple function to retrieve the game data from our session storage
*/
export function getGameData(query, queryList) {
    const data = sessionStorage.getItem("gameData");
    if (!data)
        return;
    const game = JSON.parse(data);
    if (!queryList)
        return game[query];
    let queryItems = [];
    queryList.forEach((item) => {
        queryItems.push(game[item]);
    });
    return queryItems;
}
/*
  * mapPlayerVisuals - Document
  I felt even smarter making this (lil clunky) function to map the players in game
  to their respective slots on the game layout, while making sure to only show the
  other players in game.
*/
export async function mapPlayerVisuals(clientIds, colors, usernames) {
    await requestClientRoomInfo(getRoomId());
    const myId = getClientId();
    const myColor = await getGameData("color");
    const myUsername = sessionStorage.getItem("username");
    const otherClientIds = clientIds.filter((id) => id !== myId);
    const otherColors = colors.filter((color) => color !== myColor);
    const otherUsernames = usernames.filter((name) => name !== myUsername);
    const profileElements = Array.from(document.querySelectorAll(".profile"));
    const profiles = new Map();
    const playerCount = document.querySelector(".playerCount");
    if (playerCount) {
        playerCount.textContent = `${getGameData("players")}/4`;
    }
    console.log(playerCount);
    otherClientIds.forEach((id, index) => {
        const profileEl = profileElements[index];
        if (profileEl) {
            profiles.set(id, profileEl);
            const icon = profileEl
                .querySelector(".playerIcon")
                ?.querySelector(".profile-icon");
            icon.style.color = colorConversion(otherColors[index]);
            const rings = profileEl
                .querySelector(".playerRingDisplay")
                ?.querySelectorAll(".ringContainer .otrioCell .ring");
            rings?.forEach((ring) => {
                ring.style.stroke = colorConversion(otherColors[index]);
            });
            const usernameContainer = profileEl
                .querySelector(".playerNameTag")
                ?.querySelector(".usernameContainer");
            if (usernameContainer) {
                usernameContainer.textContent = otherUsernames[index];
            }
        }
    });
}
/*
  * gameTimer - Document
  An almost useless function that keeps a timer from the start of a new game
  mostly for visuals
*/
export function gameTimer(element, action) {
    const gameStartTime = "gameStartTime";
    if (action === "start") {
        if (timerInterval !== null)
            return;
        if (!sessionStorage.getItem(gameStartTime)) {
            sessionStorage.setItem(gameStartTime, Date.now().toString());
        }
        timerInterval = window.setInterval(() => {
            if (!getGameData("started"))
                return;
            const startTime = Number(sessionStorage.getItem(gameStartTime));
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            if (elapsedSeconds >= 3600) {
                clearInterval(timerInterval);
                timerInterval = null;
                return;
            }
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            element.textContent =
                `${String(minutes).padStart(2, "0")}:` +
                    `${String(seconds).padStart(2, "0")} Minutes`;
        }, 1000);
    }
    if (action === "stop") {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        sessionStorage.removeItem(gameStartTime);
    }
}
/*
* onReloadFunction - Document
  This runs some code everytime the page reloads
  its honestly pretty dumb way to do it, I might change this later
*/
export function onReloadFunction() {
    const hash = window.location.hash;
    if (!hash.startsWith("#id=")) {
        sessionStorage.removeItem("gameData");
        console.log("cleared data");
    }
    if (getGameData("started") === true) {
        closeModal(document.getElementById("waitingForStart"));
        console.log("owuerh");
        gameTimer(timer, "start");
        let code = document.querySelector(".codeContainer");
        if (code) {
            code.textContent = hash.replace("#id=", "");
        }
    }
    if (getGameData("started") === false) {
        console.log("owuesefgesfgegrh");
        const displayCode = document.querySelectorAll(".roomCode");
        if (displayCode) {
            displayCode.forEach((c) => {
                c.textContent = `${getRoomId()}`;
            });
        }
    }
}
/*
* changeClientWindow - Document
  Sense I had the amazing idea to use seperate pages for each platofrm
  this is a simple way to make sure clients are getting sent to where they
  need to go
*/
export function changeClientWindow(location, roomId) {
    const platform = sessionStorage.getItem("platform");
    if (!fadeScreen)
        return;
    fadeScreen.classList.remove("fadeIn", "fadeInPause");
    fadeScreen.style.opacity = "0"; // ensure correct start state
    requestAnimationFrame(() => {
        fadeScreen.classList.add("fadeOut");
    });
    setTimeout(() => {
        if (location === "home") {
            if (platform === "mobile")
                window.location.assign("mobile.html");
            if (platform === "desktop")
                window.location.assign("index.html");
        }
        if (location === "game") {
            if (platform === "mobile")
                window.location.assign(`mobileGame.html#id=${roomId}`);
            if (platform === "desktop")
                window.location.assign(`game.html#id=${roomId}`);
        }
    }, 1500);
}
window.addEventListener("load", () => {
    const platform = sessionStorage.getItem("platform");
    const hash = window.location.hash;
    if (platform === "mobile" && hash.startsWith("#id=")) {
        fadeScreen?.classList.add("fadeInPause");
    }
    else {
        fadeScreen?.classList.add("fadeIn");
    }
});
/*
* pageFade - Document
  
*/
export function currentTurnIndicator() {
    const currentTurn = getGameData("currentTurn");
    console.log(currentTurn);
}
