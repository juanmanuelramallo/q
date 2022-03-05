import { downloadFile } from './downloadFile';
import { getRedPlayers, getBluePlayers } from './players';
import { sanitize } from "./utils";
import { getEloDeltaForPlayer } from "./scoreboard";

function postData(blob, filename) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json;version=2");

  var formdata = new FormData();
  formdata.append("match[recording]", blob, filename);

  var redPlayers = getRedPlayers();
  var bluePlayers = getBluePlayers();
  var index = 0;

  redPlayers.forEach(player => {
    formdata.append(`match[match_players_attributes][${index}][team_id]`, "red");
    formdata.append(`match[match_players_attributes][${index}][player_attributes][name]`, player.name);
    formdata.append(`match[match_players_attributes][${index}][elo_change_attributes][value]`, getEloDeltaForPlayer(player));
    index++;
  });

  bluePlayers.forEach(player => {
    formdata.append(`match[match_players_attributes][${index}][team_id]`, "blue");
    formdata.append(`match[match_players_attributes][${index}][player_attributes][name]`, player.name);
    formdata.append(`match[match_players_attributes][${index}][elo_change_attributes][value]`, getEloDeltaForPlayer(player));
    index++;
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };

  fetch(process.env.RECORDING_SAVE_URI, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function handleEndGame(recording) {
  var filename = [Date.now()];
  filename = filename.concat(getRedPlayers().map(player => sanitize(player.name)));
  filename = filename.concat('vs');
  filename = filename.concat(getBluePlayers().map(player => sanitize(player.name)));
  filename = filename.join('-') + '.hbr2';
  var blob = new Blob([recording], { type: 'text/plain;charset=UTF-8' });
  postData(blob, filename);
}

export { handleEndGame };
