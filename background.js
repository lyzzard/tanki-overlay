chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url.match(/localhost/) || tab.url.match(/tankionline.com/)) {
		chrome.pageAction.show(tabId);
	}
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {code: "$('#js-overlay_wrapper').trigger('init');"});
});
