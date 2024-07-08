const STORAGE_TOKEN = 'UY899CPB6WZ44CDXBRDJRUION8Q0UGN0Y4TMPRYQ';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Stores an item in remote storage using a specific key.
 *
 * @param {string} key - The key under which to store the value.
 * @param {any} value - The value to be stored.
 * @returns {Promise} A promise that resolves with the response from the storage service.
 */
async function setItem(key, value) {
    let payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Retrieves an item from remote storage using a specific key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise} A promise that resolves with the value of the retrieved item.
 */
async function getItem(key) {
    let url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => res.data.value);
}