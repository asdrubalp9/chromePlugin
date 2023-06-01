import ElementMonitor from './elementMonitor.js';

// TODO:
// agregar funcion para saber si termino de escribir chad
// que al descargar el html, se copien todos los estilos y se agreguen
// instalar SWAL

function HTMLInjector(HTML, selector, position) {
  // 'beforebegin': Antes del elemento en sí.
  // 'afterbegin': Justo dentro del elemento, antes de su primer hijo.
  // 'beforeend': Justo dentro del elemento, después de su último hijo.
  // 'afterend': Después del elemento en sí.
  var intervalId = setInterval(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((element) => {
        element.insertAdjacentHTML(position, HTML);
      });
      clearInterval(intervalId);
    }
  }, 1000); // 1000ms = 1s
}

const copyPasteBtn = `
    <button id="copyPasteBtn" style="position: fixed;top: 6em;right: 1em;border-radius: 50%;height: 50px;width: 50px;display: flex;align-items: center;justify-content: center;" class="btn btn-neutral shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>
    </button>
`;
const downloadBtnHTML = `
    <button id="downloadBtn" style="position: fixed;top: 1em;right: 1em;border-radius: 50%;height: 50px;width: 50px;display: flex;align-items: center;justify-content: center;" class="btn btn-primary shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style=" height: 20px; fill: #ffffff;"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
    </button>
`;
// Añade el botón al DOM
document.body.insertAdjacentHTML('beforeend', downloadBtnHTML);
document.body.insertAdjacentHTML('beforeend', copyPasteBtn);
// Conecta el botón con la función de descarga
document.getElementById('downloadBtn').addEventListener('click', () => {
  // Encuentra el elemento usando el selector CSS
  downloadHTMLContent();
});
document.getElementById('copyPasteBtn').addEventListener('click', () => {
  // Encuentra el elemento usando el selector CSS
  clearPastableContent();
});
function downloadHTMLContent() {
  const selector = '#__next main';
  const element = document.querySelector(selector);
  const titleSelector = 'nav .bg-gray-800';
  const title = document.querySelector(titleSelector);
  if (title) {
    if (element) {
      const htmlContent = element.outerHTML;

      const regex = /(<textarea.*?<\/textarea>)|(<button.*?<\/button>)|(<input.*?>)|(<svg.*?<\/svg>)/g;
      const htmlContentCleaned = htmlContent.replace(regex, '');

      // Recoge todos los elementos de estilo y hojas de estilo enlazadas
      const styleElements = document.querySelectorAll('style, link[rel="stylesheet"],link[as="style"],link[rel="preload"],link[href*="css"]');

      // Recorre cada elemento de estilo y hoja de estilo enlazada
      let stylesString = '';
      styleElements.forEach((styleElement) => {
        // Si es un elemento de estilo, agrega su contenido a stylesString
        if (styleElement.tagName.toLowerCase() === 'style') {
          stylesString += styleElement.innerText;
        }
        // Si es una hoja de estilo enlazada, agrega todo su contenido a stylesString
        else if (styleElement.tagName.toLowerCase() === 'link') {
          // Realiza una solicitud HTTP para obtener el contenido de la hoja de estilo
          // Nota: esto puede fallar debido a restricciones de CORS dependiendo de la hoja de estilo
          fetch(styleElement.href)
            .then((response) => response.text())
            .then((css) => {
              stylesString += css;
            });
        }
      });
      console.log('stylesString', stylesString);
      const styleTag = `<style>${stylesString}</style>`;
      const htmlContentWithStyles = htmlContentCleaned + styleTag;
      const blob = new Blob([htmlContentWithStyles], { type: 'text/html' });

      const url = URL.createObjectURL(blob);

      chrome.runtime.sendMessage({ url, title: title.innerText });
    } else {
      console.log(`No se encontró ningún elemento con el selector ${selector}`);
    }
  } else {
    alert('Debes seleccionar una conversacion primero');
  }
}

function clearPastableContent() {
  // check if have permission to get access to clipboard
  navigator.permissions.query({ name: 'clipboard-read' }).then((result) => {
    if (result.state == 'granted' || result.state == 'prompt') {
      navigator.clipboard.readText()
        .then((pastableContent) => {
          const textarea = document.querySelector('textarea');
          if (pastableContent && textarea) {
            const text = pastableContent.replace(/[\r\n]+/g, ' ');
            console.log('pastableContent', pastableContent, text);
            textarea.value += text;
            textarea.style.height = `${264}px`;
            textarea.focus();
          } else {
            console.log('could not find textArea');
          }
        })
        .catch((err) => {
          console.error('Failed to read clipboard contents: ', err);
        });
    }
  });
}
console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

setTimeout(() => {
  console.log('ding');
  const audioUrl = chrome.runtime.getURL('ding.mp3');
  const audio = new Audio(audioUrl);
  audio.play();
}, 2000);
// let myMonitor = new ElementMonitor('myElementId');
// myMonitor.init();
