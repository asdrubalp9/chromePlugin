//TODO:
// agregar funcion para saber si termino de escribir chad
// que al descargar el html, se copien todos los estilos y se agreguen
// instalar SWAL


function HTMLInjector(HTML, selector, position) {
  // 'beforebegin': Antes del elemento en sí.
  // 'afterbegin': Justo dentro del elemento, antes de su primer hijo.
  // 'beforeend': Justo dentro del elemento, después de su último hijo.
  // 'afterend': Después del elemento en sí.
    var intervalId = setInterval(function() {
        var elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(function(element) {
                element.insertAdjacentHTML(position, HTML);
            });
            clearInterval(intervalId);
        }
    }, 1000); // 1000ms = 1s
}
const MicBtnHTML = `
 <button id="micBtn" class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent" style="right: 2.5em;">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style=" height: 20px; fill: #d0d0d7;"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path></svg>
 </button>
`;

const speakBtnHTML = `
<button class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 speakBtn">
 <svg stroke="currentColor" fill="#a1a1b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 96 960 960" width="1em"><path d="m801 751-50-50q48-51 73.5-104.5T850 465q0-78-25.5-131.5T751 229l50-50q56 58 87.5 126.5T920 465q0 91-31.5 159.5T801 751ZM662 609l-50-50q18-20 28-42.5t10-51.5q0-29-10-51.5T612 371l50-50q26 28 42 65.5t16 78.5q0 41-16 78.5T662 609Zm-302 6q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM40 936v-94q0-38 19-64.5t49-41.5q51-26 120.5-43T360 676q62 0 131 17t120 43q30 15 49.5 41.5T680 842v94H40Zm60-60h520v-34q0-16-8.5-29.5T587 790q-48-27-109-40.5T360 736q-57 0-118.5 14.5T132 790q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T450 465q0-39-25.5-64.5T360 375q-39 0-64.5 25.5T270 465q0 39 25.5 64.5T360 555Zm0-90Zm0 411Z"/></svg>
</button>
`;
// document.querySelector('textArea').style.paddingRight="60px";
HTMLInjector(MicBtnHTML, 'textarea','afterend');
HTMLInjector(speakBtnHTML, 'main .flex-1 .group:nth-child(odd) .relative .text-gray-400 .flex.gap-1 button:last-child','afterend');


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
    downloadHTMLContent()
});
document.getElementById('copyPasteBtn').addEventListener('click', () => {
    // Encuentra el elemento usando el selector CSS 
    clearPastableContent()
});
function downloadHTMLContent() {
    selector = '#__next main'
    const element = document.querySelector(selector);
    const titleSelector = 'nav .bg-gray-800'
    const title = document.querySelector(titleSelector)
  if(title){
    if (element) {
        const htmlContent = element.outerHTML;

        const regex = /(<textarea.*?<\/textarea>)|(<button.*?<\/button>)|(<input.*?>)|(<svg.*?<\/svg>)/g;
        const htmlContentCleaned = htmlContent.replace(regex, '');

        // Recoge todos los elementos de estilo y hojas de estilo enlazadas
        const styleElements = document.querySelectorAll('style, link[rel="stylesheet"],link[as="style"],link[rel="preload"],link[href*="css"]');

        // Recorre cada elemento de estilo y hoja de estilo enlazada
        let stylesString = '';
        styleElements.forEach(function(styleElement) {
          // Si es un elemento de estilo, agrega su contenido a stylesString
          if (styleElement.tagName.toLowerCase() === 'style') {
            stylesString += styleElement.innerText;
          }
          // Si es una hoja de estilo enlazada, agrega todo su contenido a stylesString
          else if (styleElement.tagName.toLowerCase() === 'link') {
            // Realiza una solicitud HTTP para obtener el contenido de la hoja de estilo
            // Nota: esto puede fallar debido a restricciones de CORS dependiendo de la hoja de estilo
            fetch(styleElement.href)
              .then(response => response.text())
              .then(css => {
                stylesString += css;
              });
          }
        });
        console.log('stylesString',stylesString)
        const styleTag = `<style>${stylesString}</style>`;
        const htmlContentWithStyles = htmlContentCleaned + styleTag;
        const blob = new Blob([htmlContentWithStyles], { type: 'text/html' });

        const url = URL.createObjectURL(blob);

        chrome.runtime.sendMessage({url: url, title: title.innerText});
    } else {
        console.log(`No se encontró ningún elemento con el selector ${selector}`);
    }
  }else{
    alert('Debes seleccionar una conversacion primero')
  }
}

function clearPastableContent() {
  //check if have permission to get access to clipboard
  navigator.permissions.query({name: "clipboard-read"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.readText()
      .then(pastableContent => {
        let textarea = document.querySelector('textarea')
        if(pastableContent && textarea){
          let text = pastableContent.replace(/[\r\n]+/g, ' ');
          console.log('pastableContent', pastableContent, text)
          textarea.value += text
          textarea.style.height=264+'px'
          textarea.focus()
        }else{
          console.log('could not find textArea')
        }
      })
      .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      });
    }
  });
  
}
function chatgptResponseState() {
  let buttonSelector = document.querySelector('textarea').parentNode.querySelector('button:not(#micBtn)')
  console.log('buttonSelector',buttonSelector)
  return
  // let initialContent = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>'
  //   // Guarda el estado inicial cuando el contenido del botón sea igual al especificado
  //   let intervalId = setInterval(function() {
  //       const button = document.querySelector(buttonSelector);
  //       if (button && button.textContent === initialContent) {
  //           // Se encontró el botón y su contenido es el esperado
  //           clearInterval(intervalId);
  //           monitorButtonChanges(button, initialContent );
  //       }
  //   }, 200); // Verifica cada 200ms
}

function monitorButtonChanges(button, initialContent ) {
    let audioPlayed = false;
    setInterval(function() {
        if (button.textContent !== initialContent) {
            // El botón ha cambiado de estado
            audioPlayed = false; // Resetea el estado de "sonido reproducido"
        } else if (!audioPlayed && !document.hasFocus()) {
            // El botón ha regresado al estado inicial y la pestaña no está activa
            // Reproduce un sonido (necesitas un objeto de audio o un archivo de audio para esto)
            let audio = new Audio("ding.mp3");
            audio.play();
            audioPlayed = true; // Marca que el sonido ha sido reproducido
        }
    }, 200); // Verifica cada 200ms
}

//on finished loading page
window.onload = chatgptResponseState()