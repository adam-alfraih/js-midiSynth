window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const oscillators = {};
let oscillatorType = 'triangle';

async function setUpContext() {
    // the browser automatically blocks audio output until the user clicks on the page. To bypass this, we check if .state is "suspended" and if so, we call resume(). The state will now be "running".
    if (context.state === "suspended") {
        await context.resume()
    }
}
setUpContext()
console.log(context)

function midiToFreq(number) {
    const a = 440;
    return (a / 32) * (2 ** ((number -9) / 12));
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midiAccess) {
    midiAccess.addEventListener('statechange', updateDevices)

    const inputs = midiAccess.inputs;

    inputs.forEach((input) => { 
        input.addEventListener('midimessage', handleInput)
    })
}

function sine() {
    oscillatorType = 'sine'
}
function square() {
    oscillatorType = 'square'
}
function sawtooth() {
    oscillatorType = 'sawtooth'
}
function triangle() {
    oscillatorType = 'triangle'
}

function handleInput(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    switch (command) {
        case 144: // noteOn 
        if (velocity > 0) {
            noteOn(note, velocity);
        } else {
            noteOff(note);
        }
        break;
        case 128: // note off
        noteOff(note);
        break;
    }
}

// velocity is a number between 0 - 127
function noteOn(note, velocity) {
    const oscillator = context.createOscillator();
    
    const oscillatorGain = context.createGain();
    oscillatorGain.gain.value = 0.10;
    
    const velocityGainAmount = (1 / 127 * velocity);
    const velocityGain = context.createGain();
    velocityGain.gain.value = velocityGainAmount
    
    oscillator.type = oscillatorType
    oscillator.frequency.value = midiToFreq(note);
    
    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(velocityGain)
    velocityGain.connect(context.destination);
    
    oscillator.gain = oscillatorGain;
    oscillators[note.toString()] = oscillator;
    
    oscillator.start();
    console.log(oscillators)
}
function noteOff(note, velocity) {
    const oscillator = oscillators[note.toString()];
    const oscillatorGain = oscillator.gain

    oscillatorGain.gain.setValueAtTime(oscillatorGain.gain.value, context.currentTime);
    oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.03)

    setTimeout (() => {
        oscillator.stop()
        oscillator.disconnect()
    }, 20)
}
function updateDevices(event) {
console.log(`Device ${event.port.state}. Name: ${event.port.name}, Brand: ${event.port.manufacturer}, Type: ${event.port.type}`)
}

function failure() {
    console.log('Could not connect MIDI')
}


