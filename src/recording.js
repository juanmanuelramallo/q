function download(filename, uint8Array) {
  var element = document.createElement('a');
  var blob = new Blob([uint8Array], { type: "text/html;charset=UTF-8" });
  var url = URL.createObjectURL(blob);
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function handleStopRecording(recording) {
  var today = new Date();
  var filename = "Recording " + today.toDateString() + " " + today.toLocaleTimeString() + ".hbr2";
  download(filename, recording);
  // TODO: Perhaps send it to a s3-like service
}

export { handleStopRecording };
