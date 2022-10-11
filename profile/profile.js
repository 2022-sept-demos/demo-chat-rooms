import '../auth/user.js';
import { getUser, updateProfile, getProfile, uploadImage } from '../fetch-utils.js';

const user = getUser();

const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const profileForm = document.getElementById('profile-form');
const updateButton = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');

let profile = null;
let error = null;

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;

    if (error) {
        displayError();
    } else {
        displayProfile();
    }
});

avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    } else {
        preview.src = '/assets/avatar.jpeg';
    }
});

profileForm.addEventListener('submit', async (e) => {
    // keep the form from changing the browser page
    e.preventDefault();

    // niceties for "saving" and errors:
    // reset the error
    errorDisplay.textContent = '';
    // remember the button text
    const buttonText = updateButton.textContent;
    // disabled button and change to "saving..."
    updateButton.disabled = true;
    updateButton.textContent = 'Saving...';

    // create a form data object for easy access to form values
    const formData = new FormData(profileForm);

    // initial profile update
    const profileUpdate = {
        // id: user.id,
        username: formData.get('username'),
    };

    // get the avatar file from the form
    const imageFile = formData.get('avatar');
    // Do we have a file? If so size will be > 0
    if (imageFile.size) {
        // put the image in the bucket using the user id
        // as a folder, and whatever file name the uploaded
        // image has
        const imagePath = `${user.id}/${imageFile.name}`;
        // do the upload and get the returned url
        const url = await uploadImage('avatars', imagePath, imageFile);
        // add the url property to the update object
        profileUpdate.avatar_url = url;
    }

    const response = await updateProfile(user.id, profileUpdate);

    error = response.error;

    // did it work?
    if (error) {
        // display the error
        displayError();
        // reset the button to be active
        updateButton.disabled = false;
        // restore the button text to what it was
        updateButton.textContent = buttonText;
    } else {
        // go back to home page
        location.assign('/');
    }
});

function displayProfile() {
    if (profile) {
        userNameInput.value = profile.username;
        // load preview of existing profile
        if (profile.avatar_url) {
            preview.src = profile.avatar_url;
        }
    }
}

function displayError() {
    errorDisplay.textContent = error.message;
}
