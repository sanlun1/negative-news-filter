browser.runtime.onInstalled.addListener(handleInstalled);
browser.runtime.onStartup.addListener(handleStartup);

let badges = {};
browser.runtime.onMessage.addListener((message, sender) => {
  badges[sender.tab.id] = { count: message.count, valid: message.valid };
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
  });
});

function badge(text, tabId, valid) {
  browser.storage.local.get(null, (result) => {
    // 強引モード
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

function handleInstalled() {
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
  };
  const mySettings = ["words", "whiteWords", "whitelist", "myRules"];
  browser.storage.local.get(null, (result) => {
    for (const key in defaultSettings) {
      if (result[key] === undefined) {
        browser.storage.local.set({ [key]: defaultSettings[key] });
      }
    }
    mySettings.forEach(config => {
      if (result[config] === undefined) {
        browser.storage.local.set({ [config]: [] });
      } else if (typeof result[config] === "string") {
        browser.storage.local.set({ [config]: JSON.parse(result[config]) });
      }
    });
  });
  getRules();
}

function handleStartup(){
  browser.storage.local.get(["date"], (result) => {
    //前回の更新から1日後であれば更新
    if (Date.now() - result.date.getTime() > 86400000){
      getRules();
    }
  });
}

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
