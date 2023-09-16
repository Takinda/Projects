const telegramBot = require('node-telegram-bot-api');
const token = '5906673369:AAHWhwgDLj2O9673r-serIFvKJHOu6n98DE';
let RPS_session = []
var opt = {polling:true};
const bot = new telegramBot(token,opt)

//array for Rock-Paper-Scissor
//--------------------------------------------------------------------------------
let game_char=["rock","paper","scissor"];
bot.on('message',(msg)=>{
    var hi ="hi"
    if(msg.text.toString().toLowerCase().includes(hi))
        bot.sendMessage(msg.chat.id,"hi bro");
    var bye ="bye"
    if(msg.text.toString().toLowerCase().includes(bye))
        bot.sendMessage(msg.chat.id,"bye bro");
});

//commands
bot.onText(/\/start/,(msg)=>{
    bot.sendMessage(msg.chat.id,`Hello ${msg.from.first_name}\nif you need help with commands\ntype /help\n`)
});
bot.onText(/\/help/,(msg)=>{
    bot.sendMessage(msg.chat.id,"This is a list of all commands:\n/rockgame\n/hangword")
});
bot.onText(/\/rockgame/,(msg)=>{
    if(RPS_session.includes(msg.from.id)){
        return bot.sendMessage(msg.chat.id,"you are already playing!")
    }
    else{
        RPS_session.push(msg.from.id)
        setTimeout(function(){
            let index = RPS_session.indexOf(msg.from.id)
            RPS_session[index]=0
            bot.sendMessage(msg.chat.id,"game ended")
        },1000*10)
        return bot.sendMessage(msg.chat.id,"choose : \nRock or Paper or Scissor",{
            reply_markup:{"keyboard":[game_char]}
        })
    }
    
})
//hangword
//--------------------------------------------------------------------------------
bot.onText(/\/hangword/, (msg) => {
    let words = ["food", "book", "read", "dog", "house","cat","road","black","red","green","blue","orange","winter","computer","fridge","friend","school","arabic","english"];
    let arrlength = words.length - 1;
    let chosen_word = Math.round(Math.random() * arrlength);
    let word_letters = words[chosen_word].split("");
    let guessed_word_size = word_letters.length;
    let guessed_word = Array(guessed_word_size).fill('*');
    let wordGuessed = false;
    let lives = 8; // Initial number of lives
    
    bot.sendMessage(msg.chat.id, `This is your word, guess it:\n${guessed_word}\nGame ends in 60 seconds`);
    console.log(`Correct word: ${word_letters.join('')}`);
    console.log(`User ${msg.from.username} started the game.`);

    bot.on("message", (msg) => {
        if (msg.text === "/hangword") {
            return;
        }

        console.log(`User ${msg.from.username} sent: ${msg.text}`);
        
        if (wordGuessed || lives === 0) {
            return;
        }

        let user_guessword = msg.text.toLowerCase();
        let user_guess = user_guessword.split("");
        console.log(`Wrote by user: ${user_guess}\nWrote by code: ${word_letters}\n`);

        if (user_guess.length !== guessed_word_size) {
            lives--; // Decrement a life for an invalid guess length
            bot.sendMessage(msg.chat.id, `Invalid guess length. Try again with ${guessed_word_size} characters.\nLives remaining: ${lives}`);
            if (lives === 0) {
                bot.sendMessage(msg.chat.id, `You've run out of lives. The word was: ${word_letters.join('')}`);
            }
            return;
        }

        let correctGuess = true;

        for (let i = 0; i < guessed_word_size; i++) {
            if (word_letters[i] === user_guess[i]) {
                guessed_word[i] = user_guess[i];
            } else {
                correctGuess = false;
            }
        }

        if (correctGuess) {
            wordGuessed = true;
            bot.sendMessage(msg.chat.id, `Great! You guessed it. The word is: ${word_letters.join('')}`);
        } else {
            lives--;
            bot.sendMessage(msg.chat.id, `Good guess!\nCurrent status: ${guessed_word.join(' ')}\nLives remaining: ${lives}`);
            if (lives === 0) {
                bot.sendMessage(msg.chat.id, `You've run out of lives. The word was: ${word_letters.join('')}`);
            }
        }
    });

    const commandTimeout = 60000;
    setTimeout(() => {
        if (!wordGuessed && lives > 0) {
            bot.sendMessage(msg.chat.id, `Time's up! The word was: ${word_letters.join('')}`);
        }
    }, commandTimeout);
});

//rock-paper-scissor
//--------------------------------------------------------------------------------
bot.on("message", function(msg){
if(game_char.includes(msg.text.toLowerCase()) && RPS_session.includes(msg.from.id)){
    let game_charlength=game_char.length-1;
    let computer_choice=Math.round(Math.random()*game_charlength)
    let user_choice = msg.text
    if ((user_choice==game_char[0] && computer_choice==2)||
        (user_choice==game_char[1] && computer_choice==0)||
        (user_choice==game_char[2] && computer_choice==1))
    {
        bot.sendMessage(msg.chat.id,`You win !\n${msg.from.first_name} chose :${user_choice}\ncomputer chose:${game_char[computer_choice]}`)
    }
    else if ((user_choice==game_char[computer_choice]))
    {
        bot.sendMessage(msg.chat.id,`Draw !\n${msg.from.first_name} chose :${user_choice}\ncomputer chose:${game_char[computer_choice]}`)
    }
    else
    {
        bot.sendMessage(msg.chat.id,`You lose !\n${msg.from.first_name} chose :${user_choice}\ncomputer chose:${game_char[computer_choice]}`)
    }
}
});
bot.on("polling_error", console.log);