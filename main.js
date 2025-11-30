var rows = 6  //number of guesses
var cols = 5  //5 letter words only

var currRow = 0;
var currCol = 0;
//game state flags
var gameOver = false;
var guessed = false;
//pick random word from wordList
var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

window.onload = function() {
    //create tiles on board
    let r=0, c=0;
    for (r=0;r<rows; r++) {
        for (c=0; c<cols; c++) {
            let tile = this.document.createElement("span");
            tile.id = r.toString() + "," + c.toString();
            tile.classList.add("tile");
            tile.innerText= "";
            document.getElementById("board").appendChild(tile);
        }
    }
    // create keyboard
    for (let i=0; i<keyboard.length; i++) {
        let currKeyboardRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard");

        for (let j=0; j<currKeyboardRow.length; j++) {
            let keyTile = document.createElement("div");
            keyTile.innerText = currKeyboardRow[j];
            
            if (currKeyboardRow[j] == "↵") {
                keyTile.id = "Enter";
            } else if (currKeyboardRow[j] == "⌫") {
                keyTile.id = "Backspace";
            } else if ("A" <= currKeyboardRow[j] && currKeyboardRow[j] <= "Z") {
                keyTile.id = "Key" + currKeyboardRow[j];
            }

            keyTile.addEventListener("click", processKeyClick);
            keyTile.classList.add("key");
            keyboardRow.appendChild(keyTile);
        }
        this.document.body.appendChild(keyboardRow);
    }

    this.document.addEventListener("keyup", e => processInput(e));
    if (gameOver) {
        console.log("game over");
    }
}

// allow user to input using on screen keyboard
function processKeyClick() {
    e = {"code" : this.id};
    processInput(e);
}

function processInput(e) {
    if (gameOver) return;
    // if key is a letter 
    if ("KeyA" <= e.code && e.code <= "KeyZ"){
        if (currCol < cols) {
            let letter = e.code[3];
            tile = this.document.getElementById(currRow.toString() + "," + currCol.toString());
            tile.innerText = letter;
            currCol++;
        } 
    } // delete previous letter
    else if ("Backspace" == e.code) {
        if (currCol>0) {
            currCol--;
            tile = this.document.getElementById(currRow.toString() + "," + currCol.toString());
            tile.innerText = "";
        }
    } //submit guess and process it
    else if ("Enter" == e.code) {
        if (currCol == cols) {
            currCol = 0;
            let correct = 0;
            //map number of instances of each letter in the word
            //useful for marking correct/absent/present when there are duplicate letters
            let map = {};
            for (let i=0; i<word.length; i++){
                map[word[i]] = map[word[i]] ? map[word[i]]+1 :1;
            }
            //for each letter in the guess
            for (let i=0; i<word.length; i++) {
                tile = this.document.getElementById(currRow.toString() + "," + i.toString());
                let letter = tile.innerText;
                let keyTile = document.getElementById("Key" + letter);
                //matches letter -> mark green
                if (word[i]== letter) {
                    tile.classList.add("correct");
                    keyTile.classList.add("correct");
                    correct++;
                    map[letter]-=1;
                } 
            } //with updated map, mark presents and absents
            for (let i=0; i<word.length; i++) {
                tile = this.document.getElementById(currRow.toString() + "," + i.toString());
                let letter = tile.innerText;
                let keyTile = document.getElementById("Key" + letter);
                if (!tile.classList.contains("correct")) {
                    if (word.includes(letter) && map[letter]>0){
                        tile.classList.add("present");
                        map[letter]-=1;
                        if (!keyTile.classList.contains("correct")) {
                            keyTile.classList.add("present");
                        }
                    } else {
                        tile.classList.add("absent");
                        keyTile.classList.add("absent");
                    }
                } 
            }
            //if 5 correct letters, user guessed correctly
            if (correct==cols) { 
                gameOver= true; 
                guessed = true;
            } //if user ran out of guesses
            else if (currRow==rows-1) {
                gameOver = true;
                guessed = false;
            } //else continue onto next guess
            else  currRow++;
        } console.log(guessed)
    } //if game is over, go to popup
    if (gameOver) showModal();
} 

function showModal() {
    //set modal text to show "Congratulations" or "Game Over"
    //set modal text to reveal correct word 
    let modal = document.getElementById('finishModal');
    modal.classList.add("modal-show");
    if (guessed) document.getElementById("modalTitle").innerText = "Congratulations!";
    else document.getElementById("modalTitle").innerText = "Game Over :(";
    
    document.getElementById("correctWord").innerText = "The correct word was: " + word;

    //handle play again
    let playAgainButton = document.getElementById("playAgain");
    //avoid duplicate event listeners
    playAgainButton.removeEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);
}


function resetGame() {
    let modal = document.getElementById('finishModal');
    modal.classList.remove("modal-show");

    //reset game vars
    currRow = 0;
    currCol = 0;
    gameOver = false;
    guessed = false;
    word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

    //remove all guess markings of present/absent/correct from tiles
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            let tile = document.getElementById(r.toString() + "," + c.toString());
            tile.innerText = "";
            tile.classList.remove("present", "absent", "correct");
        }
    }

    //remove guess markings from keyboard tiles
    for (let i=0; i< keyboard.length; i++) {
        let currKeyboardRow = keyboard[i];
        for (let j=0; j< currKeyboardRow.length; j++) {
            let keyTile;
            if (currKeyboardRow[j]== "↵") {
                keyTile = document.getElementById("Enter");
            } else if (currKeyboardRow[j] == "⌫") {
                keyTile = document.getElementById("Backspace");
            } else {
                keyTile = document.getElementById("Key" + currKeyboardRow[j]);
            }
            keyTile.classList.remove("present", "absent", "correct");
        }
    }
}
