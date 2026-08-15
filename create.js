import { auth, db, storage } from "./app.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const form = document.getElementById("createForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const posterFile = document.getElementById("posterInput").files[0];
  const title = document.getElementById("titleInput").value;
  const desc = document.getElementById("descInput").value;
  const prompt = document.getElementById("promptInput").value;

  if (!auth.currentUser) {
    alert("You must be logged in with Gmail to create a series.");
    return;
  }

  try {
    // Upload poster to Firebase Storage
    const posterRef = ref(storage, `posters/${auth.currentUser.uid}_${posterFile.name}`);
    await uploadBytes(posterRef, posterFile);
    const posterURL = await getDownloadURL(posterRef);

    // Call Seedance API (placeholder example)
    const response = await fetch("https://api.seedance.ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    const videoURL = data.videoUrl; // returned by Seedance

    // Save series info to Firestore
    await addDoc(collection(db, "series"), {
      title,
      description: desc,
      poster: posterURL,
      videoUrl: videoURL,
      creator: auth.currentUser.displayName || auth.currentUser.email,
      views: 0,
      createdAt: Date.now()
    });

    // Show preview
    document.getElementById("preview").innerHTML = `
      <h3>Preview</h3>
      <img src="${posterURL}" alt="Poster" style="width:200px;">
      <video src="${videoURL}" controls width="400"></video>
    `;

    alert("Series created successfully!");
  } catch (error) {
    console.error("Error creating series:", error);
    alert("Failed to create series. Check console for details.");
  }
});
