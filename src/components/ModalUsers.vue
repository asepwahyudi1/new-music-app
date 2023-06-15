<template>
  <div>
    <div class="w-9 h-9 mt-2 rounded-full md:hidden" @click="open = true">
      <AccountCircleOutline fillColor="#ffffff" :size="30" />
    </div>
    <div class="w-9 h-9 mt-1 rounded-full hidden md:block" @click="open = true">
      <AccountCircleOutline fillColor="#ffffff" :size="40" />
    </div>

    <Teleport to="body">
      <div v-if="open">
        <div class="z-10 bg-opacity-40 bg-gray-900 inset-0 fixed"></div>
        <div
          class="fixed z-50 h-64 xl:h-72 top-[25%] md:top-[30%] right-[50%] left-[50%] w-[230px] md:w-[320px] xl:w-[400px] -ml-[105px] md:-ml-[150px] xl:-ml-[180px] rounded-xl bg-opacity-70 backdrop-blur-md bg-black inset-0 shadow-xl transition-all text-sm text-white"
        >
          <div class="flex items-end justify-end pt-1 pr-1">
            <Close
              @click="handleClose"
              fillColor="#ffffff"
              class="hover:scale-125 hover:font-bold hover:transition-all"
              :size="20"
            />
          </div>
          <div class="flex flex-wrap items-center justify-center">
            <div class="flex flex-wrap items-end justify-center w-full mb-1">
              <div
                class="w-20 h-20 md:w-[90px] md:h-[90px] xl:w-[100px] xl:h-[100px] rounded-full bg-[#FF8080]"
              >
                <h1
                  class="flex items-center justify-center h-full text-[40px] text-black font-bold hover:transform hover:-rotate-180 hover:scale-125 hover:transition hover:duration-300"
                >
                  {{ user ? user.name.charAt(0) : "R" }}
                </h1>
              </div>
            </div>

            <div class="flex items-center justify-center w-full mb-6">
              <h1 class="text-xl font-bold md:text-2xl">
                {{ user ? user.name : "Remedy" }}
              </h1>
            </div>

            <div
              class="grid grid-cols-3 gap-4 w-full px-3 text-slate-400 text-center"
            >
              <div>
                <p>Like</p>
                <h5 class="text-white font-semibold">{{ user.like }}</h5>
              </div>
              <div>
                <p>Music</p>
                <h5 class="text-white font-semibold">{{ user.totalMusic }}</h5>
              </div>
              <div>
                <p>UnLike</p>
                <h5 class="text-white font-semibold">{{ user.unlike }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import axios from "axios";
import Close from "vue-material-design-icons/Close.vue";
import AccountCircleOutline from "vue-material-design-icons/AccountCircleOutline.vue";

const open = ref(false);
const user = ref(null);

const getUser = async () => {
  try {
    const response = await axios.get("/user");
    user.value = response.data;
  } catch (error) {
    console.error("failed get user ", error);
  }
};

onMounted(getUser);

const emits = defineEmits(["close"]);

const handleClose = () => {
  open.value = false;
  emits("close");
};
</script>

<style lang="scss" scoped></style>
