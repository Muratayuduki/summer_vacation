const familyForm = document.getElementById("family-form");
const familyNameInput = document.getElementById("family-name");
const familyContactInput = document.getElementById("family-contact");
const familyList = document.getElementById("family-list");

let familyMembers = [];

// Fetch family data from JSON
async function loadFamilyData() {
        const response = await fetch('family.json');
        if (!response.ok) {
            throw new Error('family.jsonの読み込みに失敗しました。');
        }
        familyMembers = await response.json();
        renderFamilyList();
}

// 家族登録フォームの送信処理
familyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newFamily = {
    id: familyMembers.length > 0 ? Math.max(...familyMembers.map(m => m.id)) + 1 : 1,
    name: familyNameInput.value,
    contact: familyContactInput.value,
  };
  familyMembers.push(newFamily);

  // ここではJSONファイルへの書き込みは行わず、配列を更新するだけ
  // 将来的にAPIを呼び出す処理をここに実装します
  console.log('Updated familyMembers:', familyMembers);

  alert(`${newFamily.name}さんの情報を登録しました。`);
  familyNameInput.value = "";
  familyContactInput.value = "";
  renderFamilyList();
});

// 家族リストの表示
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

familyList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-family-button")) {
    const familyId = parseInt(event.target.dataset.id, 10);
    familyMembers = familyMembers.filter((mem) => mem.id !== familyId);
    // ここでもJSONファイルへの書き込みは行わない
    console.log('Updated familyMembers:', familyMembers);
    renderFamilyList();
  }
});

// 初期表示
loadFamilyData();
