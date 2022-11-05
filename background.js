const re = new RegExp('https://www.coursera.org/learn/.*/home/notes');


chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.match(re)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['main.js']
        });
    }
});