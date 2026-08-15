import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLWvaGp1VeBwpVfn_GywQbZXBfZjoULwI",
  authDomain: "aniflex-aba20.firebaseapp.com",
  projectId: "aniflex-aba20",
  storageBucket: "aniflex-aba20.firebasestorage.app",
  messagingSenderId: "204063583276",
  appId: "1:204063583276:web:61dcffcf329d4dd9f9b589",
  measurementId: "G-N2S4WDKBHY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Login
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const result = await signInWithPopup(auth, provider);
  alert(`Welcome ${result.user.displayName}`);
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  alert("Logged out!");
});

// Show plus sign only if logged in
auth.onAuthStateChanged(user => {
  const createBtn = document.getElementById("createBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (user) {
    createBtn.style.display = "block";
    logoutBtn.style.display = "inline-block";
  } else {
    createBtn.style.display = "none";
    logoutBtn.style.display = "none";
  }
});

// Load series posters
async function loadSeries() {
  const grid = document.getElementById("seriesGrid");
  const querySnapshot = await getDocs(collection(db, "series"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const card = `
      <div class="card">
        <img src="${data.poster}" alt="Poster">
        <h4>${data.title}</h4>
        <p>by ${data.creator} · ${data.views} views</p>
        <button onclick="window.location.href='series.html?id=${doc.id}'">Watch Series</button>
      </div>
    `;
    grid.innerHTML += card;
  });
}
loadSeries();
