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

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(null, (result) => {
    if (result.words === undefined) {
      browser.storage.local.set({ words: JSON.stringify(["炎上", "衝撃"]) });
    }
    for (const key in defaultSettings) {
      if (result[key] === undefined) {
        browser.storage.local.set({ [key]: defaultSettings[key] });
      }
    }
    if (result.myRules === undefined) {
      browser.storage.local.set({ myRules: [] })
    }
    if (result.whitelist === undefined) {
      browser.storage.local.set({ whitelist: JSON.stringify([]) })
    }
  });
  getRules();
});

browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get(["date"], (result) => {
    //前回の更新から1日後であれば更新
    if(Date.now() - result.date.getTime() > 86400000){
      getRules()
    }
  });
});

let badges = {};
browser.runtime.onMessage.addListener((message, sender) => {
  badges[sender.tab.id] = { count: message.count, valid: message.valid }
  badge(message.count.toString(), sender.tab.id, message.valid);
});
browser.tabs.onActivated.addListener(() => {
  browser.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
    if (badges[tabs[0].id]) {
      badge(badges[tabs[0].id].count.toString(), tabs[0].id, badges[tabs[0].id].valid);
    }
    else {
      browser.browserAction.setBadgeText({ text: "", tabId: tabs[0].id });
    }
  })
});

function getRules() {
  fetch('https://raw.githubusercontent.com/sanlun1/negative-news-filter/main/rules.json')
    .then((response) => response.json())
    .then((data) => {
      browser.storage.local.set({
        "rules": data,
        "date": new Date()
      });
    });
}

function badge(text, tabId, valid) {
  browser.storage.local.get(null, (result) => {
    if (result.aggressive) {
      browser.browserAction.setBadgeText({ text: text, tabId: tabId });
      browser.browserAction.setBadgeBackgroundColor({ color: "red" });
      browser.browserAction.setBadgeTextColor({ color: '#FFFFFF' });
    } else if (valid) {
      browser.browserAction.setBadgeText({ text: text, tabId: tabId });
      browser.browserAction.setBadgeBackgroundColor({ color: "#666666" });
      browser.browserAction.setBadgeTextColor({ color: '#FFFFFF' });
    } else if (!valid) {
      browser.browserAction.setBadgeText({ text: "", tabId: tabId });
    }
  });
}
