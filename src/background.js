// En tu script de fondo
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "getTabUrl") {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
      sendResponse({tabUrl: tabs[0].url});
    });
  }
  return true;  // Esto es necesario para hacer uso de sendResponse después de que la función de evento haya regresado
});