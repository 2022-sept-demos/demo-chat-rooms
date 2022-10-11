import { getProfile, getUser, signOutUser } from '../fetch-utils.js';

// make sure we have a user!
const user = getUser();

if (!user) {
    // redirect to /auth page, passing along where the user was redirected _from_
    location.replace(`/auth/?redirectUrl=${encodeURIComponent(location)}`);
}

const userAvatar = document.getElementById('user-avatar');
const username = document.getElementById('username');

let error = null;
let profile = null;

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;

    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    } else {
        displayProfile();
    }
});

// If there is a sign out link, attach handler for calling supabase signout
const signOutLink = document.getElementById('sign-out-link');
if (signOutLink) {
    signOutLink.addEventListener('click', () => {
        signOutUser();
    });
}

function displayProfile() {
    if (userAvatar) {
        userAvatar.src = profile.avatar_url;
        userAvatar.alt = profile.username;
    }
    if (username) {
        username.textContent = profile.username;
    }
}
