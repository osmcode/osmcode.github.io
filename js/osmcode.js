
function compare_version(a, b) {
    var i, cmp, len, re = /(\.0)+[^\.]*$/;
    a = (a + '').replace(re, '').split('.');
    b = (b + '').replace(re, '').split('.');
    len = Math.min(a.length, b.length);
    for( i = 0; i < len; i++ ) {
        cmp = parseInt(b[i], 10) - parseInt(a[i], 10);
        if( cmp !== 0 ) {
            return cmp;
        }
    }
    return b.length - a.length;
}

function update_doc_refs(project) {
    var re = /[^0-9.]/g;
    var url = 'http://docs.osmcode.org/' + project + '/',
        ul = $('#source-code-reference');
    $.get(url, function(data) {
        var links = $($.parseHTML(data)).find('li').has('a[href^="v"]');
        links.sort(function(a, b) {
            var va = $(a).children().text().replace(re, '');
            var vb = $(b).children().text().replace(re, '');
            return compare_version(va, vb);
        });
        links.each(function() {
            var l = $(this).find('a');
            l.attr('href', url + l.attr('href'));
            l.attr('target', '_blank');
            l.text(l.text().replace('/', ''));
        });
        ul.append(links);
    });
}

