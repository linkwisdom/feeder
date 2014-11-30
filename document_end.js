
(function() {
	function init() {
		if (document.location.href.indexOf('maimai') > -1) {
			chrome.extension.sendRequest({
				message : "showIcon"
			});
		} else {
			chrome.extension.sendRequest({
				message : "hideIcon"
			});
		}
	}
	init();
})();


chrome.runtime.onMessage.addListener(
    function ( request, sender, sendResponse ) {
        // var def = document.contentWindow.define;
        // if ( def && def.amd ) {
            sendResponse( getFeedList() );
        // }
        // else {
        //     sendResponse( false );
        // }
    }
);



function findAll(selector, dom) {
  var feedList = (dom || document).querySelectorAll(selector);
  return Array.prototype.slice.call(feedList);
}

function find(selector, dom) {
  return (dom || document).querySelector(selector);
}

function getFeed(feed) {
  var text = find('.text', feed).textContent;
  var seed = find('.discuss', feed).href;
  return {
    text: text,
    seed: seed
  };
}


function getPeed(feed) {
  var text = (find('.trendText', feed) || {}).textContent;
  var discus = findAll('.discuss li', feed);

  discus = discus.map(function (item) {
    return item.textContent.replace(/\s+/g, ' ');
  });

  return {
    text: text,
    discus: discus
  };
}

function getFeedList() {
    var feedList = findAll('.gossipInfor');
    if (feedList.length) {
      var feeds = feedList.map(getFeed);
    } else {
      feedList = findAll('.trendCon');
      feeds = feedList.map(getPeed);
    }

    return feeds;
}

function getScripts() {
    var result = [];
    var scripts = document.getElementsByTagName( 'script' );
    for ( var i = 0; i < scripts.length; i++ ) {
        var script = scripts[ i ];
        if ( script.src ) {
            !script.async && result.push( {type: 'external', src: script.src} );
        }
        else {
            result.push( {type: 'internal', text: script.text} );
        }
    }

    return result;
}

