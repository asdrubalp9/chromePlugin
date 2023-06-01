// En tu script de fondo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getTabUrl') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      sendResponse({ tabUrl: tabs[0].url });
    });
  }
  return true; // Esto es necesario para hacer uso de sendResponse después de que la función de evento haya regresado
});
chrome.runtime.onInstalled.addListener(function(details) {
  //if (details.reason == "update") {
    console.log('Installed details', details)
  if (true) {
      // La extensión se ha actualizado
      // Aquí puedes mostrar una notificación o abrir una nueva pestaña con la información de la actualización
      chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png', // Reemplaza con el ícono de tu extensión
          title: '¡Nuestra extensión se ha actualizado!',
          message: 'Haz clic aquí para ver qué ha cambiado.'
      }, function(notificationId) {
          // Aquí puedes manejar el click en la notificación, si lo deseas
      });
  }
});
