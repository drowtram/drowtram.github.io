document.querySelectorAll('.post-container table').forEach(function (table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.before(wrapper);
    wrapper.append(table);
});

document.querySelectorAll('.post-container iframe[src*="youtube.com"], .post-container iframe[src*="vimeo.com"]').forEach(function (iframe) {
    var wrapper = document.createElement('div');
    wrapper.className = 'embed-responsive';
    iframe.before(wrapper);
    wrapper.append(iframe);
});

var catalog = document.querySelector('.catalog-body');
if (catalog) {
    document.querySelectorAll('.post-container h1[id], .post-container h2[id], .post-container h3[id], .post-container h4[id], .post-container h5[id], .post-container h6[id]').forEach(function (heading) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        item.className = heading.tagName.toLowerCase() + '_nav';
        link.href = '#' + encodeURIComponent(heading.id);
        link.textContent = heading.textContent;
        item.append(link);
        catalog.append(item);
    });
    if (!catalog.children.length) catalog.closest('.table-of-contents').hidden = true;
}

if (document.querySelector('.post-container[data-heading-anchors]')) {
    document.querySelectorAll('.post-container[data-heading-anchors] :is(h1, h2, h3, h4, h5, h6)[id]').forEach(function (heading) {
        var link = document.createElement('a');
        link.className = 'heading-anchor';
        link.href = '#' + encodeURIComponent(heading.id);
        link.textContent = '#';
        link.setAttribute('aria-label', '链接到 ' + heading.textContent);
        heading.append(link);
    });
}

document.querySelectorAll('.post-container pre').forEach(function (pre) {
    pre.setAttribute('tabindex', '0');
});
