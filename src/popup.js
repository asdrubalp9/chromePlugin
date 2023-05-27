import FormGenerator from './formGenerator.js';
const formFields = [
    {
        name: 'sound',
        label: 'Sound configuration',
        name: 'sound',
        placeholder: 'Sound configuration',
        htmlId: 'sound',
        htmlclass: '',
        value: '',
        defaultValue: 'always',
        type: 'radio',
        Hint: '',
        options: [
            {
                label: 'Always sound when chatGPT finishes',
                value: 'always',
            },
            {
                label: 'Only sound when chatGPT is not focused',
                value: 'notFocused',
            },
            {
                label: 'Never make a sound',
                value: 'never',
            },
        ]
    },
    {
        name: 'oneLiner',
        label: 'Eliminate breakspaces, double spaces and new lines',
        name: 'oneLiner',
        htmlId: 'oneLiner',
        htmlclass: '',
        value: '',
        defaultValue: 'always',
        type: 'radio',
        Hint: '',
        options: [
            {
                label: 'Always',
                value: 'always',
            },
            {
                label: 'Never',
                value: 'never',
            },
        ]
    },
    {
        name: 'svg',
        label: 'SVG Redaction',
        name: 'svg',
        placeholder: 'SVG Redaction',
        htmlId: 'svg',
        htmlclass: '',
        value: '',
        defaultValue: 'always',
        type: 'radio',
        Hint: '',
        options: [
            {
                label: `Always redact`,
                value: `always`,
            },
            {
                label: `Never Redact`,
                value: `never`,
            },
        ]
    },
]

const typeOfElements = [
    
    {
        name: 'aTag',
        label: 'a tag',
        type: 'text',
    },
    {
        name: 'pTag',
        label: 'p tag',
        type: 'text',
    },
    {
        name: 'h1Tag',
        label: 'h1 tag',
        type: 'text',
    },
    {
        name: 'h2Tag',
        label: 'h2 tag',
        type: 'text',
    },
    {
        name: 'h3Tag',
        label: 'h3 tag',
        type: 'text',
    },
    {
        name: 'h4Tag',
        label: 'h4 tag',
        type: 'text',
    },
    {
        name: 'h5Tag',
        label: 'h5 tag',
        type: 'text',
    },
    {
        name: 'h6Tag',
        label: 'h6 tag',
        type: 'text',
    },
    {
        name: 'ulTag',
        label: 'ul tag',
        type: 'text',
    },
    {
        name: 'liTag',
        label: 'li tag',
        type: 'text',
    },
    {
        name: 'function',
        label: 'Function',
        type: 'text',
    },
    {
        name: 'class',
        label: 'Class',
        type: 'text',
    },
    {
        name: 'Object',
        label: 'Object',
        type: 'text',
    },
    {
        name: 'Interface',
        label: 'Interface',
        type: 'text',
    },
    {
        name: 'Array',
        label: 'Array',
        type: 'text',
    },
    {
        name: 'Variable',
        label: 'Variable',
        type: 'text',
    },
    {
        name: 'Dictionary',
        label: 'Dictionary',
        type: 'text',
    },
    
]
let k = 0;
for (let element of typeOfElements) {
    let temp = {
        name: `${element.name.toLowerCase().replace(' ','')}Redaction`,
        label: `${element.label}`,
        htmlId: `${element.name.toLowerCase().replace(' ','')}Redaction${++k}`,
        htmlclass: ``,
        value: ``,
        type: element.type
    }
    if(element.type === 'radio'){
        temp.defaultValue = `always`
    }
    if(element.type.includes('text')){
        temp.defaultValue = `*`
        temp.value = `*`
        temp.placeholder = `Redact content of all ${element.name.toLowerCase()} except for the separated by comas, example: "div1,div2,div3"`
        temp.label = `${element.name.toLowerCase()} redaction | * for all or do not clear the separated by comas, leave empty for no redaction of this element`
        temp.hint = `* for all or do not clear the separated by comas, leave empty for no redaction of this element`
    }
    if(element?.options){
        temp.options = element.options
    }
    formFields.push(temp)
}

let formGenerator = new FormGenerator('.optionScreen', formFields);
formGenerator.generateForm().then(() => {
    console.log('Form has been generated.');
}).catch(error => {
    console.error('Failed to generate form:', error);
});



const loadingScreen = document.querySelector('.loadingScreen');
const optionScreen = document.querySelector('.optionScreen');
loadingScreen.classList.add('d-none');
optionScreen.classList.remove('d-none');
/*
document.addEventListener('DOMContentLoaded', function () {
    const notifier = document.querySelector('.notifier');
    console.log('DOMContentLoaded', loadingScreen,optionScreen)
    const saveButton = document.getElementById('save');
    const soundRadio1 = document.getElementById('soundRadio1');
    const soundRadio2 = document.getElementById('soundRadio2');
    const soundRadio3 = document.getElementById('soundRadio3');
    const redactSvg1 = document.getElementById('redactSvg1');
    const redactSvg2 = document.getElementById('redactSvg2');
    

    // Load the current setting and set the radio buttons
    chrome.storage.sync.get('redactSvg', function(data) {
        console.log('data', data.redactSvg)
        switch (data.redactSvg) {
            case 'always':
                redactSvg1.checked = true;
                break;
            case 'notFocused':
                redactSvg2.checked = true;
                break;
            default:
                redactSvg1.checked = true;
                break;
        }
    });
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

getSvgSetting((svgSetting) => {
  setRedactSvgCheckbox(svgSetting);
});

// Save the settings when redactSvg checkboxes change
[redactSvg1, redactSvg2].forEach((checkbox) => {
  checkbox.addEventListener('change', function() {
    saveSvgSetting(checkbox.id, checkbox.checked);
  });
});

function getSvgSetting(callback) {
  chrome.storage.sync.get('redactSvg', function(data) {
    callback(data.redactSvg || 'redactSvg1'); // Default to 'redactSvg1' if no setting is found
  });
}

function saveSvgSetting(svgSettingId, svgSettingValue) {
  chrome.storage.sync.set({ 'redactSvg': svgSettingId }, function() {
    document.querySelector('.notifier').innerText = 'SVG setting saved!';
    console.log('SVG setting saved');
  });
}

function setRedactSvgCheckbox(svgSetting) {
  const redactSvg1 = document.getElementById('redactSvg1');
  const redactSvg2 = document.getElementById('redactSvg2');
  redactSvg1.checked = (svgSetting === 'redactSvg1');
  redactSvg2.checked = (svgSetting === 'redactSvg2');
}
*/