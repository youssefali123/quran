// Global variables
let read = document.getElementById("read");
let currentSurahData;

// Fetch and display surah data
function getAPI(surahNum) {
    read.innerHTML = "<p>Loading...</p>";
    fetch("https://api.alquran.cloud/v1/quran/ar.alafasy")
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            currentSurahData = data.data.surahs[surahNum - 1];
            displaySurah(currentSurahData);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            read.innerHTML = "<p>Error loading data.</p>";
        });
}

// Display surah verses
function displaySurah(surahData) {
    read.innerHTML = "";
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    let fragment = document.createDocumentFragment();

    surahData.ayahs.forEach((ayah, index) => {
        let text = ayah.text.replaceAll("۞", " ");
        let num = ayah.numberInSurah;
        let arabicNum = num.toString().replace(/\d/g, d => arabicNumbers[d]);
        let content = document.createElement("div");
        content.className = "ayah";
        content.id = num.toString();
        content.innerHTML = `${text} <label class="ayahNum">﴿${arabicNum}﴾</label>`;
        fragment.appendChild(content);
    });

    read.appendChild(fragment);
}

// Handle audio playback
function getAudio(ayahElement, ayahIndex, surahData, allAyahs) {
    // Remove audio from all ayahs
    allAyahs.forEach(e => {
        let audio = e.getElementsByTagName("audio")[0];
        if (audio) {
            audio.pause();
            e.classList.remove("played");
            audio.remove();
        }
    });

      let audioUrl = surahData.ayahs[ayahIndex].audio;
  //  let audioUrl = `https://the-quran-project.github.io/Quran-Audio/Data/4/${surahData.number}_${ayahIndex + 1}.mp3`;
    let audioTag = document.createElement("audio");
    audioTag.src = audioUrl;
    ayahElement.appendChild(audioTag);
    ayahElement.classList.add("played");
    ayahElement.scrollIntoView({ behavior: "smooth" });
    audioTag.play();
    // Auto-play next ayah when current one ends
    audioTag.addEventListener("ended", () => {
        let nextIndex = ayahIndex + 1;
        if (nextIndex < surahData.ayahs.length) {
            let nextAyah = allAyahs[nextIndex];
            if (nextAyah) {
                getAudio(nextAyah, nextIndex, surahData, allAyahs);
            }
        }
    });
}

// Global click handler for ayahs
// document.addEventListener("click", (e) => {
//     if (e.target.className === "ayah" && currentSurahData) {
//         let allAyahs = document.querySelectorAll(".ayah");
//         let ayahIndex = parseInt(e.target.id) - 1;
//         if (e.target.classList.contains("played")) {
//             let audio = e.target.getElementsByTagName("audio")[0];
//             if (audio) {
//                 audio.pause();
//                 e.target.classList.remove("played");
//                 audio.remove();
//             }
//         } else {
//             getAudio(e.target, ayahIndex, currentSurahData, allAyahs);
//         }
//     }
// });
document.addEventListener("click", (e) => {
    let ayahElement = e.target.closest(".ayah");
    if (ayahElement && currentSurahData) {
        let allAyahs = document.querySelectorAll(".ayah");
        let ayahIndex = parseInt(ayahElement.id) - 1;

        if (ayahElement.classList.contains("played")) {
            // Ayah is already playing: pause audio, remove it, and remove "played" class
            let audio = ayahElement.getElementsByTagName("audio")[0];
            if (audio) {
                audio.pause();
                ayahElement.classList.remove("played");
                audio.remove();
            }
        } else {
            // Ayah is not playing: play it and stop any other playing ayah
            getAudio(ayahElement, ayahIndex, currentSurahData, allAyahs);
        }
    }
});

// Initial load
getAPI(1);

// Surah selection
let ayahInput = document.getElementById("ayah");
let btn = document.getElementById("btn");
btn.addEventListener("click", () => {
    let surahNum = parseInt(ayahInput.value);
    if (surahNum >= 1 && surahNum <= 114) {
        getAPI(surahNum);
    } else {
        ayahInput.value = "";
    }
});
document.addEventListener("click", (e)=>{
    if(!e.target.className == "ayah"){
        let audio = e.target.getElementsByTagName("audio")[0];
        console.log(audio)
        e.target.classList.remove("played");
        console.log(e.target.classList)
        audio.pause();
        audio.remove();
    }
})

// Dark mode toggle
document.addEventListener("dblclick", () => {
    document.body.classList.toggle("dark");
    window.localStorage.setItem("dark", document.body.classList.contains("dark"));
});

window.addEventListener("load", () => {
    if (window.localStorage.getItem("dark") === "true") {
        document.body.classList.add("dark");
    }
});
// document.addEventListener("click", (e) => {
//     // Find the nearest ayah element, even if a child is clicked
//     let ayahElement = e.target.closest('.ayah');
    
//     // Proceed only if an ayah was clicked and surah data is available
//     if (ayahElement && currentSurahData) {
//         let allAyahs = document.querySelectorAll(".ayah");
//         let ayahIndex = parseInt(ayahElement.id) - 1;

//         // If the ayah is already playing
//         if (ayahElement.classList.contains("played")) {
//             let audio = ayahElement.getElementsByTagName("audio")[0];
//             if (audio) {
//                 audio.pause();                  // Pause the audio
//                 ayahElement.classList.remove("played"); // Remove the "played" class
//                 audio.remove();                 // Remove the audio element
//             }
//         } else {
//             // If not playing, play the audio for this ayah
//             getAudio(ayahElement, ayahIndex, currentSurahData, allAyahs);
//         }
//     }
// });

// Prevent multi-touch default behavior
document.addEventListener("touchmove", (event) => {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });
