document.getElementById("backup").addEventListener('click', backup);
document.getElementById("restore").addEventListener('click', restore);

function backup(){
  browser.storage.local.get()
    .then(onGot, onError);
}

function onGot(item){
  delete item.date;
  delete item.rules;
  item.nnf = true;
  const blob = new Blob([JSON.stringify(item)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nnf.json";
  link.click();
  URL.removeObjectURL(url);
}

function onError(error){
  console.log(`Error: ${error}`);
}

function restore(){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.addEventListener('change', handleRestore);
  input.click();
  input.remove();
}

function handleRestore(){
  const file = this.files[0];
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const obj = JSON.parse(fr.result);
      if (!obj.nnf) { throw 'Invalid'; }
      for (const key in obj) {
        browser.storage.local.set({ [key]: obj[key] });
      }
      window.alert("設定を復元しました");
      location.reload();
    }
    catch (e) {
      window.alert("復元できません");
    }
  };
  fr.readAsText(file);
}
