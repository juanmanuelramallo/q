import { room } from "./room";


const happyMessagesList = [
  "JUGAS MEJOR QUE MANANA",
  "RETIRATE HIJO DE PUTA",
  "AVERIGUASTE DE QUE JUGAS",
  "TENES LAG EN EL CEREBRO",
  "DOWN",
  "ESCUPI EL FITITO",
  "HACE ALGO",
  "CORRETE QUE ESTAN JUGANDO",
  "TE VA A ORINAR UN PERRO"
]

const happyMessages = () => {
  var players = room.getPlayerList()
  if (players.length > 1){
    var playerList = players.filter(function(value){ return value.position !== null})
    var message = playerList[Math.floor(Math.random() * playerList.length)].name.toUpperCase() + " " + happyMessagesList[Math.floor(Math.random() * happyMessagesList.length)]
    room.sendAnnouncement(message, null, 0x0080ff, 'bold', 0)
  }   
}

function sendHappyMessages() {
  setInterval(happyMessages, 60000)
}

export { sendHappyMessages };
