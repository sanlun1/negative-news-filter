let count = 0;
const target = document.body;
const observeConfig = { childList: true, subtree: true };
const observer = new MutationObserver(main);

browser.storage.local.get(null, (result)=>{
  if (result.enabled === true){
    observer.observe(target, observeConfig);
    window.addEventListener('load', main());
    browser.storage.onChanged.addListener(main);
  }
});

function main() {
  const gettingItem = browser.storage.local.get();
  gettingItem.then(onGot, onError);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  const rule = getRule(item);
  if (!rule) {
    if (item.aggressive) {
      aggressive(item);
      sendMessage(true);
    }
    sendMessage(false);
    return false;
  }
  const whitelist = getWhitelist(item);

  rmForce(rule);
  enableRightClick();
  rmAnnoys(item, rule, whitelist);
  rmArticles(item, rule, whitelist);
  if (item.debug) {
   debugPaid(item, rule);
  }
  if (item.aggressive) {
    aggressive(item);
  }
  sendMessage(true);
}

function getRule(item) {
  const keys = ["article", "paid", "side", "ranking", "related", "comment", "footer", "remove"];
  let rule = {};
  keys.forEach(key => rule[key] = []);
  const rules = item.rules.concat(item.myRules)
        .filter((site) => location.href.search(site.url) !== -1);
  if (rules.length === 0) {
    return false;
  }
  rules.forEach(site => {
      keys.forEach(key => {
        if (typeof site[key]) {
          rule[key].push(site[key]);
        } else if (Array.isArray(site[key])) {
          rule[key] = rule[key].concat(site[key]);
        }
      });
    });
  return rule;
}

function getWhitelist(item) {
  const keys = ["article", "paid", "side", "ranking", "related", "comment", "footer", "remove"];
  const whitelist = {};
  keys.forEach(key => whitelist[key] = false);
  // someで書けそう？
  item.whitelist.forEach(row => {
    if (document.domain === row) {
      keys.forEach(key => whitelist[key] = true);
    } else if (row.includes(document.domain)) {
      row.replace(/^.*\$/, "").split(",").forEach(key => whitelist[key] = true);
    }
  });
  return whitelist;
}

// 強制削除
function rmForce(rule){
  rule.remove.forEach(slct => rmBySelector(slct));
}

// 問題のあるサイトで右クリック制限解除
function enableRightClick(){
  const domains = ["www.ktv.jp"];
  if (domains.includes(document.domain)) {
    document.oncontextmenu = () => { return true; };
  }
}

// 迷惑要素削除
function rmAnnoys(item, rule, whitelist) {
  const annoys = ["side", "ranking", "related", "comment", "footer"];
  annoys.forEach((annoy) => rmAnnoy(item, rule, whitelist, annoy));
}

// 個々の迷惑要素削除
function rmAnnoy(item, rule, whitelist, annoy){
  const slcts = rule[annoy];
  if (slcts.length === 0) { return; }

  if (item[annoy] && !whitelist[annoy]) {
    slcts.forEach(slct => rmBySelector(slct));
  } else if (item.debug) {
    slcts.forEach(slct => {
      document.querySelectorAll(slct).forEach((elm) => {
        elm.style = "box-sizing:border-box;border:solid 4px red;";
        elm.title = slct;
      });
    });
  }
}

// 記事削除(NGワード、有料記事)
function rmArticles(item, rule, whitelist) {
  const words = item.words;
  const whiteWords = item.whiteWords;
  const slcts = rule.article;
  if (slcts.length === 0) { return; }

  slcts.forEach(slct => {
    document.querySelectorAll(slct).forEach(elm =>{
      if (words.some(word => elm.textContent.search(word) !== -1) &&
          whiteWords.every(word => elm.textContent.search(word) === -1) &&
          !whitelist.article) {
        elm.remove();
        count++;
      } else if (item.paid && rule.paid.some(img => elm.querySelector(img)) && !whitelist.paid) {
        elm.remove();
      } else if (item.debug) {
        elm.style.backgroundColor = "pink";
        elm.title = slct;
      }
      // 画像削除モードは必ず有料記事の後に読み込む
      if (item.image) {
        rmImg(elm);
      }
    });
  });
}

// 画像削除モード
function rmImg(elm) {
  const imgSlct = "figure, picture, img, [style*='background-image']";
  elm.querySelectorAll(imgSlct).forEach(img =>{
    // remove()だと日テレnewsに不具合
    img.style.display = "none";
  });
}

// デバッグモード有料要素表示
function debugPaid(item, rule){
  rule.paid.forEach(slcts => {
    slcts.forEach(slct => {
      document.querySelectorAll(slct).forEach(elm => {
        elm.style = "box-sizing:border-box;border:solid 1px blue;";
        elm.title = slct;
      });
    });
  });
}

function rmBySelector(slct) {
  document.querySelectorAll(slct).forEach(elm => elm.remove());
}

// 強引モード
function aggressive(item) {
  document.querySelectorAll("a").forEach(a => {
    if (item.words.some(word => a.textContent.search(word) !== -1)) {
      a.remove();
      count++;
    }
  });
}

// バッジ用メッセージ
function sendMessage(valid) {
  browser.runtime.sendMessage({
    valid: valid,
    count: count,
    domain: document.domain
  });
}
