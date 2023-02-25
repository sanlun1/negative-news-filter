const observer = new MutationObserver(main);
observer.observe(document.body, {
    childList: true,
    subtree: true
})

//main();
window.addEventListener('load', main());
chrome.storage.onChanged.addListener(main);

/*function iframeElms(selector) {
    const iframes = document.querySelectorAll('iframe');
    let elms = [];
    for (const iframe of iframes) {
        elms = elms.concat(iframe.contentWindow.document.querySelectorAll(selector));
    }
    return elms;
}*/

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
        if (valid === false && result.aggressive) {
            aggressive(words);
        } else if (valid === true) {
            //問答無用削除
            if (data.remove !== []) {
                for (const i of data.remove) {
                    const elms = document.querySelectorAll(i);
                    for (const j of elms) {
                        j.remove();
                    }
                }
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
                        } else if (result.paid && data.paid.some(i => elm.querySelector(i))) {
                            elm.remove();
                        } else if (result.debug) {
                            elm.style.backgroundColor = "pink";
                            elm.title = slct;
                            /*const elmChildren = elm.children;
                            for (const elmChild of elmChildren) {
                                elmChild.style.backgroundColor = "pink";
                            }*/
                        }
                    }
                }
                //デバッグモード有料要素表示
                if (result.debug && data.paid !== [] && !result.paid) {
                    for(const slct of data.paid){
                        const elms = document.querySelectorAll(slct)
                        for(const elm of elms){
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
    });
}

function aggressive(words) {
    const links = document.getElementsByTagName("A")
    for (const link of links) {
        if (words.some(i => link.textContent.search(i) !== -1)) {
            link.remove();
        }
    }
}