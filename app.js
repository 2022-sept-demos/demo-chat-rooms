/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import {
    addFavoriteRoom,
    getRooms,
    getUser,
    onRoomFavorite,
    removeFavoriteRoom,
} from './fetch-utils.js';
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

    onRoomFavorite(handleFavorite, handleUnfavorite);
});

function handleFavorite(payload) {
    for (const room of rooms) {
        // is this the room we're looking for?
        if (room.id === payload.new.room_id) {
            // add then new favorite and redisplay
            room.favorites.push(payload.new);
            displayRooms();
            // stop looping because we're done
            break;
        }
    }
}

function handleUnfavorite(payload) {
    for (const room of rooms) {
        // if this isn't the room we're looking for, continue looping
        if (room.id !== payload.old.room_id) {
            continue;
        }

        // go throught the favorites of this room
        for (let i = 0; i < room.favorites.length; i++) {
            // is this the favorite we're looking for (based on user id of what was deleted)
            if (room.favorites[i].user_id === payload.old.user_id) {
                // we use the for...i syntax so we already have the index of the one to remove
                room.favorites.splice(i, 1);
                // redisplay
                displayRooms();
                // stop looping cause we're done
                break;
            }
        }
    }
}

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
                const response = await removeFavoriteRoom(room.id, user.id);
                error = response.error;
                if (error) {
                    displayError();
                }
            } else {
                const response = await addFavoriteRoom(room.id, user.id);
                error = response.error;
                if (error) {
                    displayError();
                }
            }
        });
    }
}
