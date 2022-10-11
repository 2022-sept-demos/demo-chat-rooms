/* Imports */
// this will check if we have a user and set signout link if it exists
import '../auth/user.js';
import { createRoom } from '../fetch-utils.js';

/* Get DOM Elements */
const roomForm = document.getElementById('room-form');
const errorDisplay = document.getElementById('error-display');

/* State */
let error = null;

/* Events */

roomForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(roomForm);

    const room = {
        topic: formData.get('topic'),
        description: formData.get('description'),
    };

    const response = await createRoom(room);
    error = response.error;

    if (error) {
        displayError();
    } else {
        location.assign('/');
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
