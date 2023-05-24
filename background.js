chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'speak') {
    // Aquí es donde llamarías a la API de 11labs para convertir el texto en audio.
    // Este es solo un ejemplo y tendrás que reemplazarlo con el código adecuado.
    var audio = new Audio();
    fetch('https://api.11labs.com/text-to-speech?text=' + encodeURIComponent(request.text))
      .then(response => response.blob())
      .then(blob => {
        audio.src = URL.createObjectURL(blob);
        audio.play();
      });
  } else if (request.action === 'record') {
    // Aquí es donde iniciarías la grabación de audio y luego llamarías a la API de 11labs para convertirlo en texto.
    // De nuevo, este es solo un ejemplo y tendrás que reemplazarlo con el código adecuado.
    var mediaRecorder;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        mediaRecorder.addEventListener('dataavailable', function(e) {
          fetch('https://api.11labs.com/speech-to-text', {
            method: 'POST',
            body: e.data
          })
            .then(response => response.text())
            .then(text => {
              // Aquí es donde enviarías el texto de vuelta a la página.
              // Tendrás que ajustar esto según tus necesidades.
              chrome.tabs.sendMessage(sender.tab.id, {action: 'transcribe', text: text});
            });
        });
      });
  }
});

// Escucha los mensajes de los scripts de contenido
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Descarga el archivo usando la API de descargas de Chrome
    chrome.downloads.download({
        url: message.url,
        filename: message.title + '.html'
    });
});