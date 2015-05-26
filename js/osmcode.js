
function update_doc_refs(project) {
    var url = 'http://docs.osmcode.org/' + project + '/',
        ul = $('#source-code-reference');
    $.get(url, function(data) {
        var links = $($.parseHTML(data)).find('li').has('a[href^="v"]');
        links.each(function() {
            var l = $(this).find('a');
            l.attr('href', url + l.attr('href'));
            l.attr('target', '_blank');
            l.text(l.text().replace('/', ''));
        });
        ul.append(links);
    });
}

