import { downloadFile } from './downloadFile';
import { getRedPlayers, getBluePlayers } from './players';
import { sanitize } from "./utils";

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
    index++;
  });

  bluePlayers.forEach(player => {
    formdata.append(`match[match_players_attributes][${index}][team_id]`, "blue");
    formdata.append(`match[match_players_attributes][${index}][player_attributes][name]`, player.name);
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

function handleStopRecording(recording) {
  var filename = [Date.now()];
  filename = filename.concat(getRedPlayers().map(player => sanitize(player.name)));
  filename = filename.concat('vs');
  filename = filename.concat(getBluePlayers().map(player => sanitize(player.name)));
  filename = filename.join('-') + '.hbr2';
  var blob = new Blob([recording], { type: 'text/plain;charset=UTF-8' });
  postData(blob, filename);

  // TODO: Perhaps stop downloading to host machine?
  // downloadFile(filename, recording);
}

export { handleStopRecording };
