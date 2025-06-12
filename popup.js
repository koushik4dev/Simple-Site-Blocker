document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add");
  const input = document.getElementById("site");
  const list = document.getElementById("blockedList");

  // Load sites on startup
  chrome.storage.local.get(["blocked"], (result) => {
    const blocked = result.blocked || [];
    blocked.forEach(site => addToUI(site));
  });

  // Add site
  addButton.addEventListener("click", () => {
    const site = input.value.trim();
    if (!site) return;

    chrome.storage.local.get(["blocked"], (result) => {
      let blocked = result.blocked || [];
      if (!blocked.includes(site)) {
        blocked.push(site);
        chrome.storage.local.set({ blocked });
        addToUI(site);
        input.value = "";
      }
    });
  });

  // Add item to UI with Unblock button
  function addToUI(site) {
    const li = document.createElement("li");
    li.textContent = site;

    const unblockBtn = document.createElement("button");
    unblockBtn.textContent = "Unblock";
    unblockBtn.className = "unblock";
    unblockBtn.addEventListener("click", () => {
      chrome.storage.local.get(["blocked"], (result) => {
        let blocked = result.blocked || [];
        blocked = blocked.filter(item => item !== site);
        chrome.storage.local.set({ blocked });
        li.remove();
      });
    });

    li.appendChild(unblockBtn);
    list.appendChild(li);
  }
});
