import { defineStore } from "pinia";
import axios from "axios";

export const useSongStore = defineStore("song", {
  state: () => ({
    musics: [],
    isPlaying: false,
    audio: null,
    currentArtist: null,
    currentTrack: null,
    playlist: {},
    musicList: {},
    isRepeatActive: false,
  }),
  actions: {
    async fetchMusics() {
      try {
        const response = await axios.get("/musics");
        this.musics = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async fetchMusicList() {
      try {
        const response = await axios.get("/musics");
        this.musicList = response.data.map((music) => ({
          id: music.id,
          img: music.img,
          title: music.title,
          artist: music.artist,
        }));
      } catch (error) {
        console.error("Failed to fetch music list:", error);
      }
    },

    async fetchPlaylist() {
      try {
        const response = await axios.get("/playlist");
        this.playlist = response.data;
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
      }
    },

    getPlaylist() {
      return this.playlist;
    },

    async loadSong(artist, track) {
      try {
        this.currentArtist = artist;
        this.currentTrack = track;

        // Memeriksa apakah audio sedang diputar dan menghentikannya jika iya
        if (this.audio && typeof this.audio.pause) {
          // if (this.audio && typeof this.audio.pause === "function") {
          this.audio.pause();
        }

        if (!this.audio) {
          this.audio = new Audio();
        }

        // Mengatasi kemungkinan kesalahan saat memuat audio
        this.audio.addEventListener("error", (error) => {
          console.log("Error loading audio:", error);
          if (error.target && error.target.error) {
            console.log("Audio load error code:", error.target.error.code);
            console.log(
              "Audio load error message:",
              error.target.error.message
            );
          }
        });

        // Memulai pemutaran setelah audio dimuat
        this.audio.addEventListener("loadedmetadata", () => {
          this.isPlaying = true;
          this.audio.play();
        });

        this.audio.addEventListener("ended", () => {
          this.nextSong();
        });

        this.audio.src = track.music;

        // Tunggu hingga audio selesai dimuat
        await this.audio.load();

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Mulai pemutaran audio
        this.audio.play();
      } catch (error) {
        console.log(error);
      }
    },

    playOrPauseSong() {
      if (this.audio.readyState === 4) {
        if (this.audio.paused) {
          if (this.audio.currentTime === this.audio.duration) {
            this.audio.currentTime = 0;
          }
          this.isPlaying = true;
          this.audio.play().catch((error) => {
            console.log("Error playing audio:", error);
          });
        } else {
          this.isPlaying = false;
          this.audio.pause();
        }
      }
    },

    playOrPauseThisSong(artist, track) {
      if (
        !this.audio ||
        !this.audio.src ||
        this.currentTrack?.id !== track?.id
      ) {
        this.loadSong(artist, track);
      } else {
        this.playOrPauseSong();
      }
    },

    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    prevSong(currentTrack) {
      if (!Array.isArray(this.musics)) {
        console.error("Invalid musics data");
        return;
      }

      const currentIndex = this.musics.findIndex(
        (song) => song.id === currentTrack.id
      );
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        const prevSong = this.musics[prevIndex];
        this.loadSong(this.currentArtist, prevSong);
        this.setCurrentTrack(prevSong);
      }
    },

    nextSong(currentTrack) {
      if (!Array.isArray(this.musics)) {
        console.error("Invalid musics data");
        return;
      }

      const currentIndex = this.musics.findIndex(
        (song) => song.id === currentTrack?.id
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < this.musics.length) {
        const nextSong = this.musics[nextIndex];
        this.loadSong(this.currentArtist, nextSong);
        this.setCurrentTrack(nextSong);
      }
    },

    // repeatSong() {
    //   if (this.audio) {
    //     this.isRepeatActive = !this.isRepeatActive;
    //     this.audio.removeEventListener("ended", this.handleSongEnd);
    //     if (this.isRepeatActive) {
    //       this.audio.addEventListener("ended", this.handleSongEnd);
    //     }
    //   }
    //   console.log("repeatSong() function called");
    //   console.log("isRepeatActive:", this.isRepeatActive);
    //   console.log("audio:", this.audio);
    // },

    // handleSongEnd() {
    //   if (this.isRepeatActive) {
    //     this.audio.currentTime = 0;
    //     this.audio.play();
    //   } else {
    //     this.resetState();
    //   }
    // },

    // repeatSong() {
    //   this.isRepeatActive = !this.isRepeatActive;
    //   console.log("repeatSong() function called");
    //   console.log("isRepeatActive:", this.isRepeatActive);
    //   console.log("audio:", this.audio);
    // },

    // handleSongEnd() {
    //   if (this.isRepeatActive) {
    //     this.audio.currentTime = 0;
    //     this.audio.play();
    //   } else {
    //     // Hentikan pemutaran audio yang sebelumnya (jika ada)
    //     if (this.audio && typeof this.audio.pause === "function") {
    //       this.audio.pause();
    //     }
    //     this.resetState();
    //   }
    // },

    playFromFirst() {
      this.resetState();
      let track = this.musics[0];
      this.loadSong(this.currentArtist, track);
    },

    resetState() {
      this.isPlaying = false;
      this.audio = null;
      this.currentArtist = null;
      this.currentTrack = null;
    },
  },
  persist: true,
});
