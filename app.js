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
    console.log(note, velocity)
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

