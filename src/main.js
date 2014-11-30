define( function ( require ) {
    window.fs = require('./fileSystem');

    var amd = require( './amd' );
    var getText = require('./get-text');

    /**
     * 初始化，向目标页面发送消息，获取页面的inline script source
     */
    function init() {
        var tabId = parseInt( location.hash.slice( 1 ), 10 );
        chrome.tabs.get( tabId, function ( tab ) {
            amd.setPageUrl( tab.url.replace(/#[^#]+$/, '').replace(/\?[^\?]+$/, '') );
            chrome.tabs.sendMessage( tabId, {}, messageCallback );
        })
    }

    var config;

    var spanCan = [];

    window.loadCommence = function (item, callback) {
      var seed = item.dataset.seed;
      if (!seed) {
        return;
      }
      getText(seed, function (html) {
        var rst = [];
        html.replace(
          /<p class="text">([^<]*)</g,
          function (source, item) {
            rst.push(item);

          }
        );

        html = rst.map(function (snip) {
          if (snip.length < 2) {return;}

          return '<li class="comments">' + snip + '</li>'
        }).join('');

        item.querySelector( '.panel' ).innerHTML = '<ul>' + html + '</ul>';
        callback && callback();
      });
    }

    function saveContent() {
      var p = new Date();
      var filename = p.getFullYear() + '-' + (p.getMonth() + 1)
        + '-' + p.getDate() + '.html';
      var html = document.body.innerHTML;
      debugger;
      fs.writeFile(filename, html);
    }

    function loop(items) {
      if (!items.length) {
        saveContent();
        return;
      }
      var item = items.shift();

      setTimeout(function () {
        loadCommence(item, function () {
          loop(items);
        });
      }, 700);
    }

    /**
     * 目标页面消息回调函数
     *
     * @inner
     * @param {string|boolean} data 目标页面的inline script source
     */
    function messageCallback( data ) {
        var result = [];
        var text = data.map(function (item) {
          var list = [];

          if (item.discus) {
            list = item.discus.map(function (c) {
              return '<li class="comments">' + c + '</li>'
            });

            list.unshift('<ul>');
            list.push('</ul>');
          }

          return  '<li class="feed-item" > '
            + '<div class="feed-content">'
            + item.text
            + '</div>'
            + '<div class="item" data-seed="'
            + item.seed
            + '">'
            + '<div class="panel">'
            + list.join('')
            + '</div>'
            + '</div>'
            + '</li>';
        }).join('');

        var p = new Date();
        var filename = p.getFullYear() + '-' + (p.getMonth() + 1)
        + '-' + p.getDate() + '-' + p.getHours() +  '_feeds.html';

        var content = JSON.stringify(data);
        localStorage.setItem(filename, content);
        fs.writeFile(filename, content);

        document.querySelector( '.content-panel' ).innerHTML = '<ul>' + text + '</ul>';
        var items = document.querySelectorAll( '.content-panel .item' );

        items = Array.prototype.slice.apply(items);

        loop(items);
    }

    return {
        init: init
    };
});
