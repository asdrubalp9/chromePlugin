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
            } else {
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

    waitForReturnToOriginal(element) {
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationsList, observer) => {
            if(this.trackedElement.outerHTML.includes('Regenerate response')){
                this.audio.play();
                this.observer.disconnect();
                this.startMonitoring(element);
            }
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe(element, config);
    }
}

export default ElementMonitor;
