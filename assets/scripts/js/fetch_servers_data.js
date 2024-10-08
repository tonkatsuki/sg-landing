const icons = {
  CS2: "/icons/cs2.png",
  Gmod: "/icons/gmod.png",
  Valheim: "/icons/valheim.png",
};

const gameOrder = ["Gmod", "Valheim", "CS2"];
const fetchUrl = "https://test3.tonkatsuki.com";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

// Function to render the table
function renderTable(data) {
  const container = document.getElementById("server-data");
  container.innerHTML = ""; // Clear previous content

  for (let key of gameOrder) {
    if (data.servers.hasOwnProperty(key)) {
      const servers = data.servers[key];
      const table = document.createElement("table");
      table.setAttribute("data-game", key);

      for (let address in servers) {
        if (servers.hasOwnProperty(address)) {
          const server = servers[address];
          const row = document.createElement("tr");

          // (Same as before, truncated for brevity)

          // Create join options row
          const joinOptionsRow = document.createElement("tr");
          const joinOptionsCellFull = document.createElement("td");
          joinOptionsCellFull.colSpan = 5;
          const joinOptionsDiv = document.createElement("div");
          joinOptionsDiv.className = "collapsible-join-content";
          joinOptionsDiv.style.display = "none";  // Hidden by default

          // Add Join via Steam and Show Address buttons
          const steamJoinButton = document.createElement("button");
          steamJoinButton.textContent = "Join via Steam";
          steamJoinButton.addEventListener("click", () => {
            window.location.href = `steam://${address}`;
          });

          const showAddressButton = document.createElement("button");
          showAddressButton.textContent = "Show Address";
          showAddressButton.addEventListener("click", () => {
            alert(`Connect to: ${address}`);
          });

          // Add buttons to the join options div
          joinOptionsDiv.appendChild(steamJoinButton);
          joinOptionsDiv.appendChild(showAddressButton);
          joinOptionsCellFull.appendChild(joinOptionsDiv);
          joinOptionsRow.appendChild(joinOptionsCellFull);

          // Hide the entire row by default
          joinOptionsRow.style.display = "none";  // Fully hidden by default

          // Connect button column
          const connectCell = document.createElement("td");
          const connectButton = document.createElement("button");
          connectButton.textContent = "Join";
          connectButton.className = "join-button";

          // Toggle join options when "Join" button is clicked
          connectButton.addEventListener("click", () => {
            toggleJoinOptions(joinOptionsRow, connectButton);
          });

          connectCell.appendChild(connectButton);
          row.appendChild(connectCell);

          table.appendChild(row);
          table.appendChild(joinOptionsRow);  // Append the hidden row
        }
      }

      container.appendChild(table);
    }
  }
}

function toggleJoinOptions(joinOptionsRow, button) {
  const joinOptionsDiv = joinOptionsRow.querySelector(".collapsible-join-content");
  
  // If the options are hidden, show them
  if (joinOptionsDiv.style.display === "none") {
    joinOptionsDiv.style.display = "block";
    joinOptionsRow.style.display = "table-row";  // Show the row and options
    button.textContent = "Hide";
  } else {
    // Hide both the options and the entire row
    joinOptionsDiv.style.display = "none";
    joinOptionsRow.style.display = "none";  // Collapse the row
    button.textContent = "Join";
  }
}

function togglePlayerList(playerListRow, button) {
  const playerListDiv = playerListRow.querySelector(".collapsible-content");
  if (playerListDiv.style.display === "none") {
    playerListDiv.style.display = "block";
    playerListRow.style.display = "table-row";
    button.textContent = "Hide Players";
  } else {
    playerListDiv.style.display = "none";
    playerListRow.style.display = "none";
    button.textContent = "Show Players";
  }
}

async function init() {
  const data = await fetchData(fetchUrl);
  if (data) {
    renderTable(data);
  }
}

init();
