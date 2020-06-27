// the "imports"
const dgram = require('dgram');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');


// the constants
const TIME = 1000;
const PROTOCOL_PORT = 2020;
const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5'; // address stolen from thermometer

// we should create a map with sound-instrument.
const instrumentSoundMap = new Map();
instrumentSoundMap.set('piano', 'ti-ta-ti');
instrumentSoundMap.set('trumpet', 'pouet');
instrumentSoundMap.set('flute', 'trulu');
instrumentSoundMap.set('violin', 'gzi-gzi');
instrumentSoundMap.set('drum', 'boum-boum');

const server = dgram.createSocket('udp4');

// do some parameter control, we only want the basic info and the instrument type

//we set the instrument
const instrument = process.argv[2];

if (process.argv.length != 3) {
    console.error('Only one argument required');
    return;
}

console.log(instrument);

if (!instrumentSoundMap.has(instrument)) {
    console.error('Illegal instrument! we called the music police');
    return;
}

// just a function unlike thermometer, returns an anonymous object (maybe do a musician class?)
function musicianPLays(instrumentPlayed) {
    return {
        uuid: uuidv4(), // might be a problem as we are not in an object
        sound: instrumentSoundMap.get(instrumentPlayed),
        instrument: instrumentPlayed,
        activeSince: moment().format(),
    }
}



//we set the musician (it's a JSON Object)
const musician = musicianPLays(instrument);
// we get a str from that json
const strMusician = JSON.stringify(musician);

//play a lot

function playOnce() {
    server.send(strMusician, 0, strMusician.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS);
    console.log("sending the sweet power of jazz");
}


setInterval(playOnce, TIME);