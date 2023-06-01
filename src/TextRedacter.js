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
        this.pasteContent();
        console.log('keyDown');
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
    console.log('pasteContent');
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
        const pastableContent = await navigator.clipboard.readText();
        const textArea = document.querySelector('#prompt-textarea');
        if (pastableContent && textArea) {
          console.log('pastableContent', pastableContent)
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
        elementName = elementName.replace('tag', '').toLowerCase();
        if (['svg', 'a', 'p', 'h1', 'ul', 'li','div'].includes(elementName) && redactionValue !== ' ') { 
          console.log('settings',setting, elementName)

          console.log('redactionValue', redactionValue)
          redactedString = this.redactHtmlTag(redactedString, elementName, redactionValue);
          console.log('redactedString', redactedString)
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

  redactHtmlTag(html, tag, setting) {
      // Parse el html string a un documento
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Determina el modo de redacción basado en el ajuste
      let redactMode = '';
      let classOrIdName = '';
      if (setting === '*') {
          redactMode = 'all';
      } else if (setting === ' ') {
          redactMode = 'none';
      } else if (setting.startsWith('.')) {
          redactMode = 'class';
          classOrIdName = setting.slice(1);  // elimina el '.' inicial
      } else if (setting.startsWith('#')) {
          redactMode = 'id';
          classOrIdName = setting.slice(1);  // elimina el '#' inicial
      }

      // Encuentra todas las etiquetas que coinciden y redacta el contenido según sea necesario
      const elements = doc.getElementsByTagName(tag);
      for (let i = 0; i < elements.length; i++) {
          
        if (['always', 'all'].includes(redactMode) ) {
            elements[i].innerHTML = '<!-- redacted -->';
        } else if (redactMode === 'class' && elements[i].classList.contains(classOrIdName)) {
            elements[i].innerHTML = '<!-- redacted -->';
        } else if (redactMode === 'id' && elements[i].id === classOrIdName) {
            elements[i].innerHTML = '<!-- redacted -->';
        }
      }

      // Devuelve la cadena de HTML actualizada
      console.log('doc.documentElement.outerHTML', doc.documentElement.outerHTML)
      return doc.documentElement.outerHTML;
  }

  
  redactCodeContent(elementName, redactionValue, inputString){
    const regex = new RegExp(`${elementName} \\w+\\([\\s\\S]*?\\}`, 'g');
    const replacement = redactionValue === '*' ? `${elementName} { // redacted }` : '';
    return inputString.replace(regex, replacement);
  }
  
}

export default TextRedacter;
