//imports
const dgram = require('dgram');
const net = require('net');
const moment = require('moment');

//constants
const PROTOCOL_TCP_PORT = 2205;
const PROTOCOL_MULTICAST_PORT=2020;
const PROTOCOL_MULTICAST_ADDRESS='239.255.22.5';
const TIME_FOR_CHECK=1000; //in millisecond
const INACTIVITY_TIME=5; // in seconds

// var
let orchestra = new Map();

// server stuff
const udpSocket = dgram.createSocket('udp4');
const tcpServer = net.createServer();

//data gram from socket UDP stolen from station
udpSocket.bind(PROTOCOL_MULTICAST_PORT, function() {
  console.log("Joining orchestra");
  udpSocket.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});


// stolen and adapted from station
// adds a musician to the orchestra each time a msg is send
udpSocket.on('message', function(msg, source) {
    console.log("Musician has arrived: " + msg + ". Source port: " + source.port);
    addMusician(msg);
});

function addMusician(musician){
    const musicianJSON = JSON.parse(musician.toString());
    console.log('salut c coolcool');
    orchestra.set( // set as you can hear the same musician more than once
        musicianJSON.uuid,{
            sound:musicianJSON.sound,
            instrument:musicianJSON.instrument,
            activeSince: musicianJSON.activeSince,
            lastTimeHeard: moment().format(),
    });
}

setInterval(checkAndRemoveMusician, TIME_FOR_CHECK);

// this for each only works in ECMAScript2015 and over
function checkAndRemoveMusician(){
    for(let [uuid,musician] of orchestra.entries()){
        if(moment().diff(moment(musician.lastTimeHeard),'second')>=INACTIVITY_TIME){
            orchestra.delete(uuid);
            console.log('musician number '+uuid+' was not heard for a long time, get rid of him!');
        }
    }
}

//tcp part
tcpServer.on('connection',(socket) => {
    let payload = [];
    for(let [uuid,musician] of orchestra.entries()){
        payload.push({
            uuid:uuid,
            instrument: musician.instrument,
            activeSince:musician.activeSince,
        });
        console.log('we sent '+uuid+' through the tcp socket');
    }

    socket.write(JSON.stringify(payload));
    socket.end();
});

tcpServer.listen(PROTOCOL_TCP_PORT);