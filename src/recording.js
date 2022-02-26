import { downloadFile } from './downloadFile';
import { getRedPlayers, getBluePlayers } from './players';
import { sanitize } from "./utils";

function handleStopRecording(recording) {
  var filename = [Date.now()];
  filename = filename.concat(getRedPlayers().map(player => sanitize(player.name)));
  filename = filename.concat('vs');
  filename = filename.concat(getBluePlayers().map(player => sanitize(player.name)));
  filename = filename.join('-') + '.hbr2';
  downloadFile(filename, recording);
  // TODO: Perhaps send it to a s3-like service
}

export { handleStopRecording };
