const API = "http://localhost:5000/api/forms";
const userId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

if (!userId) {
  alert("⚠️ Please login first!");
  window.location.href = "login.html";
}

document.getElementById("username").textContent = username ? `👋 ${username}` : "👋 User";

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  window.location.href = "login.html";
});

const formList = document.getElementById("forms-list");
const createForm = document.getElementById("create-form");
const toast = document.getElementById("toast");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  gsap.fromTo(toast, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 });
  setTimeout(() => {
    gsap.to(toast, { opacity: 0, y: 30, duration: 0.3, onComplete: () => toast.classList.add("hidden") });
  }, 2000);
}

// CREATE FORM
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(createForm));

  try {
    const res = await fetch(`${API}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId }),
    });

    const json = await res.json();
    if (res.ok) {
      showToast("✅ Form created!");
      loadForms();
      createForm.reset();
    } else {
      showToast(`❌ ${json.message}`);
    }
  } catch (err) {
    console.error("Form create error:", err);
    showToast("❌ Error creating form");
  }
});

// DELETE FORM
async function deleteForm(id) {
  if (!confirm("🗑️ Delete this form?")) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) {
      showToast("🗑️ Form deleted");
      loadForms();
    } else {
      showToast(`❌ ${json.message}`);
    }
  } catch (err) {
    console.error("Delete error:", err);
    showToast("❌ Error deleting form");
  }
}

// COPY URL
function copyToClipboard(url) {
  navigator.clipboard.writeText(url);
  showToast("📋 URL copied!");
}

// LOAD FORMS
async function loadForms() {
  formList.innerHTML = "<p class='text-gray-500'>Loading...</p>";
  try {
    const res = await fetch(`${API}/user/${userId}`);
    const json = await res.json();
    formList.innerHTML = "";
    if (!json.length) {
      formList.innerHTML = "<p class='text-gray-400 text-center'>No forms yet. Create one!</p>";
      return;
    }

    json.forEach((f) => {
      const url = `http://localhost:5000/api/forms/${f.id}/submit`;

      const div = document.createElement("div");
      div.className =
        "p-5 bg-white rounded-lg shadow border border-gray-200 flex justify-between items-start hover:shadow-md transition";

      div.innerHTML = `
        <div>
          <h3 class="text-lg font-semibold text-gray-800">${f.title}</h3>
          <p class="text-gray-500 text-sm mt-1">Submissions: ${f.submissions?.length || 0}</p>
          <div class="flex items-center gap-2 mt-2">
            <input type="text" readonly value="${url}" class="bg-gray-100 text-sm px-2 py-1 rounded border border-gray-300 w-72">
            <button onclick="copyToClipboard('${url}')" class="text-gray-700 hover:text-gray-900">
              <i class="ri-file-copy-line text-lg"></i>
            </button>
          </div>
        </div>
        <button onclick="deleteForm('${f.id}')" class="text-red-500 hover:text-red-600">
          <i class="ri-delete-bin-6-line text-xl"></i>
        </button>
      `;
      formList.appendChild(div);
    });
  } catch (err) {
    console.error("Load forms error:", err);
    formList.innerHTML = "<p class='text-red-500'>Failed to load forms.</p>";
  }
}

loadForms();
