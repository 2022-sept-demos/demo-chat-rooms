const SUPABASE_URL = 'https://wtyvuaauhevlxmzwonlf.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0eXZ1YWF1aGV2bHhtendvbmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUxNzEzNTgsImV4cCI6MTk4MDc0NzM1OH0.rTOn_DL_H7m8vw_OcoNYvEyTMsppKiIPMO_n1oXLdNA';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* user profiles */

export async function updateProfile(userId, profile) {
    return await client.from('profiles').upsert(profile).single();
}

export async function getProfile(id) {
    const response = await client.from('profiles').select().match({ id }).maybeSingle();
    return response;
}

export async function getProfiles() {
    return await client.from('profiles').select();
}

/* Data functions */

export async function createRoom(room) {
    return await client.from('rooms').insert(room);
}

export async function addFavoriteRoom(roomId) {
    return await client.from('room_favorites').upsert({ room_id: roomId }).single();
}

export async function removeFavoriteRoom(roomId) {
    return await client.from('room_favorites').delete().eq('room_id', roomId).single();
}

export async function getCategories() {
    return await client.from('categories').select();
}

export async function getRooms() {
    return await client.from('rooms').select(`
        *,
        favorites:room_favorites(user_id)
    `);
}

export async function getRoom(id) {
    return await client
        .from('rooms')
        .select(
            `
            *,
            messages (
                *,
                user:profiles(
                    id,
                    username,
                    avatar_url
                )
            )
        `
        )
        .eq('id', id)
        .order('created_at', { foreignTable: 'messages', ascending: false })
        .single();
}

export async function getMessage(id) {
    return await client
        .from('messages')
        .select(
            `*,
            user:profiles(
                id,
                username,
                avatar_url
            )
        `
        )
        .eq('id', id)
        .single();
}

export async function createMessage(message) {
    return await client.from('messages').insert(message).single();
}

export function onMessage(roomId, handleMessage) {
    client
        // what table and what rows are we interested in?
        .from(`messages:room_id=eq.${roomId}`)
        // what type of changes are we interested in?
        .on('INSERT', handleMessage)
        .subscribe();
}

/* Storage Functions */

export async function uploadImage(bucketName, imagePath, imageFile) {
    // we can use the storage bucket to upload the image,
    // then use it to get the public URL
    const bucket = client.storage.from(bucketName);

    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        // in this case, we will _replace_ any
        // existing file with same name.
        upsert: true,
    });

    if (response.error) {
        // eslint-disable-next-line no-console
        console.log(response.error);
        return null;
    }

    // Construct the URL to this image:
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    // URL Looks like:
    // https://nwxkvnsiwauieanvbiri.supabase.co/storage/v1/object/public/images/rooms/984829079656/Franky.jpeg

    return url;
}
