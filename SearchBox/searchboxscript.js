document.getElementById('search-button').addEventListener('click', function () {
    const query = document.getElementById('search-input').value.toLowerCase();
    const content = document.getElementById('content').children;

    for (let i = 0; i < content.length; i++) {
        const item = content[i];
        if (item.textContent.toLowerCase().includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }
});

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-input');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query)
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
})
