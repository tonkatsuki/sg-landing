const FETCH_URL = "http://135.148.3.4:27019/rolegrab";
const DEFAULT_AVATAR_PATH = "/icons/discordgenericavatar.png";
const ORDERED_ROLES = [
  "President",
  "Vice President",
  "Director",
  "Administrative Officer",
  "Technical Administrator",
  "Server Administrator",
  "Legend",
  "Supporter",
  "Nitro Booster",
];

async function fetchRoleData() {
  try {
    const response = await fetch(FETCH_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const roleData = await response.json();
    displayRoleData(roleData);
  } catch (error) {
    console.error("Error fetching role data:", error);
  }
}

function truncateName(name, maxLength = 13) {
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
}

function getRoleDescription(roleName) {
  const roleTemplate = document.querySelector(
    `#role-templates div[data-role="${roleName}"]`,
  );
  return roleTemplate ? roleTemplate.getAttribute("data-description") : "";
}

function displayRoleData(roleData) {
  const contentDiv = document.getElementById("discord-role-members");

  const mergedRoles = ["President", "Vice President"];
  const mergedRoleName = "President & Vice President";
  let mergedMembers = [];

  // Merge members of President and Vice President
  mergedRoles.forEach((roleName) => {
    if (roleData[roleName]) {
      mergedMembers = mergedMembers.concat(roleData[roleName].members);
    }
  });

  if (mergedMembers.length > 0) {
    const mergedRoleTable = document.createElement("div");
    mergedRoleTable.className = "role-table";

    const mergedRoleHeader = document.createElement("div");
    mergedRoleHeader.className = "role-header";
    mergedRoleHeader.textContent = mergedRoleName;
    mergedRoleHeader.style.color = roleData[mergedRoles[0]].color; // Use color of the first merged role
    mergedRoleTable.appendChild(mergedRoleHeader);

    const mergedRoleDescription = document.createElement("div");
    mergedRoleDescription.className = "role-description";
    mergedRoleDescription.textContent =
      "The President and Vice President are in charge of ensuring the community continues to run smoothly";
    mergedRoleHeader.appendChild(mergedRoleDescription);

    mergedMembers.forEach((member) => {
      const memberTile = document.createElement("div");
      memberTile.className = "member-tile";

      const memberAvatar = document.createElement("img");
      memberAvatar.src = member.avatar_url
        ? member.avatar_url
        : DEFAULT_AVATAR_PATH;
      memberAvatar.alt = member.name;

      const memberName = document.createElement("div");
      memberName.className = "member-name";
      memberName.textContent = truncateName(member.name);
      memberName.style.color = roleData[mergedRoles[0]].color; // Use color of the first merged role

      memberTile.appendChild(memberAvatar);
      memberTile.appendChild(memberName);
      mergedRoleTable.appendChild(memberTile);
    });

    contentDiv.appendChild(mergedRoleTable);
  }

  // Process the rest of the roles
  ORDERED_ROLES.forEach((roleName) => {
    if (
      roleName !== "President" && roleName !== "Vice President" &&
      roleData[roleName]
    ) {
      const role = roleData[roleName];
      const roleTable = document.createElement("div");
      roleTable.className = "role-table";

      const roleHeader = document.createElement("div");
      roleHeader.className = "role-header";
      roleHeader.textContent = roleName;
      roleHeader.style.color = role.color; // Set the header color to the role color
      roleTable.appendChild(roleHeader);

      const roleDescription = document.createElement("div");
      roleDescription.className = "role-description";
      roleDescription.textContent = getRoleDescription(roleName);
      roleHeader.appendChild(roleDescription);

      role.members.forEach((member) => {
        const memberTile = document.createElement("div");
        memberTile.className = "member-tile";

        const memberAvatar = document.createElement("img");
        memberAvatar.src = member.avatar_url
          ? member.avatar_url
          : DEFAULT_AVATAR_PATH;
        memberAvatar.alt = member.name;

        const memberName = document.createElement("div");
        memberName.className = "member-name";
        memberName.textContent = truncateName(member.name);
        memberName.style.color = role.color;

        memberTile.appendChild(memberAvatar);
        memberTile.appendChild(memberName);
        roleTable.appendChild(memberTile);
      });

      contentDiv.appendChild(roleTable);
    }
  });
}

fetchRoleData();
