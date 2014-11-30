/**
 * @file 获取文件的内容
 * @author errorrik(errorrik@gmail.com)
 */

define( function () {
    return function ( url, callback ) {
        var xhr = new XMLHttpRequest();
        xhr.open( 'GET', url, false );
        xhr.send();

        if ( xhr.status >= 200 && xhr.status < 300 ) {
            callback && callback(xhr.responseText);
            return xhr.responseText;
        }

        throw new Error('[GETTEXT_FAIL]');
    };
} );
