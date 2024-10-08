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

          // Icon column
          const iconCell = document.createElement("td");
          const iconImg = document.createElement("img");
          iconImg.src = icons[key];
          iconImg.alt = key;
          iconImg.style.width = "20px";
          iconImg.style.height = "20px";
          iconCell.appendChild(iconImg);
          row.appendChild(iconCell);

          // Server name and map column
          const serverNameMapCell = document.createElement("td");
          serverNameMapCell.innerHTML =
            `
              <span style="color:white;">${server.server_name}</span>
              <br>
              <span style="color:green;">@</span> ${server.map}
            `;
          row.appendChild(serverNameMapCell);

          // Players count column
          const playersCell = document.createElement("td");
          playersCell.appendChild(
            document.createTextNode(`${server.players} / ${server.max_players}`)
          );
          row.appendChild(playersCell);

          // Player list functionality
          const playerListCell = document.createElement("td");
          const playerListRow = document.createElement("tr");
          const playerListCellFull = document.createElement("td");
          playerListCellFull.colSpan = 5;
          const playerListDiv = document.createElement("div");
          playerListDiv.className = "collapsible-content";
          if (server.player_list && server.player_list.length > 0) {
            const button = document.createElement("button");
            button.textContent = "Show Players";
            button.className = "toggle-players-button";
            button.addEventListener("click", () => {
              togglePlayerList(playerListRow, button);
            });
            playerListCell.appendChild(button);
            const playerList = document.createElement("ul");
            server.player_list.forEach((player) => {
              const playerItem = document.createElement("li");
              playerItem.textContent = `Name: ${player.name}, Score: ${player.score}`;
              playerList.appendChild(playerItem);
            });
            playerListDiv.appendChild(playerList);
          }
          playerListCellFull.appendChild(playerListDiv);
          playerListRow.appendChild(playerListCellFull);
          row.appendChild(playerListCell);

          // Connect button with popup functionality
          const connectCell = document.createElement("td");
          const connectButton = document.createElement("button");
          connectButton.textContent = "Join";
          connectButton.className = "join-button";

          // Open popup on click
          connectButton.addEventListener("click", () => {
            openJoinPopup(address, server.server_name, connectButton);
          });

          connectCell.appendChild(connectButton);
          row.appendChild(connectCell);

          table.appendChild(row);
          table.appendChild(playerListRow);
        }
      }
      container.appendChild(table);
    }
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

function openJoinPopup(address, serverName, button) {
  // Create the popup element
  const popup = document.createElement("div");
  popup.className = "join-popup"; // Add a class for styling
  popup.innerHTML = `
    <h2>Join ${serverName}</h2>
    <p>Choose your preferred join method:</p>
    <button id="join-steam">Join via Steam (steam://${address})</button>
    <button id="join-copy">Copy Server Address</button>
    <button id="join-close">Close</button>
  `;

  // Position the popup in the middle of the screen
  popup.style.position = "absolute";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";

  // Add event listeners for buttons
  const joinSteamButton = document.getElementById("join-steam");
  joinSteamButton.addEventListener("click", () => {
    window.location.href = `steam://${address}`;
    closePopup();
  });

  const copyButton = document.getElementById("join-copy");
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(`steam://${address}`);
    closePopup();
  });

  const closeButton = document.getElementById("join-close");
  closeButton.addEventListener("click", () => {
    closePopup();
  });

  // Show the popup and disable the button until closed
  popup.style.display = "block";
  button.disabled = true;

  // Add a click event listener to the document to close the popup when clicking outside
  document.addEventListener("click", function (event) {
    if (event.target !== popup && !popup.contains(event.target)) {
      closePopup();
    }
  });
}

function closePopup() {
  const popup = document.querySelector(".join-popup");
  if (popup) {
    popup.remove();
    const joinButton = document.querySelector(".join-button");
    if (joinButton) {
      joinButton.disabled = false;
    }
  }
}

async function init() {
  const data = await fetchData(fetchUrl);
  if (data) {
    renderTable(data);
  }
}
init();
