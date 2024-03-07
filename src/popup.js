const manifest = browser.runtime.getManifest();
const words = document.getElementById('words');
const date = document.getElementById('date');

// バージョン情報
document.getElementById('version').textContent = manifest.version;

// NGワードと更新日時の表示
browser.storage.local.get(["words", "date"], (result) => {
  if (result.words !== undefined) {
    words.value = result.words.join("\n");
  }
  if (result.date !== undefined) {
    date.textContent = result.date.toLocaleString();
  }
});

// NGワードの編集
words.addEventListener('change', () => {
  const saveWords = words.value.replace(/ |　|\t/g, '').split(/\n/).filter(n => n !== "");
  browser.storage.local.set({ words: saveWords });
});

// 諸オプション
const configs = ["enabled", "side", "ranking", "related", "comment", "paid", "footer", "debug", "aggressive", "image", "hideWords"];
for (const config of configs) {
  const checkbox = document.getElementById(config);
  browser.storage.local.get(config, (result) => {
    if (result[config] !== undefined) {
      checkbox.checked = result[config];
    }
  });
  checkbox.addEventListener('change', () => {
    browser.storage.local.set({ [config]: checkbox.checked });
  });
}

// ルール更新
document.getElementById('update').addEventListener('click', () => {
  //getRules();
  //date.textContent = result.date;
  fetch('https://raw.githubusercontent.com/sanlun1/negative-news-filter/main/rules.json')
    .then((response) => response.json())
    .then((data) => {
      browser.storage.local.set({
        "rules": data,
        "date": new Date()
      });
    })
    .then(() => {
      browser.storage.local.get(["date"], (result) => {
        date.textContent = result.date.toLocaleString();
      });
    });
});
