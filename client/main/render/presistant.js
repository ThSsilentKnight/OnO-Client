"use strict";
fetch("./components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
        navbar.innerHTML = html;
    }
    else {
        console.log("navbar not found");
    }
});
