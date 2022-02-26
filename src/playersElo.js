let url = "https://haxrecordings.s3.amazonaws.com/scoarboard.json";

let playersElo = async function () {
  const result = await fetch(url)

  return result.json();
};

export default playersElo();
