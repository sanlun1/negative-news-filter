const words = document.getElementById('words');
const date = document.getElementById('date');
const currentDomain = document.getElementById('currentDomain');

chrome.storage.local.get(["words", "date"], (result) => {
    if (result.words !== undefined) {
        let text = JSON.parse(result.words);
        text = text.join('\n');
        words.value = text;
    }

    if (result.date !== undefined) {
        date.textContent = result.date;
    }
})
words.addEventListener('change', () => {
    let saveWords = words.value;
    saveWords = saveWords.replace(/ |　|\t/g, '');
    saveWords = saveWords.split(/\n/);
    saveWords = saveWords.filter(n => n !== "");
    chrome.storage.local.set({ words: JSON.stringify(saveWords) });
});

const configs = ["side", "ranking", "related", "comment", "paid", "footer", "debug", "aggressive"];
for (const config of configs) {
    const checkbox = document.getElementById(config)
    chrome.storage.local.get(config, (result) => {
        if (result[config] !== undefined) {
            checkbox.checked = result[config];
        }
    });
    checkbox.addEventListener('change', () => {
        chrome.storage.local.set({ [config]: checkbox.checked });
    });
}

document.getElementById('update').addEventListener('click', () => {

    //getRules();
    //date.textContent = result.date;
    fetch('https://raw.githubusercontent.com/sanlun1/negative-news-filter/main/rules.json')
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.local.set({
                "rules": data,
                "date": getDate()
            })
        })
        .then(() => {
            chrome.storage.local.get(["date"], (result) => {
                date.textContent = result.date
            });
        });

});

currentDomain.textContent = current;

/*
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