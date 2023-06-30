let word='';
let hiddenWord=[];
let guessedLetters=[];
let incorrectGuesses = [];
let guesses = 5;
let win;

async function getWord (){
    let response = await fetch('https://puzzle.mead.io/puzzle');
    response = await response.json();
    console.log(response);
    return response.puzzle;
}

function newGame(condition){
    word='';
    hiddenWord=[];
    guessedLetters=[];
    incorrectGuesses = [];
    guesses = 5;
    document.getElementById('new-game').remove();
    if(!win){
        document.getElementById('word-reveal').remove();
    }
    win='';
    

    
    getWord().then(data=>{
        word = data.toLowerCase();
        hideWords(data);
        document.addEventListener('keypress',getGuessLetter);
    });
}

function addNewGameButton(){
    let button = document.createElement('button');
    button.setAttribute('id','new-game');
    button.textContent = 'New Game';
    document.getElementById('hangman').appendChild(button);
    document.getElementById('new-game').addEventListener('click',newGame);
}

function checkWinCondition(){
    if(guesses === 0){
        console.log('You Lose!');
        win=false;
        let wordReveal = document.createElement('p');
        wordReveal.textContent = `***(${word})***`;
        wordReveal.setAttribute('id','word-reveal');
        document.getElementById('word').appendChild(wordReveal);
        document.removeEventListener('keypress',getGuessLetter);
        addNewGameButton();
    }

    if(!hiddenWord.includes('*')){
        console.log('You Win!!!');
        document.removeEventListener('keypress',getGuessLetter);
        addNewGameButton();
        win=true;
    }
    
}

function renderWord(){
    //document.getElementById('word').textContent = hiddenWord.join('');
    document.getElementById('word-list').innerHTML='';
    
    hiddenWord.forEach((letter)=>{
       let letterSpace = document.createElement('span');
       letterSpace.textContent = letter;
       if(letter===' '){
        letterSpace.classList.add('space');
       }
       document.getElementById('word-list').appendChild(letterSpace);
    });
    



    document.getElementById('guessed').textContent = incorrectGuesses.join(' ');
    document.getElementById('guesses-left').textContent = guesses;
}

function hideWords(data){
    for(let i=0;i<data.length;i++){
        data[i] === ' ' ? hiddenWord.push(' ' ) : hiddenWord.push('*');
    }

    renderWord();
}

function checkGuess(guessed){

    if(word.includes(guessed)){
        //search hidden word and insert letters
        hiddenWord.forEach(function insertLettersIntoHiddenWord(letter, index){
            if(guessedLetters.includes(word.charAt(index)) || word.charAt(index) === ' '){
                hiddenWord[index] = word.charAt(index);
            }
        });
    } else {
        incorrectGuesses.push(guessed);
        guesses--;
    }

    checkWinCondition();
    console.log(guesses);
    renderWord();

}

function getGuessLetter(e){

    //capture guessed letter
    let guessed = (e.key.toLowerCase());
    console.log(e);
    //don't allow duplicates

    if(!(e.charCode > 96 && e.charCode < 123) && !(e.charCode >64 && e.charCode < 91) ){
        console.log('Must enter a valid letter');
        return;
    }

    if(!guessedLetters.includes(guessed)){
        guessedLetters.push(guessed);
        checkGuess(guessed);
    } else {
        console.log('You already guessed that one') 
    }

} 


getWord().then(data=>{
    word = data.toLowerCase();
    hideWords(data);
    document.addEventListener('keypress',getGuessLetter);
});