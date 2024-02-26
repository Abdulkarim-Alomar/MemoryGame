let usName = document.querySelector(".user .name");
let tries = document.querySelector(".wrong-try .try");
let startGame = document.querySelector(".control-buttons span");
let card = document.querySelectorAll(".images .icon");
let playersTable = document.querySelector(".players")
let playerName = document.querySelector(".players .player .name");
let playerTries = document.querySelector(".players .player .tries");
let theMusic = document.getElementById("music-game");
let timer = document.querySelector(".counter");

let rightChoice = 0;
let duration = 1000;
let wrongTries = 0;
let timePlay = 120;
let arrayOfObj = [];

//check if the any data in the localStorage
if (localStorage.getItem("arr-of-objects")) {

    //turn the values in localStorage to object and save it in arrayOfObj
    arrayOfObj = JSON.parse(localStorage.getItem("arr-of-objects"));
    
}


// //Add User Name To the Page
startGame.addEventListener("click", () => {

    timeCount(timePlay);

    //Getting User Name
    let userName = prompt("Enter Your Name");

    theMusic.play();
    
    //Check From The User Name
    if (userName === null || userName === "") {

        usName.innerHTML = "Unknown";
    } else {
        usName.innerHTML = userName;
    }
    tries.innerHTML = wrongTries;
    //Removing splash screen From The Dom
    document.querySelector(".control-buttons").remove();

    addNameAndTries();
    
})

//Get Array From The Cards
let arrayCard = Array.from(card);

//Get The index of the cards
let cardRange = [...Array(arrayCard.length).keys()];

//The right Choices 


shuffle(cardRange);


arrayCard.forEach((block,index) => {
    //Randomize The Cards
    block.style.order = Math.floor(Math.random() * 20);
    //Another Way Of Randomize The Cards
    // block.style.order = cardRange[index];
    block.addEventListener("click", () => {

        //Making The Cards Flipped
        block.classList.add("is-flipped");

        //collect The flipped Cards
        let flippedCards = arrayCard.filter(flippedBlocks => flippedBlocks.classList.contains("is-flipped"));

        //check If The Flipped Cards = 2
        if (flippedCards.length == 2) {

            //Stop Clicking
            for (let i = 0; i < 20; i++) {
                card[i].classList.add("no-clicking");
            }
            
            setTimeout(() => {
                for (let i = 0; i < 20; i++) {
                    card[i].classList.remove("no-clicking");
                }
                if (flippedCards[0].dataset.font === flippedCards[1].dataset.font) {

                    flippedCards[0].classList.remove("is-flipped");
                    flippedCards[1].classList.remove("is-flipped");

                    flippedCards[0].classList.add("has-match");
                    flippedCards[1].classList.add("has-match");
                    rightChoice += 2;
                    
                    if (rightChoice === 20) {

                        clearInterval(countDownTimer);

                        youWin();

                        sortingDataLocalStorage();
                    }

                } else {
                    wrongTries++;
                    tries.innerHTML = wrongTries;
                    flippedCards[0].classList.remove("is-flipped");
                    flippedCards[1].classList.remove("is-flipped");
                }
            },duration)
        }
    })
    
});

//Another Way For Randomize The Cards
function shuffle(array) {
    let current = array.length,
        tamp,
        random;
    while (current > 0) {

        //Get Random Numbers
        random = Math.floor(Math.random() * current);
        
        //Decrease Length By One
        current--;

        //Change The Index Of Element in the Array NOT the values
        tamp = array[current];

        array[current] = array[random];

        array[random] = tamp;
        
    }
    return array;
}
//Count Down Function
function timeCount(timePlay) {
    let minutes ,second

    countDownTimer = setInterval(function () {
            minutes = parseInt(timePlay / 60);
            second = parseInt(timePlay % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            second = second < 10 ? `0${second}` : second;

            timer.innerHTML = `${minutes} : ${second}`;
            
            if (--timePlay < 0) {
                clearInterval(countDownTimer);

                gameOVer();

            }
        }, 1000);
}
//popup for winning
function youWin() {
    let win = document.createElement("div");
    win.classList = "win";

    let btn = document.createElement("button");
    btn.innerHTML = "Restart";
    btn.onclick = () => {
        location.reload();
    }
    win.appendChild(btn);
    document.body.appendChild(win);

    theMusic.remove();
}
//popup For Losing
function gameOVer() {
    let over = document.createElement("div");
    over.className = "game-over";

    let btn = document.createElement("button");
    btn.innerHTML = "Restart";
    btn.onclick = () => {
        location.reload();
    }
    over.appendChild(btn);

    document.body.appendChild(over);

    theMusic.remove();
}

//adding the name and the tries to the players list
function addNameAndTries() {

    for (let i = 0; i < arrayOfObj.length; i++) {

        let player = document.createElement("div");
        player.className = "player";

        let nameSpan = document.createElement("span");
        nameSpan.className = "name";
        nameSpan.innerHTML = arrayOfObj[i]["playerName"];

        let trySpan = document.createElement("span");
        trySpan.className = "tries";
        trySpan.innerHTML = arrayOfObj[i]["playerTries"];
    
        player.appendChild(nameSpan);
        player.appendChild(trySpan);

        playersTable.appendChild(player);
    }

}
//storing the data in localStorage function
function sortingDataLocalStorage() {

    let checker = false; 

    //check if the player played this game before
    for (let i = 0; i < arrayOfObj.length; i++) {
        if (arrayOfObj[i]["playerName"] === usName.innerHTML) {
            checker = true;
            arrayOfObj[i]["playerTries"] = tries.innerHTML;
            break;
        }
    }
    //if the player didn't play the game pushing the name and the tries of the player to the array of objects
    if (checker === false) {
        arrayOfObj.push({ playerName: usName.innerHTML, playerTries: tries.innerHTML });
    }

    //storing the array in the localStorage
    localStorage.setItem("arr-of-objects", JSON.stringify(arrayOfObj));

}

