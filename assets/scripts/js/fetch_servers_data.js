const icons = {
  CS2: "/icons/cs2.png",
  Gmod: "/icons/gmod.png",
  Valheim: "/icons/valheim.png",
};

const gameOrder = ["Gmod", "Valheim", "CS2"];
const fetchUrl = "https://test3.tonkatsuki.com";
const discordUrl =
  "https://discord.com/channels/399344695970496512/1292794891205738517/1292797521965482077"; // Discord link

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
            `<span style="color:white;">${server.server_name}</span><br><span style="color:green;">@</span> ${server.map}`;
          row.appendChild(serverNameMapCell);

          // Players count column
          const playersCell = document.createElement("td");
          playersCell.textContent = `${server.players} / ${server.max_players}`;
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

          // Create join options row
          const joinOptionsRow = document.createElement("tr");
          const joinOptionsCellFull = document.createElement("td");
          joinOptionsCellFull.colSpan = 5;
          const joinOptionsDiv = document.createElement("div");
          joinOptionsDiv.className = "collapsible-join-content";
          joinOptionsDiv.style.display = "none"; // Hidden by default

          if (key === "Valheim") {
            // Join instructions via Discord button
            const discordJoinButton = document.createElement("button");
            discordJoinButton.textContent = "Join instructions via Discord";
            discordJoinButton.className = "join-button";
            discordJoinButton.addEventListener("click", () => {
              window.open(discordUrl, "_blank"); // Open Discord link in a new tab
            });
            joinOptionsDiv.appendChild(discordJoinButton);
          } else {
            // Join via Steam button
            const steamJoinButton = document.createElement("button");
            steamJoinButton.textContent = "Join via Steam";
            steamJoinButton.className = "join-button";
            steamJoinButton.addEventListener("click", () => {
              window.location.href = `steam://${address}`;
            });

            // Copy Address button
            const copyAddressButton = document.createElement("button");
            copyAddressButton.textContent = "Copy Address 📎"; // Added paperclip emoji
            copyAddressButton.className = "join-button";
            copyAddressButton.style.backgroundColor = "#007bff"; // Blue color
            copyAddressButton.style.color = "white"; // White text for contrast (optional)
            copyAddressButton.style.borderColor = "#007bff"; // Blue border (optional)
            copyAddressButton.addEventListener("click", () => {
              navigator.clipboard.writeText(address)
                .then(() => {
                  copyAddressButton.textContent = "Copied!"; // Keep emoji during feedback
                  setTimeout(() => {
                    copyAddressButton.textContent = "Copy Address 📎"; // Restore with emoji
                  }, 2000); // Reset button text after 2 seconds
                })
                .catch((err) => {
                  console.error("Failed to copy: ", err);
                  alert("Failed to copy address.  Please copy manually.");
                });
            });

            joinOptionsDiv.appendChild(steamJoinButton);
            joinOptionsDiv.appendChild(copyAddressButton);
          }

          joinOptionsCellFull.appendChild(joinOptionsDiv);
          joinOptionsRow.appendChild(joinOptionsCellFull);
          joinOptionsRow.style.display = "none"; // Ensure it's not shown initially

          // Toggle join options when "Join" button is clicked
          connectButton.addEventListener("click", () => {
            toggleJoinOptions(joinOptionsRow, connectButton);
          });
          connectCell.appendChild(connectButton);
          row.appendChild(connectCell);
          table.appendChild(row);
          table.appendChild(playerListRow);
          table.appendChild(joinOptionsRow);
        }
      }
      container.appendChild(table);
    }
  }
}

// Function to toggle the join options row
function toggleJoinOptions(joinOptionsRow, button) {
  const joinOptionsDiv = joinOptionsRow.querySelector(
    ".collapsible-join-content",
  );
  if (joinOptionsDiv.style.display === "none") {
    joinOptionsDiv.style.display = "block";
    joinOptionsRow.style.display = "table-row"; // Show the join options row
    button.textContent = "Hide Join";
  } else {
    joinOptionsDiv.style.display = "none";
    joinOptionsRow.style.display = "none"; // Hide the join options row
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
