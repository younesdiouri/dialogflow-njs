'use strict';

const socket = io();
let botui = new BotUI('djingo-video');
botui.message.add({
    content: 'Bienvenue!'
}).then(talk);
function talk() {
    botui.action.text({
            action: {
                placeholder: 'ici pour écrire :)',
            }
        }
    ).then(function (res) { // will be called when a button is clicked.
        socket.emit('chat message', res.value);
    });
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let inputText = document.querySelector('.inputText');
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
    botui.message.add({
        human: true,
        content: text,
        delay: 500,
    }).then(talk);
  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
    botui.message.add({
        content: replyText,
        delay: 500,
    }).then(talk);
});
