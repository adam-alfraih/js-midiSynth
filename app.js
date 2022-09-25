window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const oscillators = {};
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

// Connect browser oscilator to note press


function noteOn(note, velocity) {
    const oscillator = context.createOscillator();
    oscillators[note.toString()] = oscillator;
    console.log(oscillators);

    const oscillatorGain = context.createGain();
    oscillatorGain.gain.value = 0.10

    oscillator.type = 'sine';
    oscillator.frequency.value = midiToFreq(note);
    
    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(context.destination);
    oscillator.start();
}
function noteOff(note, velocity) {
    const oscillator = oscillators[note.toString()];
    oscillator.stop()
}
function updateDevices(event) {
console.log(`Device ${event.port.state}. Name: ${event.port.name}, Brand: ${event.port.manufacturer}, Type: ${event.port.type}`)
}

function failure() {
    console.log('Could not connect MIDI')
}

