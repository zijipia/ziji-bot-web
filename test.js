function connect(url) {
	return new Promise((resolve, reject) => {
		let ws = new WebSocket(url);

		ws.onopen = () => resolve(ws);

		ws.onerror = (e) => console.log(e);
	});
}
connect("http://87.106.52.7:6094")
	.then((ws) => {
		// use ws
		console.log("ws connect");
	})
	.catch((err) => {
		// unable to connect
		console.log("ws err");
		console.log(err);
	});
