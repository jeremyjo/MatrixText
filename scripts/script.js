                                    // -- VARIABLES -- 

var largeScreenQuery = window.matchMedia( "(min-width: 769px)" );

// user instructions text element
var insert = document.getElementsByClassName("direction")[0];

checkScreenSize(largeScreenQuery, insert);
largeScreenQuery.addListener(checkScreenSize);

// user input variable
var word = "";

// stores when the user input is done
var submit = 0;

// stores where the user pressed the enter key
var pressedEnter = 0;

var falling = 0;

// time variables of user input and current time
var timeOfLastInput = 0;
var currentTime = 0;

// user screen dimensions
var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;

// create a text display element and position it horizontally
makeElement();

// position vertically
var startingVertPos = startElement.getBoundingClientRect().top;

                                    // -- EVENT LISTENERS -- 

// ========================================  BEG KEY DOWN =======================================================

// user presses down on a key
document.addEventListener("keydown", event => {
    
    var userDateObj = new Date();
    
    // time user pressed a key
    timeOfLastInput = userDateObj.getTime();
    
    // add each key of user input to the word that will fall

    // accepts only letters, numbers, and symbols
    if (event.keyCode >= 32 && event.keyCode <= 255 ) {
        word += event.key;
    }

    // if 'backspace' key is pressed
    if (event.keyCode == 8) {
        // get rid of previous letter
        word = word.slice(0, -1);
    }
});     // end of 'keydown' event listener
// ========================================  END KEY DOWN =======================================================


// ========================================  BEG KEY UP =======================================================

// when user lets go of a key
document.addEventListener("keyup", event => {
    
    // initial vertical position of word
    if (submit == 0) {
        startElement.style.top = startingVertPos + "px";
    }

    // update previous entry with the current one
    startElement.innerHTML = "";
    startElement.append(word);

    // ensures the word does not go off screen
    while (startElement.getBoundingClientRect().right >= screenWidth) {
        startElement.style.left = startElement.getBoundingClientRect().left - 10 + "px";
    }

    // determines that the user input is complete once a set time has passed since the last 'keyup' event
    var checkDone = setInterval(timeCheckFn, 1);

    function timeCheckFn() {

        var currentDateObj = new Date();
        currentTime = currentDateObj.getTime();
        
        // time since last 'keyup' event
        var pauseTime = currentTime - timeOfLastInput;

        // if 1 second since last 'keyup' event, submit user input and stop calculating the time difference
        if (pauseTime > 1000) {
            submit = 1;

            // bypass automatic submission based on time if the user presses the enter key
            if (pressedEnter == 1) {
                submit = 0;
            }

            // makes word fall down the screen once user input has been submitted
            var displayWord = setInterval(displayFn, 10);

            function displayFn () {

                if (submit == 1) {
                    
                    // get vertical position of word
                    let verticalPos = startElement.getBoundingClientRect().top;
                    
                    // make word go to bottom of screen
                    var interval = setInterval(descendFn, 1);
            
                    function descendFn() {
                        falling = 1;
                        // stops the word's descent and resets for the next word
                        if (verticalPos >= (screenHeight - 40) ) {
                            falling = 0;
                            startElement.remove();
                            clearInterval(interval);
                            clearInterval(displayWord);
                            makeElement();
                        }   // end if() checking if element is at botton of screen
            
                        // move the word down the screen
                        verticalPos++;
                        startElement.style.top = verticalPos + "px";

                        if (document.getElementsByTagName("input")[0]) {
                            document.getElementsByTagName("input")[0].value = "";
                        }
        
                    }   // end descendFn()
            
                    // resets the word for any future user input
                    word = "";
                    // reset submit for future user input
                    submit = 0;

                }   // end if() checking if word is being submitted
            }       // end displayFn()

            clearInterval(checkDone);

        }           // end if() checking if the user waited long enough
    }               // end timeCheckFn()

// ========================================  BEG ENTER SCENARIO  =======================================================

    // user submits the text entered as word when pressing the "Enter" key
    if (event.key == "Enter") {

        pressedEnter = 1;

        if (falling == 0) {

            // get vertical position of word
            let verticalPos = startElement.getBoundingClientRect().top;

            // make word go to bottom of screen
            var interval = setInterval(descendFn, 1);
                
            function descendFn() {
                falling = 1;
                // stops the word's descent and resets for the next word
                if (verticalPos >= (screenHeight - 40) ) {
                    falling = 0;
                    startElement.remove();
                    clearInterval(interval);
                    makeElement();
                    pressedEnter = 0;
                }   // end if() checking if element is at botton of screen

                // move the word down the screen
                verticalPos++;
                startElement.style.top = verticalPos + "px";

                if (document.getElementsByTagName("input")[0]) {
                    document.getElementsByTagName("input")[0].value = "";
                }

            }   // end descendFn()

            // resets the word for any future user input
            word = "";
        }
        
        // reset var in the case that the enter key is pressed when the word is falling
        pressedEnter = 0;

    }       // end if() checking if the enter key was pressed

// ========================================  END ENTER SCENARIO  =======================================================

});     // end of 'keydown' event listener

// ========================================  END KEY UP =======================================================


                                    // -- FUNCTION DEFINITIONS -- 

function checkScreenSize (largeScreenQuery) {

    if (largeScreenQuery.matches) {
    }

    else {
        if (document.getElementsByTagName("input")[0]) {
            document.getElementsByTagName("input")[0].remove();
        }
        var newElement = document.createElement("input");
        insert.before(newElement);;
    }
}

function makeElement () {
    // if you don't declare the variable, it will be global
    startElement = document.createElement("span");

    // puts the "fall" id on the <span>
    startElement.setAttribute("id", "fall");
    startElement.setAttribute("class", "test");

     // adds the user input element to the DOM
    insert.appendChild(startElement);

    // sets the horizontal position randomly
    startElement.style.left = Math.random() * screenWidth * .95 + "px";
}

// Backup Code
/*
var x = window.matchMedia("(max-width: 700px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes
*/