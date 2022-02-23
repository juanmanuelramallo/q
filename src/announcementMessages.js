import { randomInt } from "./utils";
import { room } from "./room";

const announcementMessagesList = [
    "LLEGO EL DOWN DE",
    "TODOS SALUDEN A",
    "BIENVENIDO",
    "MIREN AL TARADO DE",
    "TODOS CON EL CULO EN LA PARED, LLEGO",
    "SE SUSPENDE TODO, VINO",
    "VACA YENDO GENTE AL BAILE DIJO"
];

const announcementMessages = (playerName) => {
    room.sendAnnouncement(announcementMessagesList[randomInt(announcementMessagesList.length)] + " " + "✨" + playerName + "✨",
        null, 0x00FF00, 'bold', 2);
}

export { announcementMessages }
