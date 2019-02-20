
function compare_version(a, b) {
    var i, cmp, len, re = /(\.0)+[^\.]*$/;
    a = (a + '').replace(re, '').split('.');
    b = (b + '').replace(re, '').split('.');
    len = Math.min(a.length, b.length);
    for (i = 0; i < len; i++) {
        cmp = parseInt(b[i], 10) - parseInt(a[i], 10);
        if (cmp !== 0) {
            return cmp;
        }
    }
    return b.length - a.length;
}

function update_doc_refs(project) {
    var re = /[^0-9.]/g;
    var url = 'https://docs.osmcode.org/' + project + '/',
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

function version_compare(a, b) {
    return a.replace(/\d+/g, n => +n+100000).localeCompare(b.replace(/\d+/g, n => +n+100000));
}

function update_releases() {
    $('tr:has(td.release)').each(function(index, tr) {
        var project = tr.id.replace(/^project-/, '');
        var url = 'https://api.github.com/repos/osmcode/' + project + '/releases';
        $.get(url, function(data) {
            data = data.sort(function(a, b) {
                return version_compare(b.tag_name, a.tag_name);
            })[0]
            $('#project-' + project + ' td.release').html(
                data.published_at.replace(/T.*/, '') + ' - ' +
                '<a href="' + data.html_url + '">' + data.tag_name.substr(1) + '</a>'
            );
        }).fail(function() {
            $('#project-' + project + ' td.release').html('<i>not available</i>');
        });
    });
}

function update_master() {
    $('tr:has(td.master)').each(function(index, tr) {
        var project = tr.id.replace(/^project-/, '');
        var url = 'https://api.github.com/repos/osmcode/' + project + '/commits?per_page=1';
        $.get(url, function(data) {
            var last_commit = data[0];
            $('#project-' + project + ' td.master').html(
                '<a href="' + last_commit.html_url + '" title="' + last_commit.sha + '">' + last_commit.commit.author.date.replace(/T.*/, '') + '</a>'
            );
        }).fail(function() {
            $('#project-' + project + ' td.master').html('<i>not available</i>');
        });
    });
}

