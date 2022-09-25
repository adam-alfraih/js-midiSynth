if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midiAccess) {
    console.log(midiAccess);
    midiAccess.onstatechange = updateDevices;
}

function updateDevices(event) {
console.log(event)
}

function failure() {
    console.log('Could not connect MIDI')
}

