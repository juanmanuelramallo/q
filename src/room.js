var room = HBInit({
	roomName: "Longaniza",
	maxPlayers: 16,
	noPlayer: true
});

room.setDefaultStadium("Big");
room.setScoreLimit(1);
room.setTimeLimit(0);

export {room};
