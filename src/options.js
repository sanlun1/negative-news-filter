const arrs = ["words", "whiteWords", "whitelist"];
const objs = ["myRules"];

browser.storage.local.get(arrs.concat(objs), (item) => {
  arrs.forEach(arr => {
    document.getElementById(arr).value = item[arr].join("\n");
  });
  objs.forEach(obj => {
    document.getElementById(obj).value = JSON.stringify(item[obj], null, "\t");
  });
});

arrs.forEach(arr => {
  const textarea = document.getElementById(arr);
  const status = document.getElementById(`${arr}Status`);
  const button = document.getElementById(`${arr}Button`);
  button.addEventListener("click", () => {
    try {
      const save_arr = textarea.value.replace(/ |　|\t/g, '').split(/\n/).filter(n => n !== "");
      browser.storage.local.set({[arr]: save_arr});
      status.textContent = "保存しました";
      resetStatus(status);
    } catch {
      status.textContent = "書式に問題があります";
    }
  });
});

objs.forEach(obj => {
  const textarea = document.getElementById(obj);
  const status = document.getElementById(`${obj}Status`);
  const button = document.getElementById(`${obj}Button`);
  button.addEventListener("click", () => {
    try {
      const json = JSON.parse(textarea.value);
      browser.storage.local.set({[obj]: json});
      textarea.value = JSON.stringify(json, null, "\t");
      status.textContent = "保存しました";
      resetStatus(status);
    } catch {
      status.textContent = "JSONに問題があります";
    }
  });
});

function resetStatus(text){
  setTimeout(() => {
    text.textContent = "";
  }, 2*1000);
}
