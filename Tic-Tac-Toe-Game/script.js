let boxes = document.querySelectorAll(".box")
let resetBtn = document.querySelector("#reset")
let newGamebtn = document.querySelector("#new")
let msgcontainer = document.querySelector(".msg-container")
let msg = document.querySelector("#msg")
let main = document.querySelector(".main")
let clickSound = document.querySelector("#click-sound");
let winSound = document.querySelector("#win-sound");
let drawSound = document.querySelector("#draw-sound");
let bgSound = document.querySelector("#bg-sound");

let pvpBtn = document.querySelector("#pvp");
let pvcBtn = document.querySelector("#pvc");
let modeSelection = document.querySelector(".mode-selection");
let xoIndicator = document.querySelector(".xo");
let titlo = document.querySelector(".titlo")
let big = document.querySelector(".big")
let repeat = document.querySelector(".animation0")


// Select both indicators (X and O)
let bozX = document.querySelector(".x.boz");
let bozO = document.querySelector(".o.boz");


let turno = true;
let click_count = 0;
let winnerFound = false; //  Track if winner exists

// function turn() {
//     let rantrun = Math.floor(Math.random() * 2); // 0 or 1
//     if (rantrun === 0) {
//         turno = true;   // O's turn
//     } else {
//         turno = false;  // X's turn
//     }
//     updateIndicator();
// }
// turn();

let mode = "pvp";  // default mode
// Mode selection
pvpBtn.addEventListener("click", () => {
    mode = "pvp";
    modeSelection.classList.add("hide1");   // hide options
    xoIndicator.classList.remove("hide1");  // show XO
    startGame()
    // resetGame();
});

pvcBtn.addEventListener("click", () => {
    mode = "pvc";
    modeSelection.classList.add("hide1");
    xoIndicator.classList.remove("hide1");
    startGame()
    // resetGame();
});

function computerMove() {
    // Get all empty boxes
    let emptyBoxes = [];
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            emptyBoxes.push(index);
        }
    });

    if (emptyBoxes.length > 0) {
        let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        let compBox = boxes[randomIndex];
        compBox.innerText = "X"; // Computer is X
        compBox.disabled = true;
        turno = true; // back to player O
        click_count++;
        checkWinner();
        updateIndicator();
    }
}

function startGame() {
    bgSound.volume = 0.4; // set low volume so it doesn’t disturb
    bgSound.play();
}

function stopGame() {
    bgSound.pause();
    bgSound.currentTime = 0; // reset to beginning
}

function celebrate() {
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 }
    });
}

function getRedShade() {
    let red =   136 + Math.floor(Math.random() * 126); // between 150–255
    let green = Math.floor(Math.random() * 80);      // small green
    let blue = Math.floor(Math.random() * 80);       // small blue
    return `rgb(${red}, ${green}, ${blue})`;
}

let a = setInterval(() => {
    titlo.style.color = getRedShade();
}, 1000);



const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

//  highlight turn
function updateIndicator() {
    bozX.classList.remove("active",);
    bozO.classList.remove("active",);

    if (turno) {
        bozO.classList.add("active"); // O's turn
    } else {
        bozX.classList.add("active"); // X's turn
    }
}

const resetGame = () => {
    turno = true;
    enableBox();
    click_count = 0;
    winnerFound = false; // reset
    main.classList.remove("hide")
    bozX.classList.remove("active");
    bozO.classList.remove("active");
    startGame()
    updateIndicator();
    clickSound.currentTime = 0; // rewind to start (so it plays every click)
    clickSound.play();
    modeSelection.classList.remove("hide1");
    xoIndicator.classList.add("hide1");

}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (mode == "pvp") {
            // Play sound
            clickSound.currentTime = 0; // rewind to start (so it plays every click)
            clickSound.play();

            if (turno) { //playero
                box.innerText = "O"
                turno = false;
            }
            else { //palyer x
                box.innerText = "X"
                turno = true;
            }
            box.disabled = true;

            click_count++;
            checkWinner();
            updateIndicator(); // switch highlight
        }
        else if (mode === "pvc") {
            // Player always O, Computer is X
            if (turno) {
                clickSound.currentTime = 0;
                clickSound.play();
                box.innerText = "O";
                box.disabled = true;
                turno = false;
                click_count++;
                checkWinner();
                updateIndicator();

                // Computer plays only if game not over
                if (!winnerFound && click_count < 9) {
                    setTimeout(computerMove, 500); // delay for realism
                }
            }
        }
    })
})



const disableBox = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableBox = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        msgcontainer.classList.add("hide");
    }
}

const showWinner = (winner) => {
    msg.innerText = `Congratulation Winner is ${winner}`
    msgcontainer.classList.remove("hide");
    big.classList.remove("hide2")
    disableBox();
    winnerFound = true;
    //  Play Hurray sound
    winSound.currentTime = 0;
    winSound.play();
    stopGame()
    celebrate();
    main.classList.add("hide");
    repeat.classList.add(".animation")

};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val != "" && pos2val != "" && pos3val != "") {
            if (pos1val == pos2val && pos2val == pos3val) {
                showWinner(pos1val);
                return;
            }
        }
    }
    if (!winnerFound && click_count === 9) {
        msg.innerText = "Match is draw";
        msgcontainer.classList.remove("hide");
        main.classList.add("hide");
        //  Play draw sound
        drawSound.currentTime = 0;
        stopGame()
        drawSound.play();
        big.classList.add("hide2");
    }
}

newGamebtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);



