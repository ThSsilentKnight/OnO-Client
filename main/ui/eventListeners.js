import { leaveGameRequest, requestClientRoomInfo, requestJoinRoom, requestNewRoom, requestStartGame, validateRoomId, } from "../network/requests.js";
import { changeClientWindow, closeModal, drag, dragEnd, dragStart, generateRoomId, getClientId, getRoomId, onReloadFunction, openModal, restart, } from "../utils/helpers.js";
import { gameContainer, closeModalButtons, createGameButton, exitButton, joinButton, openModalButtons, overlay, startButton, platform, } from "./dom.js";
/*
This function runs every time the page reloads.
*/
onReloadFunction();
/*
Stores which platform (mobile or desktop) the user selected
in sessionStorage so other pages know which layout to load.
*/
platform.forEach((button) => {
    button.addEventListener("click", () => {
        const platformType = button.classList[1];
        if (platformType === "mobile") {
            sessionStorage.setItem("platform", "mobile");
        }
        else if (platformType === "desktop") {
            sessionStorage.setItem("platform", "desktop");
        }
    });
});
/*
Handles creating a new game:
1. Generates a room id
2. Validates username input
3. Sends requests to create and join the room
4. Saves username locally
5. Loads room data and navigates to the game page
*/
createGameButton?.addEventListener("click", async () => {
    const roomId = generateRoomId();
    const username = (createGameButton?.parentElement?.querySelector(".username")).value;
    if (username.length < 1) {
        const modal = document.getElementById("hostSettingsModal");
        const errorMessage = document.querySelector(".creationErrorMessage");
        if (errorMessage && modal) {
            restart(errorMessage, "floatUpFade");
            restart(modal, "shake");
            errorMessage.classList.add("floatUpFade");
            errorMessage.textContent = "Please Enter A Username";
            modal?.classList.add("shake");
        }
        return;
    }
    requestNewRoom(roomId);
    requestJoinRoom(getClientId(), roomId, username);
    sessionStorage.setItem("username", username);
    console.log(username);
    await requestClientRoomInfo(roomId);
    changeClientWindow("game", String(roomId));
});
/*
Handles joining an existing game:
1. Reads room id and username
2. Validates username
3. Checks if the room exists
4. Joins the room and loads game data
5. Navigates to the game page
*/
joinButton?.addEventListener("click", async () => {
    const roomId = Number(document.getElementById("roomId").value);
    const username = (joinButton?.parentElement?.querySelector(".username")).value;
    if (username.length < 1) {
        const modal = document.getElementById("codeModal");
        const errorMessage = document.querySelector(".codeErrorMessage");
        if (errorMessage && modal) {
            restart(errorMessage, "floatUpFade");
            restart(modal, "shake");
            errorMessage.classList.add("floatUpFade");
            errorMessage.textContent = "Please Enter A Username";
            modal?.classList.add("shake");
        }
        return;
    }
    if (await validateRoomId(roomId)) {
        requestJoinRoom(getClientId(), Number(roomId), username);
        sessionStorage.setItem("username", username);
        await requestClientRoomInfo(roomId);
        changeClientWindow("game", String(roomId));
    }
});
/*
Triggered when a player clicks an exit/leave button.
Sends a request to the server to leave the current room.
*/
exitButton?.forEach((b) => b.addEventListener("click", () => {
    leaveGameRequest(getRoomId());
    // TODO Tell the server we are going back to the main page
    // TODO we should kill this room server size
}));
/*
Starts the game when the host presses the start button
by sending a start request to the server.
*/
startButton?.addEventListener("click", () => {
    console.log("game started");
    requestStartGame(getRoomId());
});
/*
Handles drag interactions inside the game container.
*/
gameContainer?.addEventListener("touchstart", dragStart, { passive: false });
gameContainer?.addEventListener("touchend", dragEnd);
gameContainer?.addEventListener("touchmove", drag, { passive: false });
gameContainer?.addEventListener("mousedown", dragStart);
gameContainer?.addEventListener("mouseup", dragEnd);
gameContainer?.addEventListener("mousemove", drag);
/*
Closes any open modal if the overlay background is clicked,
unless the overlay is marked as "deny".
*/
overlay?.addEventListener("click", () => {
    if (!overlay?.classList.contains("deny")) {
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach((modal) => {
            closeModal(modal);
        });
    }
});
/*
Opens a modal when a button with a data modal target attribute is clicked.
The attribute specifies which modal should appear.
*/
openModalButtons.forEach((button) => {
    const el = button;
    el.addEventListener("click", () => {
        const modalTarget = el.dataset.modalTarget;
        if (modalTarget) {
            const modal = document.querySelector(modalTarget);
            openModal(modal);
        }
    });
});
/*
Closes the modal that contains the clicked close button.
*/
closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});
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
