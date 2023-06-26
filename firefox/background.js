const defaultSettings = {
    "side": false,
    "ranking": false,
    "related": false,
    "comment": false,
    "footer": false,
    "paid": false,
    "debug": false,
    "aggressive": false,
    "image": false,
    "hideWords": false,
		"enabled": true
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(null, (result) => {
        if (result.words === undefined) {
            chrome.storage.local.set({ words: JSON.stringify(["炎上", "衝撃"]) });
        }
        for (const key in defaultSettings) {
            if (result[key] === undefined) {
                chrome.storage.local.set({ [key]: defaultSettings[key] });
            }
        }
        if (result.myRules === undefined) {
            chrome.storage.local.set({ myRules: [] })
        }
        if (result.whitelist === undefined) {
            chrome.storage.local.set({ whitelist: JSON.stringify([]) })
        }
    });
    getRules();
});

chrome.runtime.onStartup.addListener(getRules);

let badges = {};
chrome.runtime.onMessage.addListener((message, sender) => {
    badges[sender.tab.id] = { count: message.count, valid: message.valid }
    badge(message.count.toString(), sender.tab.id, message.valid);
});
chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
        if (badges[tabs[0].id]) {
            badge(badges[tabs[0].id].count.toString(), tabs[0].id, badges[tabs[0].id].valid);
        }
        else {
            chrome.browserAction.setBadgeText({ text: "", tabId: tabs[0].id });
        }
    })
});

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

function badge(text, tabId, valid) {
    chrome.storage.local.get(null, (result) => {
        if (result.aggressive) {
            chrome.browserAction.setBadgeText({ text: text, tabId: tabId });
            chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
            chrome.browserAction.setBadgeTextColor({ color: '#FFFFFF' });
        } else if (valid) {
            chrome.browserAction.setBadgeText({ text: text, tabId: tabId });
            chrome.browserAction.setBadgeBackgroundColor({ color: "#666666" }); chrome.browserAction.setBadgeTextColor({ color: '#FFFFFF' });
        } else if (!valid) {
            chrome.browserAction.setBadgeText({ text: "", tabId: tabId });
        }
    });
}
