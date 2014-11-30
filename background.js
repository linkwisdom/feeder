chrome.browserAction.onClicked.addListener(
    function ( tab ) {
        var url = chrome.extension.getURL( 'main.html#' + tab.id );
        chrome.tabs.create( {url: url} );
    }
);

var ignoreList = [];

/**
 * Handles data sent via chrome.extension.sendRequest().
 * @param request Object Data sent in the request.
 * @param sender Object Origin of the request.
 * @param callback Function The method to call when the request completes.
 */
function onRequest(request, sender, callback) {
  // alert(request.message + ' -- ' + sender.tab.id);
	if (request.message == 'routeEvent') {
		chrome.tabs.sendRequest(sender.tab.id, request, function(response) {});
	} else if (request.message == 'showIcon') {
		//chrome.pageAction.show(sender.tab.id);
		chrome.browserAction.enable();
		chrome.browserAction.setIcon({
		  path: './icon.png'
		});
		callback({});
	} else if (request.message == 'hideIcon') {
		//chrome.pageAction.hide(sender.tab.id);
		chrome.browserAction.disable();
		chrome.browserAction.setIcon({
		  path: './clock.png'
		});
		callback({});
	} else if (request.message == 'addIgnoredUrl') {
		alert('martin');
		ignoreList[ignoreList.length] = request.url;
	} else if (request.message == 'isUrlIgnored') {
		callback({
			url : request.url,
			isIgnored : ignoreList.indexOf(request.url) >= 0
		});
	}
};

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);

console.log("loading plugin");