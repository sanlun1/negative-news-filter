const myRules = document.getElementById('myRules');
const saveMyRulesStatus = document.getElementById('saveMyRulesStatus');
const whitelist = document.getElementById('whitelist');
const saveWhitelistStatus = document.getElementById('saveWhitelistStatus');

chrome.storage.local.get(["myRules", "whitelist"], (result) => {
    if (result.myRules !== undefined) {
        myRules.value = JSON.stringify(result.myRules, null, "\t");
    }
    if (result.whitelist !== undefined){
        let text = JSON.parse(result.whitelist);
        text = text.join('\n');
        whitelist.value = text;
    }
});

/*myRules.addEventListener('change', () => {
    chrome.storage.local.set({ "myRules": JSON.parse(myRules.value) });
});*/

document.getElementById("saveMyRules").addEventListener('click', () => {
    try {
        chrome.storage.local.set({ "myRules": JSON.parse(myRules.value) });
        saveMyRulesStatus.textContent = "保存しました"
        chrome.storage.local.get(["myRules"], (result) => {
            if (result.myRules !== undefined) {
                myRules.value = JSON.stringify(result.myRules, null, "\t");
            }
        });
    } catch {
        saveMyRulesStatus.textContent = "JSONに問題があります"
    }
});

document.getElementById("saveWhitelist").addEventListener('click', () => {
    try {
        let saveWords = whitelist.value;
        saveWords = saveWords.replace(/ |　|\t/g, '');
        saveWords = saveWords.split(/\n/);
        saveWords = saveWords.filter(n => n !== "");
        chrome.storage.local.set({ "whitelist": JSON.stringify(saveWords) });
        saveWhitelistStatus.textContent = "保存しました"
    } catch {
        saveWhitelistStatus.textContent = "失敗しました"
    }
});