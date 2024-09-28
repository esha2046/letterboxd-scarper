document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rec');
  const input = document.getElementById('username');
  const resultContainer = document.getElementById('result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    const username = input.value.trim();

    if (!username) {
      alert('Please enter a valid username.');
      return;
    }

    try {
      // Fetch data from the server
      const response = await fetch(`http://localhost:3000/scrape/${username}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Display the fetched data
      resultContainer.innerHTML = `
        <h2>${data.profileName}</h2>
        <h3>Ratings:</h3>
        <ul>${data.ratings.map(r => `<li>${r.movie}: ${r.rating}</li>`).join('')}</ul>
        <h3>Watchlist:</h3>
        <ul>${data.watchlist.map(w => `<li><a href="${w.url}">${w.movie}</a></li>`).join('')}</ul>
        <h3>Reviews:</h3>
        <ul>${data.reviews.map(r => `<li>${r.movie}: ${r.review} (${r.rating})</li>`).join('')}</ul>
        <h3>Lists:</h3>
        <ul>${data.lists.map(l => `<li><a href="${l.listUrl}">${l.listName}</a></li>`).join('')}</ul>`;
      
    } catch (error) {
      console.error('Error fetching data:', error);
      resultContainer.innerHTML = `<p>Failed to fetch data. Please try again.</p>`;
    }
  });
});
