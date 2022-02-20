import { downloadFile } from './downloadFile';

function handleStopRecording(recording) {
  var today = new Date();
  var filename = "Recording " + today.toDateString() + " " + today.toLocaleTimeString() + ".hbr2";
  downloadFile(filename, recording);
  // TODO: Perhaps send it to a s3-like service
}

export { handleStopRecording };
