document.addEventListener("DOMContentLoaded", function() {
  logMessage("DOM content loaded. Starting fetch operation.");

  fetch("http://135.148.3.1:27019/servers")
    .then((response) => {
      logMessage("Received response from fetch.");
      if (!response.ok) {
        logMessage(`Network response was not ok: ${response.statusText}`);
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      logMessage("Fetch successful. Data received.");
      renderServers(data);
    })
    .catch((error) => {
      logMessage(
        "There has been a problem with your fetch operation: " + error.message,
      );
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
    });
});

function renderServers(data) {
  const serversContainer = document.getElementById("servers-container");
  if (!serversContainer) {
    logMessage("servers-container element not found.");
    return;
  }

  for (const [key, value] of Object.entries(data)) {
    const serverElement = document.createElement("div");
    serverElement.className = "server";
    serverElement.innerHTML = `
            <h3>${value.server_name}</h3>
            <p><strong>Game:</strong> ${value.game}</p>
            <p><strong>Map:</strong> ${value.map}</p>
            <p><strong>Max Players:</strong> ${value.max_players}</p>
            <p><strong>Current Players:</strong> ${value.players}</p>
            <p><strong>Address:</strong> ${key}</p>
        `;
    serversContainer.appendChild(serverElement);
    logMessage("Added server: " + value.server_name);
  }
  logMessage("All servers rendered.");
}

function logMessage(message) {
  const logContainer = document.getElementById("log-container");
  if (logContainer) {
    const logElement = document.createElement("p");
    logElement.textContent = message;
    logContainer.appendChild(logElement);
  }
}
