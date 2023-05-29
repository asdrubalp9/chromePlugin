import { formFields } from './config.js';

class TextRedacter {
  constructor() {
    this.textAreaClass = 'prompt-textarea';
    this.init();
  }

  init() {
    console.log('initialize');
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('setupEventListeners');
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyZ') {
        this.clearPastableContent();
        console.log('keyDown');
      }
    });

    const copyPasteBtn = document.querySelector('.copyPasteBtn');
    if (copyPasteBtn) {
      copyPasteBtn.addEventListener('click', () => {
        this.clearPastableContent();
        console.log('btnClick');
      });
    }
  }

  clearPastableContent() {
  console.log('clearPastableContent');
  navigator.permissions.query({ name: 'clipboard-read' }).then((result) => {
    if (result.state == 'granted' || result.state == 'prompt') {
      navigator.clipboard.readText().then((pastableContent) => {
        const textArea = document.querySelector('#prompt-textarea');
        if (pastableContent && textArea) {
          this.redactContent(pastableContent).then(text => {
            textArea.value += text;
            textArea.style.height = '264px';
            textArea.focus();
          });
        } else {
          console.error('Could not find textArea with class:', this.textAreaClass);
        }
      }).catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
    }
  });
}

  redactContent(inputString) {
    let settings = {};

    const configKeys = formFields.filter((field) => field?.name && field?.name?.toLowerCase().includes('redaction') || field?.name && field?.name?.toLowerCase().includes('oneliner'));
    const settingsPromise = new Promise((resolve, reject) => {
      // Extract the 'name' properties from configKeys to use with chrome.storage.sync.get
      const configKeyNames = configKeys.map(key => key.name);

      chrome.storage.sync.get(configKeyNames, (result) => {
        console.log('result', configKeys, result);
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          settings = result;
          for (const key of configKeys) {
            // Use the 'name' property as the key
            if (!settings.hasOwnProperty(key.name) || !settings[key.name]) {
              // If the setting is not found or its value is falsey, use the 'defaultValue' property
              settings[key.name] = key.defaultValue;
            }
          }
          resolve();
        }
      });
    });

    return settingsPromise.then(() => {
      let redactedString = inputString;
      for (const setting in settings) {
        const redactionValue = settings[setting];

        if (setting === 'svgRedaction' && redactionValue === 'always') {
          const regex = /<svg[\s\S]*?<\/svg>/g;
          const redactedContent = '<svg><!-- redacted --></svg>';
          redactedString = redactedString.replace(regex, redactedContent);
        } else if (redactionValue === '*') {
          const regex = new RegExp(`<${setting}[\\s\\S]*?<\\/${setting}>`, 'g');
          const redactedContent = `<${setting}><!-- redacted --></${setting}>`;
          redactedString = redactedString.replace(regex, redactedContent);
        } else if (redactionValue === ' ') {
          // No hacer nada si el valor de la redacción es un espacio en blanco
        } else {
          const elementsNotToRedact = redactionValue.split(',');
          for (const element of elementsNotToRedact) {
            const regex = new RegExp(`<${setting}[\\s\\S]*?${element.trim()}[\\s\\S]*?<\\/${setting}>`, 'g');
            redactedString = redactedString.replace(regex, (match) => match);
          }
        }
      }
      if (settings.oneLiner === 'always') {
        redactedString = redactedString.replace(/[\r\n]+|\s{2,}/g, ' ');
      }
      console.log('redactedString', redactedString);
      return redactedString;
    }).catch((error) => {
      console.error('Failed to get settings from Chrome storage:', error);
      return inputString;
    });
  }
}

export default TextRedacter;
