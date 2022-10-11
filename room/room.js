/* Imports */
// this will check if we have a user and set signout link if it exists
import '../auth/user.js';
import { createMessage, getRoom, getMessage } from '../fetch-utils.js';
import { renderMessage } from '../render-utils.js';

/* Get DOM Elements */
const errorDisplay = document.getElementById('error-display');
const roomTopic = document.getElementById('room-topic');
const roomDescription = document.getElementById('room-description');
const messageList = document.getElementById('message-list');
const addMessageForm = document.getElementById('add-message-form');

/* State */
let error = null;
let room = null;

/* Events */
window.addEventListener('load', async () => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (!id) {
        //  No id found, redirect back to room list
        location.assign('/');
        // don't run the rest of the code in the function
        return;
    }

    const response = await getRoom(id);
    error = response.error;
    room = response.data;

    if (error) {
        displayError();
    }

    if (!room) {
        //  No room associated with this id, redirect
        location.assign('/');
    } else {
        displayRoom();
        displayMessages();
    }
});

addMessageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addMessageForm);
    const messageInsert = {
        room_id: room.id,
        text: formData.get('text'),
    };

    const response = await createMessage(messageInsert);
    error = response.error;

    if (error) {
        displayError();
    } else {
        addMessageForm.reset();
        const messageResponse = await getMessage(response.data.id);
        error = messageResponse.error;
        if (error) {
            displayError();
        } else {
            const message = messageResponse.data;
            room.messages.unshift(message);
            displayMessages();
        }
    }
});

/* Display Functions */

function displayError() {
    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}

function displayRoom() {
    roomTopic.textContent = room.topic;
    roomDescription.textContent = room.description;
}

function displayMessages() {
    messageList.innerHTML = '';
    for (const message of room.messages) {
        const messageEl = renderMessage(message);
        messageList.append(messageEl);
    }
}
