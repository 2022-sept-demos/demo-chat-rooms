/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { addFavoriteRoom, getRooms, getUser, removeFavoriteRoom } from './fetch-utils.js';
import { renderRoom } from './render-utils.js';

/* Get DOM Elements */
const roomList = document.getElementById('room-list');
const errorDisplay = document.getElementById('error-display');

/* State */
const user = getUser();
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
        const roomEl = renderRoom(room, user.id);
        roomList.append(roomEl);

        const favoriteButton = roomEl.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', async () => {
            if (favoriteButton.classList.contains('favorited')) {
                const response = await removeFavoriteRoom(room.id);
                error = response.error;
                if (error) {
                    displayError();
                } else {
                    for (let i = 0; i < room.favorites.length; i++) {
                        if (room.favorites[i].user_id === user.id) {
                            room.favorites.splice(i, 1);
                            break;
                        }
                    }
                    displayRooms();
                }
            } else {
                const response = await addFavoriteRoom(room.id);
                error = response.error;
                if (error) {
                    displayError();
                } else {
                    room.favorites.push(response.data);
                    displayRooms();
                }
            }
        });
    }
}
