const API_URL = "https://icanhazdadjoke.com/";

const fetchBtn = document.getElementById("fetchBtn");
const userInput = document.getElementById("userInput");
const jokeList = document.getElementById("jokeList");

// function renderJoke(joke) {
//   const jokeItem = document.createElement("li");
//   jokeItem.innerHTML = `<h2>Joke</h2><p>${joke}</p>`;
//   jokeList.appendChild(jokeItem);
// }
function renderJoke(joke) {
  const jokeItem = document.createElement("li");

  // Add a class to conditionally disable the emoji for "No jokes found."
  jokeItem.classList.add(
    joke === "No jokes found." ? "no-emoji" : "with-emoji"
  );

  jokeItem.innerHTML = `
    <h2>${joke === "No jokes found." ? "" : "Joke"}</h2>
    <p>${joke}</p>
  `;
  jokeList.appendChild(jokeItem);
}

async function fetchJoke(term) {
  try {
    fetchBtn.textContent = "Loading...";
    fetchBtn.disabled = true;

    jokeList.innerHTML = "";

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
        //search returned no jokes for the given term
        renderJoke("No jokes found.");
        return;
      }
      results.forEach(({ joke }) => renderJoke(joke));
      return;
    }
    //When no joke is searched, a random joke will be displayed by default
    if (response.data.joke) {
      const { joke } = response.data;
      renderJoke(joke);
      return;
    }
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
