const switchCtn = document.querySelector("#switch-cnt");
const switchC1 = document.querySelector("#switch-c1");
const switchC2 = document.querySelector("#switch-c2");
const switchCircles = Array.from(document.querySelectorAll(".switch__circle"));
const switchBtn = Array.from(document.querySelectorAll(".switch-btn"));
const aContainer = document.querySelector("#a-container");
const bContainer = document.querySelector("#b-container");
const allButtons = Array.from(document.querySelectorAll(".submit"));

const getButtons = (e) => e.preventDefault();

const changeForm = (e) => {
    if (!switchCtn) return;

    switchCtn.classList.add("is-gx");
    setTimeout(() => switchCtn.classList.remove("is-gx"), 1500);

    switchCtn.classList.toggle("is-txr");
    switchCircles.forEach(c => c.classList.toggle("is-txr"));

    if (switchC1) switchC1.classList.toggle("is-hidden");
    if (switchC2) switchC2.classList.toggle("is-hidden");
    if (aContainer) aContainer.classList.toggle("is-txl");
    if (bContainer) {
        bContainer.classList.toggle("is-txl");
        bContainer.classList.toggle("is-z200");
    }
};

const mainF = () => {
    allButtons.forEach(btn => btn.addEventListener("click", getButtons));
    switchBtn.forEach(btn => btn.addEventListener("click", changeForm));
};

window.addEventListener("load", mainF);