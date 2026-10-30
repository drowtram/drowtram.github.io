const searchForm = document.getElementById('blog-search');
const searchInput = document.getElementById('search-query');
const searchStatus = document.getElementById('search-status');
const searchResults = document.getElementById('search-results');
let searchIndex;

async function searchPosts() {
    const query = searchInput.value.trim();
    searchResults.replaceChildren();
    if (!query) {
        searchStatus.textContent = '输入关键词，搜索全部文章。';
        return;
    }
    searchStatus.textContent = '正在搜索…';
    try {
        if (!searchIndex) {
            searchIndex = fetch(searchForm.dataset.indexUrl).then(response => {
                if (!response.ok) throw new Error('Search index unavailable');
                return response.json();
            });
        }
        const posts = await searchIndex;
        if (query !== searchInput.value.trim()) return;
        searchResults.replaceChildren();
        const terms = query.toLowerCase().split(/\s+/);
        const matches = posts.filter(post => {
            const text = [post.title, post.subtitle, ...post.tags, post.content].join(' ').toLowerCase();
            return terms.every(term => text.includes(term));
        });
        for (const post of matches) {
            const article = document.createElement('article');
            article.className = 'post-preview';
            const title = document.createElement('h2');
            title.className = 'post-title';
            const link = document.createElement('a');
            link.href = post.url;
            link.textContent = post.title;
            title.append(link);
            const date = document.createElement('p');
            date.className = 'post-meta';
            date.textContent = post.date;
            const excerpt = document.createElement('p');
            excerpt.className = 'post-content-preview';
            excerpt.textContent = post.subtitle || post.content.slice(0, 160);
            article.append(title, date, excerpt);
            searchResults.append(article);
        }
        searchStatus.textContent = matches.length ? `找到 ${matches.length} 篇文章。` : '没有找到相关文章，请试试其他关键词。';
    } catch (error) {
        if (query === searchInput.value.trim()) searchStatus.textContent = '搜索加载失败，请刷新页面后重试。';
    }
}

searchInput.value = searchInput.value || new URLSearchParams(location.search).get('q') || '';
searchInput.addEventListener('input', searchPosts);
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    searchPosts();
});
searchPosts();
