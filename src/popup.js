document.addEventListener('DOMContentLoaded', function () {
    const notifier = document.querySelector('.notifier');
    const loadingScreen = document.querySelector('.loadingScreen');
    const optionScreen = document.querySelector('.optionScreen');
    console.log('DOMContentLoaded', loadingScreen,optionScreen)
    loadingScreen.classList.add('d-none');
    optionScreen.classList.remove('d-none');
    const saveButton = document.getElementById('save');
    const soundRadio1 = document.getElementById('soundRadio1');
    const soundRadio2 = document.getElementById('soundRadio2');
    const soundRadio3 = document.getElementById('soundRadio3');

    // Load the current setting and set the radio buttons
    chrome.storage.sync.get('sound', function(data) {
        console.log('data', data.sound)
        switch (data.sound) {
            case 'always':
                soundRadio1.checked = true;
                break;
            case 'notFocused':
                soundRadio2.checked = true;
                break;
            case 'never':
                soundRadio3.checked = true;
                break;
            default:
                soundRadio1.checked = true;
                break;
        }
    });

     getSoundSetting((soundSetting) => {
        setRadioButtons(soundSetting);
    });

    // Save the settings when radio buttons change
    [soundRadio1, soundRadio2, soundRadio3].forEach((radioButton) => {
        radioButton.addEventListener('change', function() {
            saveSoundSetting(radioButton.value);
        });
    });

    saveButton.addEventListener('click', function() {
        let soundSetting = 'always'; // Default value
        console.log(soundRadio1.checked, soundRadio2.checked, soundRadio3.checked)
        switch (key) {
            case soundRadio1.checked:
                soundSetting = 'always';
                break;
            case soundRadio2.checked:
                soundSetting = 'notFocused';
                break;
            case soundRadio3.checked:
                soundSetting = 'never';
                break;
            default:
                soundSetting = 'always';
                break;
        }

        // Save the settings
        try {
            chrome.storage.sync.set({ 'sound': soundSetting }, function() {
                notifier.innerText = 'Settings saved!';
            });
            
        } catch (error) {
            console.log('error', error)
        }
    });
});
function getSoundSetting(callback) {
    chrome.storage.sync.get('sound', function(data) {
        callback(data.sound || 'always'); // Default to 'always' if no setting is found
    });
}

function saveSoundSetting(soundSetting) {
    chrome.storage.sync.set({ 'sound': soundSetting }, function() {
        document.querySelector('.notifier').innerText = 'Settings saved!';
        console.log('Settings saved');
    });
}

function setRadioButtons(soundSetting) {
    const soundRadio1 = document.getElementById('soundRadio1');
    const soundRadio2 = document.getElementById('soundRadio2');
    const soundRadio3 = document.getElementById('soundRadio3');

    soundRadio1.checked = (soundSetting === 'always');
    soundRadio2.checked = (soundSetting === 'notFocused');
    soundRadio3.checked = (soundSetting === 'never');
}

document.getElementById('optionsLink').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
    }
});