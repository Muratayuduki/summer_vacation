const startButton = document.getElementById("start-button");
const requestInput = document.getElementById("request-input");
const submitRequestButton = document.getElementById("request-button");
const requestStatusDisplay = document.getElementById("request-status-display");
const familyList = document.getElementById("family-list");
const requestList = document.getElementById("request-list");
const familySelect = document.getElementById("family-select");

let familyMembers = [];
let requests = [];
let requestCounter = 0;

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

async function loadInitialData() {
    // Load family data from cookie first
    const cookieData = getCookie("familyData");
    if (cookieData) {
        familyMembers = JSON.parse(cookieData);
    } else {
        // Fallback to JSON file if no cookie
        try {
            const familyRes = await fetch('../json/family.json');
            familyMembers = await familyRes.json();
        } catch (error) {
            console.error('Could not load initial family data:', error);
            familyMembers = [];
        }
    }

    // Load requests data from cookie first
    const requestsCookieData = getCookie("requestsData");
    if (requestsCookieData) {
        requests = JSON.parse(requestsCookieData);
        if (requests.length > 0) {
            requestCounter = Math.max(...requests.map(r => r.id));
        }
    } else {
        // Fallback to JSON file if no cookie
        try {
            const requestsRes = await fetch('../json/requests.json');
            requests = await requestsRes.json();
            if (requests.length > 0) {
                requestCounter = Math.max(...requests.map(r => r.id));
            }
            setCookie("requestsData", JSON.stringify(requests), 365); // Save initial data to cookie
        } catch (error) {
            console.error('Could not load requests data:', error);
            requests = [];
        }
    }

    renderFamilyList();
    renderRequestList();
}

function renderFamilyList() {
    familyList.innerHTML = "";
    familySelect.innerHTML = ""; // Clear dropdown

    if (familyMembers.length === 0) {
        familyList.textContent = "登録された家族はいません。";
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "家族を登録してください";
        familySelect.appendChild(defaultOption);
        familySelect.disabled = true;
    } else {
        familyMembers.forEach(member => {
            // Populate the dropdown
            const option = document.createElement("option");
            option.value = member.name;
            option.textContent = member.name;
            familySelect.appendChild(option);

            // Populate the display list
            const li = document.createElement("li");
            li.textContent = `名前: ${member.name}`;
            familyList.appendChild(li);
        });
        familySelect.disabled = false;
    }
}

// The rest of the script remains largely the same...

// 依頼送信処理
submitRequestButton.addEventListener("click", () => {
  const requestText = requestInput.value.trim();
  const selectedFamilyMember = familySelect.value;

  if (requestText === "") {
    requestStatusDisplay.textContent = "依頼内容を入力してください。";
    return;
  }

  if (familyMembers.length === 0) {
    requestStatusDisplay.textContent = "先に家族を登録してください。";
    return;
  }

  requestCounter++;
  const newRequest = {
    id: requestCounter,
    text: requestText,
    status: "送信済み",
    acceptedBy: null,
    isCompleted: false,
    sentTo: selectedFamilyMember, // 送信相手を記録
  };
  requests.unshift(newRequest); // 新しい依頼をリストの先頭に追加
  setCookie("requestsData", JSON.stringify(requests), 365); // Save to cookie

  requestStatusDisplay.textContent = `「${requestText}」の依頼を${selectedFamilyMember}に送信しました。`;
  console.log("依頼データ:", newRequest);

  renderRequestList();
  requestInput.value = "";
});

// 依頼リストの表示
function renderRequestList() {
  requestList.innerHTML = "";
  if (requests.length === 0) {
    requestList.textContent = "依頼はありません。";
  } else {
    requests.forEach((req) => {
      const li = document.createElement("li");
      li.classList.add("request-item");
      li.innerHTML = `
                        <strong>依頼内容:</strong> ${req.text}<br>
                        <strong>現在の状況:</strong> ${req.status}<br>
                        ${
                          req.acceptedBy
                            ? `<strong>対応者:</strong> ${req.acceptedBy}`
                            : ""
                        }
                        <div class="kebab-menu">
                            <button class="kebab-button">&#8942;</button>
                            <div class="dropdown-menu">
                                <button class="delete-request-button" data-id="${
                                  req.id
                                }">削除</button>
                            </div>
                        </div>
                    `;
      requestList.appendChild(li);
    });
  }
}

// 依頼削除処理
requestList.addEventListener("click", (event) => {
  if (event.target.classList.contains("kebab-button")) {
    const dropdown = event.target.nextElementSibling;
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      if (menu !== dropdown) {
        menu.classList.remove("show");
      }
    });
    dropdown.classList.toggle("show");
  } else if (event.target.classList.contains("delete-request-button")) {
    const requestId = parseInt(event.target.dataset.id, 10);
    requests = requests.filter((req) => req.id !== requestId);
    setCookie("requestsData", JSON.stringify(requests), 365); // Save to cookie
    renderRequestList();
  }
});

// Close dropdowns if clicking outside
window.addEventListener("click", (event) => {
  if (!event.target.matches(".kebab-button")) {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
  }
});

// --- Web Speech API ---
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "ja-JP";
  recognition.continuous = false;
  recognition.interimResults = false;

  startButton.addEventListener("click", () => {
    requestStatusDisplay.textContent = "お話しください...";
    recognition.start();
  });

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    requestInput.value = speechResult;
    requestStatusDisplay.textContent = `「${speechResult}」と聞き取りました。`;
  };

  recognition.onend = () => {
    if (requestInput.value) {
      requestStatusDisplay.textContent = `「${requestInput.value}」と聞き取りました。`;
    }
  };

  recognition.onerror = (event) => {
    requestStatusDisplay.textContent =
      "ごめんなさい、うまく聞き取れませんでした。もう一度お願いします。";
    console.error("認識エラー:", event.error);
  };
} else {
  requestStatusDisplay.textContent =
    "お使いのブラウザは音声入力に対応していません。";
  startButton.disabled = true;
}

// Initial load
loadInitialData();