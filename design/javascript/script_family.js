const familyForm = document.getElementById("family-form");
const familyNameInput = document.getElementById("family-name");
const familyContactInput = document.getElementById("family-contact");
const familyList = document.getElementById("family-list");

let familyMembers = [];

// --- Cookie Helper Functions ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// --- Main Logic ---

// Load data from Cookie, fallback to JSON file
async function loadFamilyData() {
    const cookieData = getCookie("familyData");
    if (cookieData) {
        familyMembers = JSON.parse(cookieData);
    } else {
            const response = await fetch('../json/family.json');
            familyMembers = await response.json();
    renderFamilyList();
}
}
// Handle family registration form submission
familyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newFamily = {
    id: familyMembers.length > 0 ? Math.max(...familyMembers.map(m => m.id)) + 1 : 1,
    name: familyNameInput.value,
    contact: familyContactInput.value,
  };
  familyMembers.push(newFamily);

  setCookie("familyData", JSON.stringify(familyMembers), 10000);

  alert(`${newFamily.name}さんの情報を登録しました。`);
  familyNameInput.value = "";
  familyContactInput.value = "";
  renderFamilyList();
});

// Render the family list
function renderFamilyList() {
  familyList.innerHTML = "";
  if (familyMembers.length === 0) {
    familyList.textContent = "登録された家族はいません。";
  } else {
    familyMembers.forEach((member) => {
      const li = document.createElement("li");
      li.textContent = `名前: ${member.name}, 連絡先: ${member.contact}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";
      deleteButton.classList.add("delete-family-button");
      deleteButton.dataset.id = member.id;
      li.appendChild(deleteButton);

      familyList.appendChild(li);
    });
  }
}

// Handle family member deletion
familyList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-family-button")) {
    const familyId = parseInt(event.target.dataset.id, 10);
    familyMembers = familyMembers.filter((mem) => mem.id !== familyId);
    
    setCookie("familyData", JSON.stringify(familyMembers), 365); // Update cookie after deletion

    renderFamilyList();
  }
});

// Initial load
loadFamilyData();