chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ domains: [] });
  chrome.contextMenus.create({
    id: "open_tab_cleaner_settings",
    title: "Bulk Close tabs Settings",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open_tab_cleaner_settings") {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 350,
      height: 450
    });
  }
});

chrome.action.onClicked.addListener(async () => {
  chrome.storage.local.get(['domains'], async ({ domains }) => {
    const targetDomains = domains || [];
    const tabs = await chrome.tabs.query({});
    const tabsToClose = tabs.filter(tab => {
      try {
        const hostname = new URL(tab.url).hostname.toLowerCase();
        return targetDomains.some(domain =>
          hostname.includes(domain.toLowerCase())
        );
      } catch {
        return false;
      }
    }).map(tab => tab.id);

    if (tabsToClose.length > 0) {
      chrome.tabs.remove(tabsToClose);
    }
  });
});