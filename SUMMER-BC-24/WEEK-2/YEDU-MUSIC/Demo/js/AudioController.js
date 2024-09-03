function toCapitalFirstLetter(words) {
  if (!words) return;
  else
    return words
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.replace(word[0], ""))
      .join(" ");
}

class AudioController {
  constructor(playlist = []) {
    this.currentSongIndex = 0;
    this.inputSlideIsActive = false;
    this.playlist = playlist;
    this.loadDOMElements();
    this.populatePlayList();
    this.newSong(0);
    this.setDOMEvents();
    this.setMediaSessionData();
  }

  loadDOMElements() {
    this.currentSongImage = document.querySelector(
      'img[data-type="current-song-image"]'
    );
    this.currentSongBackImage = document.querySelector(
      'img[data-type="current-song-back-image"]'
    );
    this.currentSongName = document.querySelector(
      '[data-type="current-song-name"]'
    );
    this.currentSongArtists = document.querySelector(
      '[data-type="current-song-artists"]'
    );
    this.currentTimeEl = document.querySelector(
      'span[data-type="song-current-time-min"]'
    );
    this.songDurationEl = document.querySelector(
      'span[data-type="song-duration-min"]'
    );
    this.progressBar = document.querySelector(
      'input[type="range"][data-type="progress-bar"]'
    );
    this.playlistContainer = document.querySelector(
      'ul[data-value="playlist"]'
    );
  }

  setDOMEvents() {
    this.audioElement.addEventListener("loadedmetadata", () => {
      this.setSongMins(true);
      this.watchProgressBar(this.progressBar.value);
      this.skipTotime(this.progressBar.value);
    });

    this.progressBar.addEventListener("input", (e) => {
      this.inputSlideIsActive = true;
      this.watchProgressBar(e.target?.value);
    });

    this.progressBar.addEventListener("change", (e) =>
      this.skipTotime(e.target?.value)
    );
  }

  populatePlayList() {
    this.playlist.forEach((song, i) => {
      song.audioElement = new Audio(`./songs/${song.song}`);
      song.index = i;

      const songItem = this.playlistItem(song);
      this.playlistContainer.insertAdjacentHTML("beforeend", songItem);

      song.audioElement.addEventListener("loadedmetadata", () => {
        const item = this.playlistContainer.children[i];
        if (!item) return;
        item.querySelector('[data-type="playlist-item-duration"]').textContent =
          this.secToMin(song.audioElement.duration);
      });
      song.audioElement.addEventListener("canplaythrough", function (e) {
        // console.log(
        //   "Audio is fully buffered or can be played through without interruption. --CANPLAYTHROUGH--"
        // );
        console.log(`EVENT: ${song.name} canplaythrough`);
        const anyCurrentPlayingTime = song.audioElement.currentTime;
        song.audioElement = new Audio(`./songs/${song.song}`);
        console.log(song.audioElement.currentTime, "prenew");
        song.audioElement.currentSong = anyCurrentPlayingTime;
        console.log();
      });
    });
  }

  setMediaSessionData() {
    const currentSong = this.playlist[this.currentSongIndex];
    if (!("mediaSession" in navigator) || !currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${currentSong.name} ${
        currentSong.artists.length > 1
          ? `(feat. ${currentSong.artists.slice(1).join(", ")})`
          : ""
      }`,
      artist: currentSong.artists[0],
      artwork: [
        {
          src: `./imgs/${currentSong.image}`,
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: `./imgs/${currentSong.image}`,
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: `./imgs/${currentSong.image}`,
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: `./imgs/${currentSong.image}`,
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: `./imgs/${currentSong.image}`,
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: `./imgs/${currentSong.image}`,
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
  }

  setSongMins(format = false) {
    const defaultMins = "0:00";
    this.currentTimeEl.textContent =
      this.secToMin(this.audioElement.currentTime) || defaultMins;
    if (!format) return;
    else {
      this.songDurationEl.textContent =
        this.secToMin(this.audioElement?.duration) || defaultMins;
    }
  }

  secToMin(seconds) {
    if (!seconds) return;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    let formattedSeconds;
    if (remainingSeconds < 10) formattedSeconds = "0" + remainingSeconds;
    else if (remainingSeconds === 60) formattedSeconds = "00";
    else formattedSeconds = remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  }

  updatePageTitle(newPageTitle) {
    document.title = newPageTitle;
  }

  addTimeUnit() {
    const newValue =
      (this.audioElement.currentTime / this.audioElement.duration) * 100;

    this.setSongMins();
    if (this.inputSlideIsActive) return;
    this.watchProgressBar(newValue);
  }

  startProgressCounter() {
    const unitTime = 0.5;
    this.progessIntervalId = setInterval(
      this.addTimeUnit.bind(this),
      unitTime * 1000
    );
  }

  stopProgressCounter() {
    clearInterval(this.progessIntervalId);
  }

  watchProgressBar(newValue) {
    document.documentElement.style.setProperty("--song-progress", newValue);
    this.progressBar.value = newValue;
    const duration = this.audioElement.duration;
    const currentTime = (newValue / 100) * duration;
    this.currentTimeEl.textContent = this.secToMin(currentTime) || "0:00";
  }

  skipTotime(percent) {
    try {
      const newPercent = +percent;
      console.log(newPercent);
      const duration = this.audioElement.duration;
      if (!duration) return;
      const currentTime = (newPercent / 100) * duration;
      this.setAudioCurrentTime(currentTime);
      this.inputSlideIsActive = false;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  setAudioCurrentTime(currentTime) {
    console.log("setAudioCurrentTime: ", currentTime);
    this.audioElement.currentTime = currentTime;
  }

  play() {
    this.audioElement.play();
    if (this.audioElement.paused) return;
    this.startProgressCounter();
  }

  pause({ reset = false } = {}) {
    if (reset) this.setAudioCurrentTime(0);
    this.audioElement.pause();
    this.stopProgressCounter();
  }

  newSong(songIndex = 0) {
    if (this.audioElement?.src) this.pause({ reset: true });

    const songData = this.playlist[songIndex];
    if (!songData) return;

    this.audioElement = songData?.audioElement;
    if (!this.audioElement?.src) return;

    const songImage = `./imgs/${songData.image}`;
    this.currentSongImage.src = songImage;
    this.currentSongBackImage.src = songImage;
    this.currentSongName.textContent = songData.name;
    this.currentSongArtists.textContent = songData.artists.join(", ");
    this.currentSongImage.alt = `Song Cover of Calm Down by ${songData.artists.join(
      " and "
    )}`;
    this.currentSongBackImage.alt = `Song Cover of Calm Down by ${songData.artists.join(
      " and "
    )}`;
    this.setSongMins(true);
    const newPageTitle = `${songData.name} • ${songData.artists.join(", ")}`;
    this.updatePageTitle(toCapitalFirstLetter(newPageTitle));
    this.setMediaSessionData();
  }

  next() {
    if (this.currentSongIndex < this.playlist.length - 1)
      this.currentSongIndex += 1;
    else this.currentSongIndex = 0;

    this.newSong(this.currentSongIndex);
  }

  previous() {
    if (this.audioElement.currentTime > 2.5)
      return this.newSong(this.currentSongIndex);

    if (this.currentSongIndex <= 0)
      this.currentSongIndex = this.playlist.length - 1;
    else this.currentSongIndex -= 1;

    this.newSong(this.currentSongIndex);
  }

  playlistItem(songData) {
    return `
        <li class="playlist--item" data-song-id="${songData.index}">
          <div>
            <div class="playlist--item--img">
              <span class="playlist--item--action">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                  />
                </svg>
              </span>
              <img src="./imgs/${songData.image}" alt="Song cover of ${
      songData.name
    }" />
            </div>
            <div>
              <p class="playlist--item--song-name">${songData.name}</p>
              <p class="playlist--item--song-artists">${
                songData.artists.length
                  ? songData.artists?.join(", ")
                  : "NO ARTIST"
              }</p>
            </div>
          </div>
          <div data-type="playlist-item-duration"></div>
        </li>`;
  }
}

export default AudioController;
