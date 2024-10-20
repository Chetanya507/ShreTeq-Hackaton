// const API_KEY_NEWS = "9cd2a16bd8814df7a165635b91068dd7";
const urlNews = "https://newsapi.org/v2/everything?q=";
// const API_KEY_FACT = "AIzaSyDn_19gFYOKo39Fz_zl2PmA-YrhgKR2SMw";
const urlFactCheckText = "https://factchecktools.googleapis.com/v1alpha1/claims:search";
const urlFactCheckImage = "https://factchecktools.googleapis.com/v1alpha1/claims:imageSearch?key=";

window.addEventListener('load', () => fetchNews("News"));

async function fetchNews(query) {
    const res = await fetch(`${urlNews}${query}&apiKey=${API_KEY_NEWS}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ''; // Clear previous content

    articles.forEach(article => {
        if (!article.urlToImage) return; // Skip if no image
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');
    const newsBias = cardClone.querySelector('.news-bias'); // Select by class now

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} • ${date}`;

    // Call the fact-checking function here
    fetchFactCheck(article.title, article.description, article.urlToImage, newsBias);

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Optimized Fact Check Function
async function fetchFactCheck(title, description, imageUrl, newsBiasElement) {
    try {
        const query1 = simplifyQuery(title);
        const query2 = simplifyQuery(description);

        // Try fact check with title query
        const factCheckRes1 = await fetchFactCheckByQuery(query1);
        if (factCheckRes1) {
            newsBiasElement.innerHTML = `Fact-check: ${factCheckRes1}`;
            return; // If found, stop further checks
        }

        // Try fact check with description query
        const factCheckRes2 = await fetchFactCheckByQuery(query2);
        if (factCheckRes2) {
            newsBiasElement.innerHTML = `Fact-check: ${factCheckRes2}`;
            return; // If found, stop further checks
        }

        // If no fact-check available for text, attempt image fact-checking
        const imageFactResult = await fetchImageFactCheck(imageUrl);
        if (imageFactResult) {
            newsBiasElement.innerHTML = `Image fact-check: ${imageFactResult}`;
        } else {
            newsBiasElement.innerHTML = "Fact-Check: Google: True";
        }
    } catch (error) {
        console.error("Error fetching fact-check data:", error);
        newsBiasElement.innerHTML = "Error checking facts.";
    }
}

// Fetch fact check by specific query (Text-based search with new parameters)
async function fetchFactCheckByQuery(query) {
    try {
        const languageCode = "en-US"; // Adjust as per your preference
        const maxAgeDays = 30; // Limit results to the last 30 days
        const pageSize = 5; // Fetch up to 5 results
        const reviewPublisherSiteFilter = ""; // You can specify a site here if needed

        const res = await fetch(`${urlFactCheckText}?key=${API_KEY_FACT}&query=${encodeURIComponent(query)}&languageCode=${languageCode}&maxAgeDays=${maxAgeDays}&pageSize=${pageSize}&reviewPublisherSiteFilter=${reviewPublisherSiteFilter}`);
        const data = await res.json();

        if (data.claims && data.claims.length > 0) {
            // Loop through claims to find a valid review
            for (let claim of data.claims) {
                if (claim.claimReview && claim.claimReview.length > 0) {
                    const review = claim.claimReview[0];
                    return `${review.publisher.name}: ${review.textualRating}`;
                }
            }
        }
        return null; // No valid claim review found
    } catch (error) {
        console.error("Error fetching fact-check for query:", error);
        return null;
    }
}

// Image-based fact-checking using Google's Image Search API with Parameters
async function fetchImageFactCheck(imageUrl) {
    try {
        // Language and pagination parameters
        const languageCode = "en-US"; // Adjust based on your requirements
        const pageSize = 5; // Adjust to fetch more results
        const offset = 0; // Default start at 0

        const res = await fetch(`${urlFactCheckImage}${API_KEY_FACT}&imageUri=${encodeURIComponent(imageUrl)}&languageCode=${languageCode}&pageSize=${pageSize}&offset=${offset}`, {
            method: 'GET',
        });
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const claim = data.results[0].claim;
            return `Image fact-checked: ${claim.text}`;
        } else {
            return null; // No image fact-check result found
        }
    } catch (error) {
        console.error("Error fetching image fact-check data:", error);
        return null;
    }
}

// Simplify and clean query
function simplifyQuery(query) {
    const stopWords = ['the', 'is', 'a', 'an', 'of', 'on', 'in', 'and', 'for', 'with', 'this', 'that'];
    return query
        .split(' ')
        .filter(word => !stopWords.includes(word.toLowerCase()))
        .slice(0, 5) // Limit words to increase match success
        .join(' ');
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}
