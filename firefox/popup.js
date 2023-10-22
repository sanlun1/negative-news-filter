const manifest = browser.runtime.getManifest();
const words = document.getElementById('words');
const date = document.getElementById('date');
//const currentDomain = document.getElementById('currentDomain');

document.getElementById('version').textContent = manifest.version;

browser.storage.local.get(["words", "date"], (result) => {
  if (result.words !== undefined) {
    let text = JSON.parse(result.words);
    text = text.join('\n');
    words.value = text;
  }

  if (result.date !== undefined) {
    date.textContent = result.date.toLocaleString();
  }
})
words.addEventListener('change', () => {
  const saveWords = words.value.replace(/ |　|\t/g, '').split(/\n/).filter(n => n !== "");
  browser.storage.local.set({ words: JSON.stringify(saveWords) });
});

const configs = ["enabled", "side", "ranking", "related", "comment", "paid", "footer", "debug", "aggressive", "image", "hideWords"];
for (const config of configs) {
  const checkbox = document.getElementById(config)
  browser.storage.local.get(config, (result) => {
    if (result[config] !== undefined) {
      checkbox.checked = result[config];
    }
  });
  checkbox.addEventListener('change', () => {
    browser.storage.local.set({ [config]: checkbox.checked });
  });
}

document.getElementById('update').addEventListener('click', () => {
  //getRules();
  //date.textContent = result.date;
  fetch('https://raw.githubusercontent.com/sanlun1/negative-news-filter/main/rules.json')
    .then((response) => response.json())
    .then((data) => {
      browser.storage.local.set({
        "rules": data,
        "date": new Date()
      })
    })
    .then(() => {
      browser.storage.local.get(["date"], (result) => {
        date.textContent = result.date.toLocaleString();
      });
    });
});

/*
  browser.runtime.onMessage.addListener((message, sender, callback) => {
  browser.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
  currentDomain.textContent = message.domain;
  })
  });

  const checkboxs = document.querySelectorAll("input[type='checkbox']");
  document.getElementById("select").addEventListener('click',()=>{
  for(const checkbox of checkboxs){
  checkbox.checked = true;
  }
  });
  document.getElementById("deselect").addEventListener('click',()=>{
  for(const checkbox of checkboxs){
  checkbox.checked = false;
  }
  });
*/
