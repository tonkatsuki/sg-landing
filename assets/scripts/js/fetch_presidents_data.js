(function () {
  const FETCH_URL_PRESIDENTS = "/data/presidents.json";
  const DEFAULT_PICTURE_PATH = "/images/unknown.png"; // Ensure this default path is correct

  async function fetchPresidentsData() {
    try {
      const response = await fetch(FETCH_URL_PRESIDENTS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const presidentsData = await response.json();
      displayPresidentsData(presidentsData);
    } catch (error) {
      console.error("Error fetching presidents data:", error);
    }
  }

  function truncateName(name, maxLength = 13) {
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  }

  function displayPresidentsData(presidentsData) {
    const contentDiv = document.getElementById("presidents-container");

    presidentsData.forEach((president) => {
      const presidentTile = document.createElement("div");
      presidentTile.className = "member-tile";

      const presidentAvatar = document.createElement("img");
      const imagePath = president.picture
        ? `${president.picture}`
        : DEFAULT_PICTURE_PATH;
      presidentAvatar.src = imagePath;
      presidentAvatar.alt = president.name;

      const presidentName = document.createElement("div");
      presidentName.className = "member-name";
      presidentName.textContent = truncateName(president.name);

      const yearsServed = document.createElement("div");
      yearsServed.className = "years-served";
      yearsServed.textContent = president.years_served;

      presidentTile.appendChild(presidentAvatar);
      presidentTile.appendChild(presidentName);
      presidentTile.appendChild(yearsServed);

      contentDiv.appendChild(presidentTile);
    });
  }

  fetchPresidentsData();
})();
