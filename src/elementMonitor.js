class ElementMonitor {
    constructor(checkInterval = 200) {
        this.checkInterval = checkInterval;
        this.trackedElement = null;
        this.observer = null;
        let audioUrl = chrome.runtime.getURL('ding.mp3');
        this.audio = new Audio(audioUrl);
    }

    init() {
        this.checkIntervalId = setInterval(() => {
            const element = document.querySelector('form')
            if (element && element.tagName === "FORM") {
                this.trackedElement = element
                this.startMonitoring(element);
                clearInterval(this.checkIntervalId);  // Clear the interval once the element is found
            }
        }, this.checkInterval);
    }

    startMonitoring(element) {
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationsList, observer) => {
            
            if(this.trackedElement.outerHTML.includes('Stop generating')){
                this.observer.disconnect();
                this.waitForReturnToOriginal(element);
            }
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe(element, config);
    }

//     waitForReturnToOriginal(element) {
//     const config = { attributes: true, childList: true, subtree: true };
//     const callback = (mutationsList, observer) => {
//         if(this.trackedElement.outerHTML.includes('Regenerate response')) {
//             console.log('de vuelta a la normalidad!');
//             console.log('DING!');
//             this.audio.play();
//             this.observer.disconnect();
//             this.startMonitoring(element);
            
//             chrome.runtime.sendMessage({message: "getTabUrl"}, function(response) {
//                 if (chrome.runtime.lastError) {
//                     console.log('Error: ' + chrome.runtime.lastError.message);
//                     return;
//                 }
//                 console.log('response.tabUrl', response.tabUrl);
//                 if(!response.tabUrl.includes('chat.openai.com')) {
//                     console.log('DING!DING!DING!DING!')
//                 }
//             });
//         }
//     };

//     this.observer = new MutationObserver(callback);
//     this.observer.observe(element, config);
// }
    waitForReturnToOriginal(element) {
        const config = { attributes: true, childList: true, subtree: true };
        let self = this;  // store reference to 'this' 

        const callback = (mutationsList, observer) => {
            if(self.trackedElement.outerHTML.includes('Regenerate response')) {
                console.log('de vuelta a la normalidad!');
                
                // Get the sound setting from the Chrome storage
                chrome.storage.sync.get(['sound'], (result) => {
                    const soundSetting = result.sound;
                    console.log('soundSetting', soundSetting)
                    
                    // If the sound setting is 'never', don't play the sound
                    if (soundSetting === 'never') {
                        return;
                    }

                    chrome.runtime.sendMessage({message: "getTabUrl"}, function(response) {
                        if (chrome.runtime.lastError) {
                            console.log('Error: ' + chrome.runtime.lastError.message);
                            return;
                        }
                        console.log('response.tabUrl', response.tabUrl);
                        
                        // If the sound setting is 'notFocused' and the tab is focused, don't play the sound
                        if (soundSetting === 'notFocused' && response.tabUrl.includes('chat.openai.com')) {
                            return;
                        }
                        
                        console.log('DING!');
                        self.audio.play();
                        self.observer.disconnect();
                        self.startMonitoring(element);
                        console.log('DING!DING!DING!DING!')
                    });
                });
            }
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe(element, config);
    }


}

export default ElementMonitor;
