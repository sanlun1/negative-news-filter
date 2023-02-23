const defaultSettings = {
    "side": false,
    "ranking": false,
    "related": false,
    "comment": false,
    "footer": false,
    "paid": false,
    "debug": false,
    "aggressive": false
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(null, (result) => {
        if (result.words === undefined) {
            chrome.storage.local.set({ words: JSON.stringify(["炎上", "衝撃"]) });
        }
        for(const key in defaultSettings){
            if(result[key] === undefined){
                chrome.storage.local.set({[key]: defaultSettings[key]});
            }
        }
        if(result.myRules === undefined){
            chrome.storage.local.set({myRules: []})
        }
        if(result.whitelist === undefined){
            chrome.storage.local.set({whitelist: JSON.stringify([])})
        }
    });
    getRules();
});

chrome.runtime.onStartup.addListener(getRules);

function getRules() {
    fetch('https://raw.githubusercontent.com/sanlun1/negative-news-filter/main/rules.json')
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.local.set({
                "rules": data,
                "date": getDate()
            });
        });
}

function getDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();
    const mi = datePlusZero(now.getMinutes());
    const s = datePlusZero(now.getSeconds());
    return y + '/' + m + '/' + d + '/' + h + ':' + mi + ':' + s;
}

function datePlusZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    else {
        return num;
    }
}