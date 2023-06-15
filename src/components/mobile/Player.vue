<template>
  <div class="w-full flex px-6 py-4">
    <router-link to="/" class="text-white pt-3">
      <ChevronDown
        fillColor="#ffffff"
        class="hover:scale-1500 hover:font-bold hover:transition-all"
        :size="20"
      />
    </router-link>
    <h1
      class="text-white m-auto pl-7 font-semibold cursor-pointer text-xl md:text-2xl lg:text-4xl md:hidden"
    >
      Now Playing
    </h1>

    <div class="md:ml-[90%] xl:ml-[94%]">
      <ModalUsers />
    </div>
  </div>
  <section id="Player" v-if="audio" class="pb-10 md:pb-20">
    <div class="container px-4 md:px-8 pb-16">
      <div class="md:flex md:flex-row">
        <div class="grid grid-cols-1 w-full">
          <div class="flex flex-col pt-2 pb-1 md:flex-row md:w-[100%]">
            <div class="flex-shrink-0 mb-2 md:flex md:left-0">
              <img
                :src="currentTrack.image"
                class="w-[90%] m-auto h-64 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl"
                :alt="currentTrack.title"
              />
            </div>
            <div class="flex flex-col mt-5 flex-1 min-w-0 pl-4 md:pl-5">
              <h1
                class="font-bold text-2xl md:text-3xl lg:text-4xl text-white truncate capitalize"
              >
                {{ currentTrack.title }}
              </h1>
              <p
                class="text-lg text-gray-300 truncate pt-1 md:text-lg capitalize mb-2"
              >
                {{ currentTrack.artist }}
              </p>
            </div>

            <div class="md:hidden mb-8">
              <div class="flex flex-col items-center h-[25px]">
                <div
                  ref="seekerContainer"
                  class="w-[87%] relative mb-3 flex"
                  @mouseenter="isHover = true"
                  @mouseleave="isHover = false"
                >
                  <input
                    v-model="range"
                    ref="seeker"
                    type="range"
                    class="absolute rounded-full my-2 w-full h-0 z-40 appearance-none bg-opacity-100 focus:outline-none accent-white"
                    :class="{ rangeDotHidden: !isHover }"
                  />
                  <div
                    class="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0"
                    :style="`width: ${range}%;`"
                    :class="isHover ? 'bg-[#52D7BF]' : 'bg-white'"
                  />
                  <div
                    class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full"
                  />
                </div>
                <div
                  class="flex items-center justify-between px-2 mt-2 w-[90%]"
                >
                  <div
                    v-if="isTrackTimeCurrent"
                    class="text-white text-[12px] flex"
                  >
                    {{ isTrackTimeCurrent }}
                  </div>
                  <div
                    v-if="isTrackTimeTotal"
                    class="text-white text-[12px] flex"
                  >
                    {{ isTrackTimeTotal }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="md:hidden">
            <div
              class="w-full px-3 md:w-[50%] flex items-center justify-between mb-2"
            >
              <div
                class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center"
              >
                <router-link to="/lirik">
                  <Music fillColor="#cbd5e1" :size="18" />
                </router-link>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center"
              >
                <Heart
                  class="animate-pulse transition-all"
                  fillColor="#EB5757"
                  :size="18"
                />
              </div>
            </div>
          </div>

          <div class="hidden md:block md:w-[100%]">
            <div
              class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center md:ml-[93%] xl:ml-[85%] mb-4"
            >
              <Heart
                class="animate-pulse transition-all"
                fillColor="#EB5757"
                :size="18"
              />
            </div>
          </div>

          <div class="hidden md:block">
            <div
              class="w-[100%] h-96 max-w-md lg:max-w-2xl p-4 overflow-y-scroll no-scrollbar scroll-smooth border border-gray-800 rounded-3xl shadow-lg bg-gray-900"
            >
              <div
                class="flex lg:text-3xl items-center justify-center mb-2 text-white font-semibold"
              >
                <Music fillColor="#ffffff" :size="25" />
                <h4 class="pl-2">Lyrics</h4>
              </div>

              <p
                class="text-white text-base text-center lg:text-2xl p-1 mt-3 font-semibold whitespace-pre-line"
              >
                {{ currentTrack.lyrics.join("\n") }}
              </p>
            </div>
          </div>

          <div class="md:hidden">
            <div
              class="flex flex-col items-start justify-start p-4 mt-2 w-[95%] md:[60%] h-32 bg-gray-900 rounded-3xl mx-auto text-gray-300"
            >
              <div class="flex w-full items-center justify-between">
                <h4 class="uppercase">Up Next</h4>
                <span class="right-0">
                  <PlaylistMusicOutline fillColor="#d1d5db" :size="20" />
                </span>
              </div>
              <div
                class="flex w-full items-center justify-between"
                v-for="track in upcomingTracks"
                :key="track.id"
                @click="playOrPauseThisSong(track)"
              >
                <h5 class="truncate">{{ track.title }}</h5>
                <h6 class="truncate">{{ track.artist }}</h6>
                <p class="tracking-wide">
                  {{
                    track.duration
                      ? calculateDuration(track.duration)
                      : "Unknown"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden md:block pl-5 w-[60%] h-full mt-2">
          <div class="grid grid-cols-1">
            <div
              class="w-full bg-gray-900 border border-gray-800 rounded-xl shadow-lg"
            >
              <div class="w-full h-[600px] p-3 overflow-y-scroll no-scrollbar">
                <div
                  class="flex flex-row"
                  v-for="track in musics"
                  :key="track.id"
                >
                  <div
                    class="flex-shrink-0"
                    @click="playOrPauseThisSong(track)"
                  >
                    <img
                      :src="track.image"
                      class="w-16 h-16 object-cover rounded-xl shadow-xl hover:scale-105 md:hover:scale-110 hover:transition will-change-transform"
                      :alt="track.title"
                    />
                  </div>
                  <div
                    @click="playOrPauseThisSong(track)"
                    class="flex flex-col flex-1 min-w-0 justify-center pl-3 pt-1 mb-6"
                  >
                    <h1
                      class="font-semibold mb-1 text-base text-white truncate capitalize"
                    >
                      {{ track.title }}
                    </h1>
                    <p class="text-[14px] text-white truncate">
                      {{ track.artist }}
                    </p>
                  </div>
                  <div
                    class="flex items-center justify-center text-center text-white font-semibold cursor-pointer"
                  >
                    <div v-if="!track.like">
                      <HeartOutline
                        :fillColor="getHeartColor(track)"
                        :size="25"
                        @click="toggleHeart(track)"
                      />
                    </div>
                    <div v-else>
                      <Heart fillColor="#EB5757" :size="25" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <div
        class="w-full bg-gray-950 px-4 py-4 bg-transparent backdrop-blur-sm fixed bottom-0 md:w-[80%] lg:w-[60%] md:flex md:items-center md:left-[10%] lg:left-[18%]"
      >
        <div class="flex items-center justify-between mt-3">
          <div
            class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer"
          >
            <button
              class="mx-2"
              :class="{ active: isShuffled }"
              @click="toggleShuffle"
            >
              <Shuffle
                :fillColor="isShuffled ? '#14b8a6' : '#FFFFFF'"
                :size="25"
                @click="shuffleSongs"
              />
            </button>
          </div>

          <!-- skip start -->
          <div
            class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
          >
            <SkipBackward
              fillColor="#ffffff"
              :size="20"
              @click="useSong.prevSong(currentTrack)"
            />
          </div>

          <!-- pause -->
          <div
            class="flex w-14 h-14 md:w-14 md:h-14 items-center justify-center text-black font-extrabold cursor-pointer bg-white rounded-full"
          >
            <button
              @click="useSong.playOrPauseThisSong(currentArtist, currentTrack)"
            >
              <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
              <Pause v-else fillColor="#181818" :size="20" />
            </button>
          </div>

          <div
            class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
          >
            <SkipForward
              fillColor="#ffffff"
              :size="20"
              @click="useSong.nextSong(currentTrack)"
            />
          </div>

          <div
            class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer"
          >
            <Repeat fillColor="#ffffff" :size="20" />
          </div>
        </div>
      </div>
    </div>

    <div class="hidden md:block">
      <MusicPlayer />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";

import Heart from "vue-material-design-icons/Heart.vue";
import PlaylistMusicOutline from "vue-material-design-icons/PlaylistMusicOutline.vue";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";
import Repeat from "vue-material-design-icons/Repeat.vue";
import Shuffle from "vue-material-design-icons/Shuffle.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import Music from "vue-material-design-icons/Music.vue";
import HeartOutline from "vue-material-design-icons/HeartOutline.vue";

import MusicPlayer from "../MusicPlayer.vue";
import ModalUsers from "../ModalUsers.vue";
import Lirics from "./Lirics.vue";

import { useSongStore } from "../../stores/song";
import { storeToRefs } from "pinia";
const useSong = useSongStore();
const { isPlaying, audio, currentTrack, currentArtist, musics } =
  storeToRefs(useSong);

let isHover = ref(false);
let isTrackTimeCurrent = ref(null);
let isTrackTimeTotal = ref(null);
let seeker = ref(null);
let seekerContainer = ref(null);
let range = ref(0);
const isShuffled = ref(false);

const getHeartColor = (track) => {
  return track.like ? "#EB5757" : "#ffffff";
};

const toggleHeart = (track) => {
  track.like = !track.like;
};

const playOrPauseThisSong = (track) => {
  useSong.playOrPauseThisSong(track.artist, track);
};

function calculateDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return (
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
}

const upcomingTracks = computed(() => {
  const currentTrackIndex = musics.value.findIndex(
    (song) => song.id === currentTrack.value?.id
  );
  const numNextTracks = 2;
  const totalTracks = musics.value.length;

  if (currentTrackIndex + numNextTracks < totalTracks) {
    return musics.value.slice(
      currentTrackIndex + 1,
      currentTrackIndex + numNextTracks + 1
    );
  } else {
    return musics.value.slice(currentTrackIndex + 1);
  }
});

onMounted(() => {
  const loadmetadata = () => {
    audio.value.addEventListener("loadedmetadata", function () {
      const duration = audio.value.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      isTrackTimeTotal.value =
        minutes + ":" + seconds.toString().padStart(2, "0");
    });
  };

  const timeupdate = () => {
    audio.value.addEventListener("timeupdate", function () {
      var minutes = Math.floor(audio.value.currentTime / 60);
      var seconds = Math.floor(audio.value.currentTime - minutes * 60);
      isTrackTimeCurrent.value =
        minutes + ":" + seconds.toString().padStart(2, "0");
      const value = (100 / audio.value.duration) * audio.value.currentTime;
      range.value = value;
      seeker.value = value;
    });
  };

  watch(
    () => audio.value,
    () => {
      timeupdate();
      loadmetadata();
    }
  );

  if (currentTrack.value && currentTrack.value.music) {
    if (audio.value instanceof Audio) {
      audio.value.pause();
      audio.value = null;
    }

    audio.value = new Audio(currentTrack.value.music);
    setTimeout(() => {
      timeupdate();
      loadmetadata();
    }, 300);
  }

  if (currentTrack.value) {
    seeker.value.addEventListener("change", function () {
      const time = audio.value.duration * (this.value / 100);
      audio.value.currentTime = time;
    });

    seeker.value.addEventListener("mousedown", function () {
      audio.value.pause();
      isPlaying.value = false;
    });

    seeker.value.addEventListener("mouseup", function () {
      audio.value.play();
      isPlaying.value = true;
    });

    seekerContainer.value.addEventListener("click", function (e) {
      const clickPosition = (e.pageX - this.offsetLeft) / this.offsetWidth;
      const time = audio.value.duration * clickPosition;
      audio.value.currentTime = time;
      seeker.value.value =
        (100 / audio.value.duration) * audio.value.currentTime;
    });
  }
});

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const shuffleSongs = () => {
  // musics.value = shuffle(musics.value);
  if (isShuffled.value) {
    musics.value.sort((a, b) => a.id - b.id);
  } else {
    const originalOrder = musics.value.slice().sort((a, b) => a.id - b.id);
    musics.value = shuffle(originalOrder);
  }
  isShuffled.value = !isShuffled.value;
};
</script>

<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}
</style>
