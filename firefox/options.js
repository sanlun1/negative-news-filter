const words = document.getElementById('words');
const saveWordsStatus = document.getElementById('saveWordsStatus');
const myRules = document.getElementById('myRules');
const saveMyRulesStatus = document.getElementById('saveMyRulesStatus');
const whitelist = document.getElementById('whitelist');
const saveWhitelistStatus = document.getElementById('saveWhitelistStatus');

browser.storage.local.get(["words", "myRules", "whitelist"], (result) => {
  if (result.words !== undefined) {
    let text = JSON.parse(result.words);
    text = text.join('\n');
    words.value = text;
  }
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
  browser.storage.local.set({ "myRules": JSON.parse(myRules.value) });
  });*/

document.getElementById("saveWords").addEventListener('click', ()=>{
  const saveWords = words.value.replace(/ |　|\t/g, '').split(/\n/).filter(n => n !== "");
  browser.storage.local.set({ words: JSON.stringify(saveWords) });
  saveWordsStatus.textContent = "保存しました";
})

document.getElementById("saveMyRules").addEventListener('click', () => {
  try {
    browser.storage.local.set({ "myRules": JSON.parse(myRules.value) });
    browser.storage.local.get(["myRules"], (result) => {
      if (result.myRules !== undefined) {
        myRules.value = JSON.stringify(result.myRules, null, "\t");
        saveMyRulesStatus.textContent = "保存しました";
        resetStatus(saveMyRulesStatus);
      }
    });
  } catch {
    saveMyRulesStatus.textContent = "JSONに問題があります";
  }
});

document.getElementById("saveWhitelist").addEventListener('click', () => {
  try {
    let saveWords = whitelist.value;
    saveWords = saveWords.replace(/ |　|\t/g, '');
    saveWords = saveWords.split(/\n/);
    saveWords = saveWords.filter(n => n !== "");
    browser.storage.local.set({ "whitelist": JSON.stringify(saveWords) });
    saveWhitelistStatus.textContent = "保存しました";
    resetStatus(saveWhitelistStatus);
  } catch {
    saveWhitelistStatus.textContent = "失敗しました";
  }
});

function resetStatus(text){
  setTimeout(() => {
    text.textContent = "";
  }, 2*1000);
}
