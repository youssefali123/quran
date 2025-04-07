// Global variables
let read = document.getElementById("read");
let currentSurahData;
let container = document.querySelector(".container");
let side = document.querySelector(".side");
function closeNav() {
  side.classList.add("active");
}
let allSurahs = document.getElementById("allSurahs");
// Fetch and display surah data
function getAPI(surahNum) {
  read.innerHTML = "<p>Loading...</p>";
  fetch("https://api.alquran.cloud/v1/quran/ar.alafasy")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      for (let i = 0; i < 114; i++) {
        let mainDiv = document.createElement("div");
        mainDiv.className = "mainDiv";
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.innerHTML = data.data.surahs[i].number;
        span.classList.add("menuSpan");
        mainDiv.appendChild(div);
        mainDiv.appendChild(span);
        div.innerHTML = data.data.surahs[i].name.replace("سُورَةُ", "");
        div.id = data.data.surahs[i].number;
        div.setAttribute("onclick", "getAPI(this.id); closeNav()");
        allSurahs.appendChild(mainDiv);
      }
      currentSurahData = data.data.surahs[surahNum - 1];
      displaySurah(currentSurahData);
    })
    .catch((error) => {
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
    let arabicNum = num.toString().replace(/\d/g, (d) => arabicNumbers[d]);
    let content = document.createElement("div");
    // content.appendChild(ayahName);
    content.className = "ayah";
    content.id = num.toString();
    // content.innerHTML = `${text} <label class="ayahNum">﴿${arabicNum}﴾</label>`;
    content.innerHTML = `${text} <label class="ayahNum">۝${arabicNum}</label>`;
    fragment.appendChild(content);
  });
  let ayahName = document.createElement("div");
  ayahName.className = "ayahName";
  ayahName.innerHTML = `<span>${surahData.name} - ${surahData.ayahs.length} Ayahs</span>`;
  read.appendChild(ayahName);
  read.appendChild(fragment);
}

// Handle audio playback
function getAudio(ayahElement, ayahIndex, surahData, allAyahs) {
  // Remove audio from all ayahs
  allAyahs.forEach((e) => {
    let audio = e.getElementsByTagName("audio")[0];
    if (audio) {
      audio.pause();
      e.classList.remove("played");
      audio.remove();
    }
  });

  let audioUrl = surahData.ayahs[ayahIndex].audio;
  // let audioUrl = `https://the-quran-project.github.io/Quran-Audio/Data/4/${surahData.number}_${ayahIndex + 1}.mp3`;
  let audioTag = document.createElement("audio");
  audioTag.src = audioUrl;
  ayahElement.appendChild(audioTag);
  ayahElement.classList.add("played");
  // ayahElement.scrollIntoView({ behavior: "smooth" });
  if (container && ayahElement) {
    container.scrollTo({
      top: ayahElement.offsetTop - container.offsetTop,
      behavior: "smooth",
    });
  }
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
document.addEventListener("click", (e) => {
  if (!e.target.className == "ayah") {
    let audio = e.target.getElementsByTagName("audio")[0];
    console.log(audio);
    e.target.classList.remove("played");
    console.log(e.target.classList);
    audio.pause();
    audio.remove();
  }
});

// Dark mode toggle
document.addEventListener("dblclick", () => {
  document.body.classList.toggle("dark");
  window.localStorage.setItem("dark", document.body.classList.contains("dark"));
});

window.addEventListener("load", () => {
  if (window.localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
  }
  let side = document.querySelector(".side");
  // side.classList.add("active");
  if (side.classList.contains("active")) {
    let icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-bars");
    icon.classList.add("menuSpan");
  }
});

// Prevent multi-touch default behavior
document.addEventListener(
  "touchmove",
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

// for menuSpan
let menuSpan = document.querySelector(".menuSpan");

document.addEventListener("click", (e) => {
 if (e.target.classList.contains("menuSpan")) {
    document.querySelector(".side").classList.toggle("active");
      if(!side.classList.contains("active")){
        side.classList.add("notactive");
        setTimeout(() => {
            document.querySelector(".sidepop").classList.toggle("hidepop");
            
          },300)
        }else{
          side.classList.remove("notactive");
          document.querySelector(".sidepop").classList.toggle("hidepop");
        }
 }
});
document.querySelector(".sidepop").addEventListener("click", (e) => {
  if (!e.target.classList.contains("menuSpan")) {
    // document.querySelector(".sidepop").classList.toggle("hidepop");
    // document.querySelector(".side").classList.toggle("active");
    menuSpan.click();
  }
})
let footer = document.querySelector(".footer");
let ch = Array.from(document.body.children);

let menu = document.getElementById("menu");
let fun;
let text;

// for long mouse down
document.addEventListener("pointerdown", (e) => {
  if (
    e.target.classList.contains("ayah") ||
    e.target.classList.contains("ayahSpan")
  ) {
    fun = setTimeout(() => {
      text = e.target.innerText;
      menu.style.display = "flex";
      let top = e.clientY;
      let left = e.clientX;
      menu.style.top = `${top + 10}px`;
      menu.style.left = `${left - 20}px`;
    }, 500);
  }
});
document.addEventListener("pointerup", (e) => {
  clearInterval(fun);
});
menu.children[0].addEventListener("click", () => {
  navigator.clipboard.writeText(text);
  menu.style.display = "none";
});
document.addEventListener("contextmenu", (e) => {
  if (
    e.target.classList.contains("ayah") ||
    e.target.classList.contains("ayahSpan")
  ) {
    let element = e.target;
    text = element.innerText;
    clearInterval(fun);
    e.preventDefault();
    menu.style.display = "flex";
    let top = e.clientY;
    let left = e.clientX;
    let padding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top"));
    console.log("pad", padding);
    menu.style.top = `${top  + 40}px`;
    menu.style.left = `${left - 20}px`;
  } else {
    menu.style.display = "none";
  }
});
document.addEventListener("click", (e) => {
  menu.style.display = "none";
  if(!e.target.classList.contains("menuSpan")){
    // side.classList.add("nonactive");
  }
});

