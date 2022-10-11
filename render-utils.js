export function renderRoom(room) {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = `/room/?id=${room.id}`;
    a.textContent = room.topic;

    li.append(a);

    return li;
}

export function renderMessage(message) {
    const li = document.createElement('li');

    const div = document.createElement('div');
    div.classList.add('info-byline');

    const img = document.createElement('img');
    img.classList.add('avatar');
    img.src = message.user.avatar_url;
    img.alt = message.user.username;

    const userNameSpan = document.createElement('span');
    userNameSpan.textContent = message.user.username;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('created-date');
    dateSpan.textContent = new Date(message.created_at).toLocaleString('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    const p = document.createElement('p');
    p.textContent = message.text;

    div.append(img, userNameSpan, dateSpan);

    li.append(div, p);

    return li;
}
