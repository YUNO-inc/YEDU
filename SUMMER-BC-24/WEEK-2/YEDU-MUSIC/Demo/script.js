import AudioControllerClass from "./js/AudioController.js";
import playlist from "./playlist.js";

const playIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                  />
                </svg>`;
const pauseIcon = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"
                />
              </svg>`;

const AudioController = new AudioControllerClass(playlist);

class App {
  constructor() {
    this.startButton = document.querySelector('[data-value="main-control"]');
    this.nextButton = document.querySelector(
      'button[data-value="next-song-control"]'
    );
    this.prevButton = document.querySelector(
      'button[data-value="prev-song-control"]'
    );
    this.playlistContainer = document.querySelector(
      'ul[data-value="playlist"]'
    );

    this.startButton.addEventListener("click", (e) => this.setStartOption(e));
    this.nextButton.addEventListener("click", (e) => this.nextSong(e));
    this.prevButton.addEventListener("click", (e) => this.prevSong(e));
    this.playlistContainer.addEventListener("click", (e) =>
      this.playFromPlayList(e.target.closest("li"))
    );
    this.activatePlaylistItem(AudioController.currentSongIndex);
    AudioController.playlist.forEach((song) =>
      song.audioElement.addEventListener("ended", (e) => this.nextSong())
    );
    this.setMediaSessionEvents();
  }

  setMediaSessionEvents() {
    navigator.mediaSession.setActionHandler("play", () => this.play());
    navigator.mediaSession.setActionHandler("pause", () => this.pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => this.nextSong());
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      this.prevSong();
    });
    navigator.mediaSession.setActionHandler("seekto", (details) =>
      AudioController.setAudioCurrentTime(details.seekTime)
    );
  }

  setStartOption(e) {
    const btn = e.target.closest('[data-value="main-control"]');
    if (btn.dataset.type === "play-btn") this.play();
    else this.pause();
  }

  play() {
    const btn = document.querySelector('[data-value="main-control"]');
    AudioController.play();
    btn.innerHTML = pauseIcon;
    btn.dataset.type = "pause-btn";
    this.activatePlaylistItem(AudioController.currentSongIndex);
  }

  pause() {
    const btn = document.querySelector('[data-value="main-control"]');
    AudioController.pause();
    btn.innerHTML = playIcon;
    btn.dataset.type = "play-btn";
  }

  nextSong() {
    AudioController.next();
    this.play();
  }

  prevSong() {
    AudioController.previous();
    this.play();
  }

  playFromPlayList(playlistItem) {
    if (!playlistItem) return;
    const songIndex = +playlistItem.dataset.songId;
    AudioController.newSong(songIndex);
    AudioController.currentSongIndex = songIndex;
    this.play();
  }

  activatePlaylistItem(itemIndex) {
    for (let i = 0; i < this.playlistContainer.children.length; i++) {
      const playlistItem = this.playlistContainer.children[i];
      const itemId = playlistItem.dataset.songId;

      if (itemId === String(itemIndex)) playlistItem.dataset.state = "active";
      else playlistItem.dataset.state = "inactive";
    }
  }
}

new ProjectLinker("66ddbc39f9cddd07fcb7d22d");

export default new App();
