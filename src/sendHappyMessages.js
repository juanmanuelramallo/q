import { room } from "./room";
import { randomInt } from "./utils";


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
  var players = room.getPlayerList();
  var playerList = players.filter((player) => player.position !== null);
  if (players.length > 1 && playerList.length > 0) {
    var message = playerList[randomInt(playerList.length)].name.toUpperCase() + " " + happyMessagesList[randomInt(happyMessagesList.length)];
    room.sendAnnouncement(message, null, 0x0080ff, 'bold', 0);
  }   
}

function sendHappyMessages() {
  setInterval(happyMessages, 60000);
}

export { sendHappyMessages };
