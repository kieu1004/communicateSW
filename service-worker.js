let getVersionPort;
let count = 0;

self.addEventListener("message", event => {
    try {
        if (event.data && event.data.type === 'INIT_PORT') {
            getVersionPort = event.ports[0];
            console.log("Message port initialized");
        }

        if (event.data && event.data.type === 'INCREASE_COUNT') {
            count++;
            getVersionPort.postMessage({ payload: count });
            console.log("Count increased and sent to the main app");
        }
    } catch (error) {
        console.error('Error in service worker:', error);
    }
});

// Set up channel with the same name as in app.js
const broadcast = new BroadcastChannel('count-channel');

// Listen to the response
broadcast.onmessage = (event) => {
    if (event.data && event.data.type === 'INCREASE_COUNT') {
        broadcast.postMessage({ payload: ++count });
    }
};

// Listen to the request
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INCREASE_COUNT') {
        // Select who we want to respond to
        self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window',
        }).then((clients) => {
            if (clients && clients.length) {
                // Send a response - the clients array is ordered by last focused
                clients[0].postMessage({
                    type: 'REPLY_COUNT',
                    count: ++count,
                });
            }
        });
    }
});