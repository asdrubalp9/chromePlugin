export function getStoredValue(key, defaultValue) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
    });
}