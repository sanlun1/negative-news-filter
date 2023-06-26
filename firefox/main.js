let count = 0;
const target = document.body;
const ovserveConfig = { childList: true, subtree: true };
const observer = new MutationObserver(main);

chrome.storage.local.get(null, (result)=>{
		if (result.enabled === true){
				observer.observe(target, ovserveConfig)
				window.addEventListener('load', main());
				chrome.storage.onChanged.addListener(main);
		}
})

function main() {
    chrome.storage.local.get(null, (result) => {
        const whitelist = JSON.parse(result.whitelist);
        const words = JSON.parse(result.words);
        let data = {
            "article": [],
            "paid": [],
            "side": [],
            "ranking": [],
            "related": [],
            "comment": [],
            "footer": [],
            "remove": []
        }
        let valid = false;
        const allRules = () => {
            if (result.myRules === undefined) {
                return result.rules;
            } else {
                return result.rules.concat(result.myRules);
            }
        }
        for (const site of allRules()) {
            if (location.href.search(site.url) !== -1) {
                valid = true;
                for (const i in data) {
                    if (site[i] !== undefined) {
                        data[i] = data[i].concat(site[i])
                    }
                }
                if (whitelist !== undefined) {
                    whitelist.some((i) => {
                        if (i.includes(document.domain)) {
                            if (!i.includes("$")) {
                                valid = false;
                            } else {
                                const exclude = i.replace(/^.*\$/, "").split(',');
                                for (const j of exclude) {
                                    data[j] = []
                                }
                            }
                        }
                    });
                }

            }
        }
        //rules非対応サイトでまず強引モードを実行する
        if (!valid && result.aggressive) {
            aggressive(words);
        } else if (valid) {
            //問答無用削除
            if (data.remove !== []) {
                for (const i of data.remove) {
                    const elms = document.querySelectorAll(i);
                    for (const j of elms) {
                        j.remove();
                    }
                }
            }
            //右クリック禁止解除
            if (document.domain === "www.ktv.jp") {
                document.oncontextmenu = () => { return true; }
            }
            //迷惑要素
            const annoyances = ["side", "ranking", "related", "comment", "footer"]
            for (const annoyance of annoyances) {
                for (const i of data[annoyance]) {
                    const elms = document.querySelectorAll(i);
                    for (const elm of elms) {
                        if (result[annoyance]) {
                            elm.remove();
                        } else if (result.debug) {
                            elm.style = "box-sizing:border-box;border:solid 4px red;";
                            elm.title = i;
                        }
                    }
                }
            }
            //NGワード
            if (data.article !== []) {
                for (const slct of data.article) {
                    const elms = document.querySelectorAll(slct);
                    for (const elm of elms) {
                        if (words.some(i => elm.textContent.search(i) !== -1)) {
                            elm.remove();
                            count++;
                        } else if (result.paid && data.paid.some(i => elm.querySelector(i))) {
                            elm.remove();
                            count++;
                        } else if (result.debug) {
                            elm.style.backgroundColor = "pink";
                            elm.title = slct;
                        }
                        //画像削除モード、必ず有料記事の後に読み込む
                        if (result.image) {
                            const imgs = elm.querySelectorAll("figure, picture, img, [style*='background-image']");
                            for (const img of imgs) {
                                /*
                                let imgDom = img;
                                do {
                                    const imgParent = imgDom.parentNode;
                                    img.remove();
                                    imgDom = imgParent;
                                } while (imgDom.parentNode.childElementCount === 1);
                                */
                                // remove()だと日テレNEWSに不具合
                                img.style.display = "none";
                            }
                        }
                    }
                }
                //デバッグモード有料要素表示
                if (result.debug && data.paid !== [] && !result.paid) {
                    for (const slct of data.paid) {
                        const elms = document.querySelectorAll(slct)
                        for (const elm of elms) {
                            elm.style = "box-sizing:border-box;border:solid 1px blue;";
                            elm.title = slct;
                        }
                    }
                }
            }
            //rules対応サイトでは全ての削除が終わった後強引モードを実行
            if (result.aggressive) {
                aggressive(words);
            }
        }
        chrome.runtime.sendMessage({
            valid: valid,
            count: count,
            domain: document.domain
        });
    });
}

function aggressive(words) {
    const links = document.getElementsByTagName("A")
    for (const link of links) {
        if (words.some(i => link.textContent.search(i) !== -1)) {
            link.remove();
            count++;
        }
    }
}
