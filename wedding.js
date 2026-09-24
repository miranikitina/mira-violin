const musicLibrary = {
 ceremony: [
  {
    title: "A Thousand Years",
    file: "assets/a-thousand-years.mp4"
  },
  {
    title: "Perfect",
    file: "assets/perfect.mp4"
  },
  {
    title: "All of Me",
    file: "assets/all-of-me.mp4"
  }
],

  pop: [
  {
    title: "Viva La Vida",
    file: "assets/viva-la-vida.mpeg"
  }
],

 bollywood: [
  {
    title: "Kal Ho Naa Ho",
    file: "assets/kal-ho-naa-ho.mpeg"
  },
  {
    title: "Tum Hi Ho",
    file: "assets/tum-hi-ho.mpeg"
  },
  {
    title: "Din Shagna Da",
    file: "assets/din-shagna-da.mpeg"
  }
],

  jazz: [
  {
    title: "The Pink Panther",
    file: "assets/the-pink-panther.mpeg"
  }
],

  cocktail: [
  {
    title: "The Girl from Ipanema",
    file: "assets/the-girl-from-ipanema.mpeg"
  },
  {
    title: "Libertango",
    file: "assets/libertango.mpeg"
  },
],
classical: [
  {
    title: "Mozart — Eine kleine Nachtmusik",
    file: "assets/mozart-eine-kleine-nachtmusik.mpeg"
  }
]
};


const musicSamples = document.querySelector("#musicSamples");
const musicTabs = document.querySelectorAll(".music-tab");

function renderMusic(category) {
  if (!musicSamples || !musicLibrary[category]) return;

  musicSamples.innerHTML = "";

  musicLibrary[category].forEach((song) => {
    const item = document.createElement("article");
    item.className = "music-sample";

    item.innerHTML = `
      <div class="music-sample__info">
        <span class="music-sample__title">${song.title}</span>
        <span class="music-sample__preview">Listen to sample</span>
      </div>

      <audio controls preload="none">
        <source src="${song.file}">
        Your browser does not support audio playback.
      </audio>
    `;

    musicSamples.appendChild(item);
  });

  const players = musicSamples.querySelectorAll("audio");

  players.forEach((player) => {
    player.addEventListener("play", () => {
      players.forEach((otherPlayer) => {
        if (otherPlayer !== player) {
          otherPlayer.pause();
        }
      });
    });
  });
}

musicTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    musicTabs.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });

    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    renderMusic(tab.dataset.category);
  });
});

renderMusic("ceremony");