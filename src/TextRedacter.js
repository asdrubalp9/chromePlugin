import { formFields } from './config.js';

class TextRedacter {
  constructor() {
    this.textAreaClass = 'prompt-textarea';
    this.init();
  }

  init() {
    this.setupEventListeners();
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
    let settings = {};
    
    const formFieldsSorted = formFields.sort((a, b) => (a.name === 'oneLiner') ? 1 : -1);
    const configKeys = formFieldsSorted.filter((field) => field?.name && field?.name?.toLowerCase().includes('redaction') || field?.name && field?.name?.toLowerCase().includes('oneliner'));

    const settingsPromise = new Promise((resolve, reject) => {
      const configKeyNames = configKeys.map(key => key.name);

      chrome.storage.sync.get(configKeyNames, (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          settings = result;
          for (const key of configKeys) {
            if (!settings.hasOwnProperty(key.name) || !settings[key.name]) {
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
      if (settings.oneLiner === 'always') {
        redactedString = redactedString.replace(/[\r\n]+|\s{2,}/g, ' ');
      }
      return redactedString;
    }).catch((error) => {
      console.error('Failed to get settings from Chrome storage:', error);
      return inputString;
    });
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
    // Verificar si tiene etiquetas HTML
    
    html = this.extractHtmlElements(html);
    // Crear un DOMParser para analizar el string como HTML
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    
    // Verificar si la configuración requiere redacción
    if (config === ' ') {
        return doc.body.innerHTML;
    }
    // Identificar los elementos con los selectores proporcionados
    var selectors = selectorString.split(',');
    selectors.forEach(function(sel) {

        var elements = doc.querySelectorAll(sel.trim());
        elements.forEach(function(el) {
            // Redactar el contenido del elemento
            el.innerHTML = '<!-- redacted -->';
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
