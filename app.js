if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midiAccess) {
    console.log(midiAccess);
    midiAccess.addEventListener('statechange', updateDevices)
}

function updateDevices(event) {
console.log(event)
console.log(`Device ${event.port.state}. Name: ${event.port.name}, Brand: ${event.port.manufacturer}, Type: ${event.port.type}`)
}

function failure() {
    console.log('Could not connect MIDI')
}

