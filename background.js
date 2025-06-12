chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["blocked"], (result) => {
    const blockedSites = result.blocked || [];
    updateRules(blockedSites);
  });
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blocked) {
    updateRules(changes.blocked.newValue);
  }
});

function updateRules(blockedSites) {
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: site, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: blockedSites.map((_, i) => i + 1),
    addRules: rules
  });
}
