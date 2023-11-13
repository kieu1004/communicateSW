const messageChannel = new MessageChannel();

function initializeMessageChannel() {
    if (navigator.serviceWorker.controller) {
        // Initialize the channel by sending the port to the Service Worker
        navigator.serviceWorker.controller.postMessage({
            type: 'INIT_PORT',
        }, [messageChannel.port2]);

        // Listen to the response
        messageChannel.port1.onmessage = (event) => {
            // Print the result
            console.log(event.data.payload);
        };

        // Then send the first message
        navigator.serviceWorker.controller.postMessage({
            type: 'INCREASE_COUNT',
        });
    } else {
        console.log("Service Worker controller not available yet. Waiting...");
        // Wait for the controller to be available
        navigator.serviceWorker.addEventListener('controllerchange', initializeMessageChannel);
    }
}

// Set up channel
const broadcast = new BroadcastChannel('count-channel');

// Listen to the response
broadcast.onmessage = (event) => {
    console.log(event.data.payload);
};

// Send first request
broadcast.postMessage({
    type: 'INCREASE_COUNT',
});

// Listen to the response from the service worker controller
navigator.serviceWorker.controller.onmessage = (event) => {
    if (event.data && event.data.type === 'REPLY_COUNT_CLIENTS') {
        setCount(event.data.count);
    }
};

// Send first request to the service worker controller
navigator.serviceWorker.controller.postMessage({
    type: 'INCREASE_COUNT_CLIENTS',
});

// Initialize the message channel
initializeMessageChannel();

function setCount(count) {
    // Your implementation of how to handle the count in the main app
    console.log('Received count:', count);
}