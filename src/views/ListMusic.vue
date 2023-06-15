<template>
  <section class="mb-[100px]">
    <div class="container px-3 md:mx-auto">
      <div class="flex items-center justify-between my-1">
        <h1
          class="ml-[40%] text-white py-4 text-center font-semibold cursor-pointer md:hidden text-xl md:text-2xl lg:text-4xl"
        >
          Songs
        </h1>
        <div class="md:ml-[93%] lg:ml-[95%] md:mt-4">
          <ModalUsers />
        </div>
      </div>

      <div
        class="w-full overflow-y-scroll md:overflow-hidden md:grid md:grid-cols-5 xl:grid-cols-6 md:gap-4"
      >
        <div
          class="bg-gray-900 border border-gray-800 rounded-3xl shadow-lg md:hidden"
        >
          <div
            v-for="track in musics"
            :key="track.id"
            class="w-full max-w-md md:w-32 md:h-48 lg:w-48 lg:h-64 p-3 md:p-4 md:border md:border-gray-800 md:rounded-3xl md:shadow-lg md:bg-gray-900 md:mt-1"
          >
            <SongRow :track="track" :artist="track.artist" />
          </div>
        </div>

        <div class="flex flex-wrap">
          <div
            v-for="playlist in playlists"
            :key="playlist.name"
            class="text-white font-bold text-xl hidden md:block md:my-4 md:text-2xl mb-1 capitalize"
          >
            <h1>{{ playlist.name }}</h1>

            <div class="flex gap-3">
              <div
                v-for="musicId in playlist.ids"
                :key="musicId"
                class="hidden md:block w-full max-w-md md:w-32 md:h-48 lg:w-48 lg:h-64 p-3 md:p-4 md:border md:border-gray-800 md:rounded-3xl md:shadow-lg md:bg-gray-900 md:mt-1"
              >
                <SongRow
                  :track="getMusicById(musicId)"
                  :artist="getArtistById(getMusicById(musicId).artistId)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <MusicPlayer v-if="currentTrack" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import SongRow from "../components/SongRow.vue";
import MusicPlayer from "../components/MusicPlayer.vue";
import ModalUsers from "../components/ModalUsers.vue";

import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
const useSong = useSongStore();
const { isPlaying, currentTrack, musics } = storeToRefs(useSong);
const playlists = ref([]);

const getMusicById = (musicId) => {
  return musics.value.find((music) => music.id === musicId);
};

const getArtistById = (artistId) => {
  return {};
};

onMounted(async () => {
  isPlaying.value = false;
  useSong.fetchMusics();

  const response = await fetch(
    "https://matrikdev-music-api.vercel.app/playlist"
  );
  const data = await response.json();
  playlists.value = data;

  const musicResponse = await fetch(
    "https://matrikdev-music-api.vercel.app/musics"
  );
  const musicData = await musicResponse.json();
  musics.value = musicData;
});
</script>
