import { formFields } from './config.js';

class TextRedacter {
   constructor() {
    this.textAreaClass = 'prompt-textarea';
    this.settings = {};
    this.init();
    this.getSettings();

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        this.updateSettings(changes);
      }
    });
  }

  getSettings() {
    return new Promise((resolve, reject) => {
      const formFieldsSorted = formFields.sort((a, b) => (a.name === 'oneLiner') ? 1 : -1);
      const configKeys = formFieldsSorted.filter((field) => field?.name && field?.name?.toLowerCase().includes('redaction') ||
      field?.name && field?.name?.toLowerCase().includes('oneliner'));
      const configKeyNames = configKeys.map(key => key.name);
      chrome.storage.sync.get(configKeyNames, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          for (const key of configKeys) {
            this.settings[key.name] = result[key.name] || key.defaultValue;
          }
          resolve();
        }
      });
    });
  }

  updateSettings(changes) {
    for (let key in changes) {
      let storageChange = changes[key];
      this.settings[key] = storageChange.newValue;
    }
  }
  

  init() {
    this.setupEventListeners();
  }

  updateSettingsFromStorage() {
    chrome.storage.sync.get(null, (result) => {
      this.settings = result;
    });
  }

  setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyZ') {
        this.pasteContent();
      }
    });

    const intervalIdCopyPaste = setInterval(() => {
      const copyPasteBtn = document.querySelector('#copyPasteBtn');
      if (copyPasteBtn) {
        clearInterval(intervalIdCopyPaste);
    
        copyPasteBtn.addEventListener('click', () => {
          this.pasteContent();
          
        });
      }
    }, 200);
  } 

  async pasteContent() {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
        const pastableContent = await navigator.clipboard.readText();
        const textArea = document.querySelector('#prompt-textarea');
        if (pastableContent && textArea) {
          const redactedContent = await this.redactContent(pastableContent);
          const cursorPosition = textArea.selectionStart;
          textArea.value = textArea.value.substring(0, cursorPosition) + redactedContent + textArea.value.substring(cursorPosition);
          textArea.selectionStart = textArea.selectionEnd = cursorPosition + redactedContent.length;
          textArea.style.height = '264px';
          textArea.focus();
        } else {
          console.error('Could not find textArea with ID: prompt-textarea');
        }
      } else {
        console.error('Clipboard read permission not granted');
      }
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  }
  
  redactContent(inputString) {
    let redactedString = inputString;
    for (const setting in this.settings) {
      const redactionValue = this.settings[setting];
      // Extraemos el nombre del elemento y quitamos 'Redaction'
      let elementName = setting.replace('Redaction', '').toLowerCase();
      if (['selectorSettingsRedaction'].includes(setting) && redactionValue !== ' ') { 
        redactedString = this.redactHtmlCode(redactedString, redactionValue.selector, redactionValue.setting);

      } else if ( ['svgRedaction'].includes(setting) && redactionValue !== ' ') {

        redactedString = this.redactSVGElement(redactionValue, redactedString);

      } else if (['function', 'class', 'object', 'interface', 'array', 'variable', 'dictionary'].includes(elementName) && redactionValue !== ' ') {
        // redactedString = this.redactContent(elementName, redactionValue);
      }
    }
    if (this.settings.oneLiner === 'always') {
      redactedString = redactedString.replace(/[\r\n]+|\s{2,}/g, ' ');
    }
    return redactedString;
  }


  extractHtmlElements(inputString) {
    const regex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/ig;
    let match;
    let matches = [];
    while (match = regex.exec(inputString)) {
        matches.push(match[0]);
    }
    return matches;
  }

  redactHtmlCode(html, selectorString, config) {
    // Si no se requiere redacción, devuelve.
    if (config === ' ') {
        return;
    }
    html = this.extractHtmlElements(html);
    // Crear un DOMParser para analizar el string como HTML
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    // Identificar los selectores proporcionados
    var selectors = selectorString.split(',').map(sel => sel.replace(/\s/g, ''));

    selectors.forEach(sel => {
      // Obtén todos los elementos que coinciden con el selector.
      const elements = doc.querySelectorAll(sel);
      console.log('sel', sel, elements)

      // Reemplaza el contenido de cada elemento seleccionado con '<!-- redacted -->'.
      elements.forEach(element => {
        var elements = doc.querySelectorAll(sel.trim());
        elements.forEach(function(el) {
            // Redactar el contenido del elemento
            el.innerHTML = '<!-- redacted -->';
        });
      });
    });
        return doc.body.innerHTML;
  }


  
  redactSVGElement(settingValue, inputString){
    let regex = new RegExp(`<svg.*?>[\\s\\S]*?<\/svg>`, 'g');
    let replacement = settingValue === '*' ? `<svg><!-- redacted --></svg>` : '';
    inputString = inputString.replace(regex, replacement);
    regex = new RegExp(`<path.*?>[\\s\\S]*?<\/path>`, 'g');
    replacement = settingValue === '*' ? `<path><!-- redacted --></path>` : '';
    inputString = inputString.replace(regex, replacement);1
    return inputString
  }
  
  redactCodeContent(elementName, redactionValue, inputString){
    const regex = new RegExp(`${elementName} \\w+\\([\\s\\S]*?\\}`, 'g');
    const replacement = redactionValue === '*' ? `${elementName} { // redacted }` : '';
    return inputString.replace(regex, replacement);
  }
  
}

export default TextRedacter;
