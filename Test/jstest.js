// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwugzNuCwCR32jNxaKvrij-8q8_CvbxB0",
    authDomain: "newsify-62188.firebaseapp.com",
    databaseURL: "https://newsify-62188-default-rtdb.firebaseio.com",
    projectId: "newsify-62188",
    storageBucket: "newsify-62188.appspot.com",
    messagingSenderId: "935168986533",
    appId: "1:935168986533:web:9081bc89a77f7de4cc2c4",
    measurementId: "G-G6X1WPW989"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref("newsArticles");

// Fetch articles from Firebase and display them
function fetchAndDisplayArticles() {
    console.log("Fetching articles from Firebase...");
    dbRef.on("value", (snapshot) => {
        console.log("Data received from Firebase");
        const articles = snapshot.val();
        console.log("Articles:", articles);
        if (articles) {
            displayArticles(articles);
        } else {
            console.log("No articles found in the database");
            document.getElementById("cards-container").innerHTML = "<p>No articles found.</p>";
        }
    }, (error) => {
        console.error("Error fetching data:", error);
        document.getElementById("cards-container").innerHTML = "<p>Error fetching articles.</p>";
    });
}

// Display articles in cards
function displayArticles(articles) {
    console.log("Displaying articles...");
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!cardsContainer) {
        console.error("Cards container not found in the DOM");
        return;
    }

    if (!newsCardTemplate) {
        console.error("News card template not found in the DOM");
        return;
    }

    cardsContainer.innerHTML = ''; // Clear previous content

    for (let key in articles) {
        const article = articles[key];
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        fetchFactCheck(article.title, cardClone.querySelector('.news-bias')); // Fetch fact check results
        cardsContainer.appendChild(cardClone);
    }
}

// Fill data in card
function fillDataInCard(cardClone, article) {
    console.log("Filling data for article:", article);
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    if (newsImg) newsImg.src = article.imageUrl || "https://via.placeholder.com/400x200";
    if (newsTitle) newsTitle.textContent = article.title || "No Title";
    if (newsDesc) newsDesc.textContent = article.content || "No Content";
    if (newsSource) newsSource.textContent = `${article.author || 'Unknown'} • ${new Date(article.date).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}`;
}

// Fetch fact-check information using Google Fact Check API
async function fetchFactCheck(title, resultElement) {
    const API_KEY_FACT = "AIzaSyDn_19gFYOKo39Fz_zl2PmA-YrhgKR2SMw"; // Replace with your Fact Check API Key
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(title)}&key=${API_KEY_FACT}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Log the response data to the console for debugging
        console.log("Fact Check API Response:", data);

        // Display fact-check results
        if (data.claims && data.claims.length > 0) {
            const results = data.claims.map(claim => {
                return `${claim.claimReview[0].textualRating}: <a href="${claim.claimReview[0].url}" target="_blank">${claim.claimReview[0].url}</a>`;
            }).join('<br>');
            resultElement.innerHTML = `Fact-check results:<br>${results}`;
        } else {
            resultElement.innerHTML = 'Please wait while our algorithms checks your news.';
        }
    } catch (error) {
        console.error("Error fetching fact check:", error);
        resultElement.innerHTML = 'Error fetching fact-check results.';
    }
}

// Event listener for new article submission
document.getElementById('NewsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const articleContent = document.getElementById('article-input').value;
    if (articleContent.trim() === '') {
        console.log("Empty article content, not submitting");
        return;
    }

    const newArticle = {
        title: "New User Submission",
        content: articleContent,
        author: "Anonymous",
        date: new Date().toISOString(),
        imageUrl: "https://th.bing.com/th?id=OIP.EV4CueKMVtIGwKE1h18H6QHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
    };

    console.log("Pushing new article to Firebase:", newArticle);
    // Push new article to Firebase
    dbRef.push(newArticle)
        .then(() => {
            console.log("Article successfully added to Firebase");
            document.getElementById('article-input').value = ''; // Clear the input field
        })
        .catch((error) => {
            console.error("Error adding article to Firebase:", error);
        });
});

// Initialize the page
window.addEventListener('load', () => {
    console.log("Page loaded, initializing...");
    fetchAndDisplayArticles();
});

console.log("Script loaded");
