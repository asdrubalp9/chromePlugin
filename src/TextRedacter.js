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
            const text = this.redactContent(pastableContent);
            textArea.value += text;
            textArea.style.height = '264px';
            textArea.focus();
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

    const configKeys = [
      'oneLiner', 'svgRedaction', 'aTag', 'pTag', 'h1Tag', 'h2Tag', 'h3Tag',
      'h4Tag', 'h5Tag', 'h6Tag', 'ulTag', 'liTag', 'function', 'class',
      'object', 'Interface', 'array', 'variable', 'dictionary',
    ];

    const settingsPromise = new Promise((resolve, reject) => {
      chrome.storage.sync.get(configKeys, (result) => {
        console.log('result', result);
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          settings = result;

          // Verificar y establecer un solo espacio si no está configurado
          for (const key of configKeys) {
            if (!settings.hasOwnProperty(key) || !settings[key]) {
              settings[key] = ' ';
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
        console.log('settings', settings, redactionValue, setting, settings[setting]);

        if (setting === 'oneLiner' && redactionValue === 'always') {
          redactedString = redactedString.replace(/[\r\n]+|\s{2,}/g, ' ');
        } else if (setting === 'svgRedaction' && redactionValue === 'always') {
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
      return redactedString;
    }).catch((error) => {
      console.error('Failed to get settings from Chrome storage:', error);
      return inputString;
    });
  }
}

export default TextRedacter;
