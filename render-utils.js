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

    li.textContent = message.text;

    return li;
}
