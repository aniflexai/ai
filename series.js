import { db } from "./app.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Get series ID from URL
const urlParams = new URLSearchParams(window.location.search);
const seriesId = urlParams.get("id");

async function loadSeries() {
  if (!seriesId) {
    document.body.innerHTML = "<h2>No series selected.</h2>";
    return;
  }

  // Load series info
  const seriesDoc = await getDoc(doc(db, "series", seriesId));
  if (!seriesDoc.exists()) {
    document.body.innerHTML = "<h2>Series not found.</h2>";
    return;
  }

  const data = seriesDoc.data();
  document.getElementById("seriesTitle").textContent = data.title;
  document.getElementById("seriesPoster").src = data.poster;
  document.getElementById("seriesDesc").textContent = data.description;

  // Load episodes (clips)
  const episodesDiv = document.getElementById("episodes");
  const clipsSnapshot = await getDocs(collection(db, "series", seriesId, "clips"));

  if (clipsSnapshot.empty) {
    episodesDiv.innerHTML = "<p>No episodes yet.</p>";
  } else {
    clipsSnapshot.forEach((clipDoc) => {
      const clip = clipDoc.data();
      const episode = `
        <div class="episode">
          <h4>${clip.title}</h4>
          <video src="${clip.videoUrl}" controls width="400"></video>
        </div>
      `;
      episodesDiv.innerHTML += episode;
    });
  }
}

loadSeries();
