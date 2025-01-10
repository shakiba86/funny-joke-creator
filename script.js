const API_URL = "https://icanhazdadjoke.com/";

const fetchBtn = document.getElementById("fetchBtn");
const userInput = document.getElementById("userInput");
const jokeList = document.getElementById("jokeList");

let jokes = [];
let jokesPerPage = 4;
let currentPage = 1;

function renderJoke(apiJokes, isSearch = false) {
  if (isSearch) {
    jokes =
      apiJokes.length > 0
        ? apiJokes.map(({ joke }) => joke)
        : ["No jokes found."];
  } else {
    jokes = apiJokes.joke ? [apiJokes.joke] : ["No jokes found."];
  }
  jokeList.innerHTML = "";

  const startIndex = (currentPage - 1) * jokesPerPage;
  const endIndex = startIndex + jokesPerPage;
  const jokesToDisplay = jokes.slice(startIndex, endIndex);

  jokesToDisplay.forEach(function (joke) {
    const jokeItem = document.createElement("li");
    jokeItem.classList.add(
      joke === "No jokes found." ? "no-emoji" : "with-emoji"
    );
    jokeItem.innerHTML = `
      ${joke === "No jokes found." ? "" : "<h2>Joke</h2>"}
      <p>${joke}</p>
    `;
    jokeList.appendChild(jokeItem);
  });

  if (endIndex < jokes.length) {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.classList.add("load-more-btn");
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderJoke(apiJokes, isSearch);
    });
    jokeList.appendChild(loadMoreBtn);
  }
}

async function fetchJoke(term) {
  try {
    fetchBtn.textContent = "Loading...";
    fetchBtn.disabled = true;

    jokeList.innerHTML = "";

    const headers = { Accept: "application/json" };
    let url = term ? `${API_URL}search?term=${term}` : API_URL;

    const response = await axios.get(url, { headers });
    console.log(response);
    const apiJokes = term ? response.data.results || [] : response.data;

    currentPage = 1; // Reset to the first page after fetching
    renderJoke(apiJokes, !!term);
  } catch (error) {
    console.log(error);
    jokeList.innerHTML = "<li>No response received!</li>";
    if (error.response) {
      console.log("HTTP Status:", error.response.status);
    } else {
      console.log("Unexpected Error:", error.message);
    }
  } finally {
    userInput.value = ""; // Clear the input field after the search
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
