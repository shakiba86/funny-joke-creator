const API_URL = "https://icanhazdadjoke.com/";

const fetchBtn = document.getElementById("fetchBtn");
const userInput = document.getElementById("userInput");
const jokeList = document.getElementById("jokeList");

let jokes = []; // Array to store jokes for pagination
let jokesPerPage = 4;
let currentPage = 1;

function renderJoke() {
  jokeList.innerHTML = "";
  const startIndex = (currentPage - 1) * jokesPerPage;
  const endIndex = startIndex + jokesPerPage;
  const jokesToDisplay = jokes.slice(startIndex, endIndex);
  const jokeItems = jokesToDisplay
    .map((joke) => {
      const jokeClass = joke === "No jokes found." ? "no-emoji" : "with-emoji";
      const jokeHeading = joke === "No jokes found." ? "" : "<h2>Joke</h2>";
      return `
      <li class="${jokeClass}">
        ${jokeHeading}
        <p>${joke}</p>
      </li>
    `;
    })
    .join("");
  jokeList.innerHTML = jokeItems;
  if (endIndex < jokes.length) {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.classList.add("load-more-btn");
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderJoke();
    });
    jokeList.appendChild(loadMoreBtn);
  }
}

async function fetchJoke(term) {
  try {
    fetchBtn.textContent = "Loading...";
    fetchBtn.disabled = true;

    jokeList.innerHTML = "";
    jokes = [];
    currentPage = 1; // Reset jokes array for new search

    const headers = {
      Accept: "application/json",
      // "User-Agent": "My Joke App (https://example.com/contact)",
    };
    //If the search was done, add the searched word, otherwise, call the original api
    let url = term ? `${API_URL}search?term=${term}` : API_URL;

    const response = await axios.get(url, { headers });
    console.log(response);
    if (term) {
      const results = response.data.results || []; //If results is undefined or null it defaults to an empty array
      if (results.length === 0) {
        jokes = ["No jokes found."];
        renderJoke();
        return;
      }
      jokes = results.map(({ joke }) => joke);
    } else if (response.data.joke) {
      jokes = [response.data.joke];
    }
    renderJoke();
  } catch (error) {
    //I want to catch the errors, but unfortunately this API does not support it
    jokeList.innerHTML = "<li>No response received!</li>";
    if (error.response) {
      console.log("HTTP Status:", error.response.status);
    } else if (error.request) {
      console.log("Request Error: No response received");
    } else {
      console.log("Unexpected Error:", error.message);
    }
  } finally {
    userInput.value = ""; // Clear the input field after the search
    // Reset button text and re-enable it
    fetchBtn.textContent = "Get Joke";
    fetchBtn.disabled = false;
  }
}

fetchBtn.addEventListener("click", () => {
  const searchTerm = userInput.value.trim();
  fetchJoke(searchTerm);
});

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = userInput.value.trim();
    fetchJoke(searchTerm);
  }
});
