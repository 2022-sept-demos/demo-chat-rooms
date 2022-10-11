/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { getRooms } from './fetch-utils.js';
import { renderRoom } from './render-utils.js';

/* Get DOM Elements */
const roomList = document.getElementById('room-list');
const errorDisplay = document.getElementById('error-display');

/* State */
let error = null;
let rooms = [];

/* Events */
window.addEventListener('load', async () => {
    const response = await getRooms();
    error = response.error;
    rooms = response.data;
    if (error) {
        displayError();
    }
    if (rooms) {
        displayRooms();
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

function displayRooms() {
    roomList.innerHTML = '';

    for (const room of rooms) {
        const roomEl = renderRoom(room);
        roomList.append(roomEl);
    }
}
