window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
async function setUpContext() {
    // the browser automatically blocks audio output until the user clicks on the page. To bypass this, we check if .state is "suspended" and if so, we call resume(). The state will now be "running".
    if (context.state === "suspended") {
        await context.resume()
    }
}
setUpContext()
console.log(context)

  

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

function noteOn(note, velocity) {
    const osc = context.createOscillator();
    console.log(osc) 
}
function noteOff(note, velocity) {
    console.log(note)
}
function updateDevices(event) {
console.log(`Device ${event.port.state}. Name: ${event.port.name}, Brand: ${event.port.manufacturer}, Type: ${event.port.type}`)
}

function failure() {
    console.log('Could not connect MIDI')
}

