// Create the modal dynamically when the script loads
const modal = document.createElement('div');
modal.id = "join-modal";
modal.style.display = "none"; // Hidden by default
modal.style.position = "fixed";
modal.style.zIndex = "1000";
modal.style.left = "50%";
modal.style.top = "50%";
modal.style.transform = "translate(-50%, -50%)";
modal.style.backgroundColor = "#333";
modal.style.padding = "20px";
modal.style.color = "white";
modal.style.borderRadius = "8px";
modal.innerHTML = `
  <h3>Join Server</h3>
  <p id="modal-address"></p>
  <button id="steam-join-button">Join via Steam</button>
  <button id="show-address-button">Show Server Address</button>
  <button id="close-modal-button">Close</button>
`;
document.body.appendChild(modal);

// Add event listeners to the modal buttons
const steamJoinButton = document.getElementById('steam-join-button');
const showAddressButton = document.getElementById('show-address-button');
const closeModalButton = document.getElementById('close-modal-button');

closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

function showModal(address) {
  document.getElementById('modal-address').textContent = `Server Address: ${address}`;
  steamJoinButton.onclick = () => {
    window.location.href = `steam://${address}`;
  };
  showAddressButton.onclick = () => {
    alert(`Connect to: ${address}`);
  };
  modal.style.display = 'block'; // Show the modal
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
            `<span style="color:white;">${server.server_name}</span><br><span style="color:green;">@</span> ${server.map}`;
          row.appendChild(serverNameMapCell);

          // Players count column
          const playersCell = document.createElement("td");
          playersCell.appendChild(
            document.createTextNode(
              `${server.players} / ${server.max_players}`,
            ),
          );
          row.appendChild(playersCell);

          // Show players button column
          const playerListCell = document.createElement("td");
          const playerListRow = document.createElement("tr");
          const playerListCellFull = document.createElement("td");
          playerListCellFull.colSpan = 5;
          const playerListDiv = document.createElement("div");
          playerListDiv.className = "collapsible-content";
          playerListDiv.style.display = "none"; // Hide the player list by default

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
              playerItem.textContent =
                `Name: ${player.name}, Score: ${player.score}`;
              playerList.appendChild(playerItem);
            });
            playerListDiv.appendChild(playerList);
          }
          playerListCellFull.appendChild(playerListDiv);
          playerListRow.appendChild(playerListCellFull);
          playerListRow.style.display = "none";
          row.appendChild(playerListCell);

          // Connect button column
          const connectCell = document.createElement("td");
          const connectButton = document.createElement("button");
          connectButton.textContent = "Join";
          connectButton.className = "join-button";
          connectButton.addEventListener("click", () => {
            showModal(address);
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
