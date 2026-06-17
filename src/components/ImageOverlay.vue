<template>
  <div class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50" v-if="showOverlay" @click.self="closeImageOverlay">
    <button
      class="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full text-white text-2xl bg-white/10 hover:bg-white/25 transition-colors"
      aria-label="Close"
      @click="closeImageOverlay"
    >
      <i class="fas fa-xmark"></i>
    </button>

    <button
      class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white text-xl bg-white/10 hover:bg-white/25 transition-colors"
      aria-label="Previous image"
      @click="prvImg"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <button
      class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white text-xl bg-white/10 hover:bg-white/25 transition-colors"
      aria-label="Next image"
      @click="nxtImg"
    >
      <i class="fas fa-chevron-right"></i>
    </button>

    <div class="bg-white rounded-lg overflow-hidden shadow-lg max-w-[90%] max-h-[90%] flex flex-col">
      <img class="max-w-full max-h-[calc(90vh-60px)] object-contain" :src="selectedImage" alt="Full Image" />
      <div class="p-4 text-center bg-gray-50 text-base text-gray-700">{{ selectedDate }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showOverlay: {
      type: Boolean,
      required: true,
      selectedImage: String,
      selectedDate: String,
    },
    selectedImage: {
      type: String,
      required: true,
    },
    selectedDate: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeImageOverlay() {
      this.$emit("close-overlay");
    },
    prvImg() {
      this.$emit("prvImg");
    },
    nxtImg() {
      this.$emit("nxtImg");
    },
    handleEscapeKey(event) {
      if (event.key === "Escape") this.$emit("close-overlay");
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleEscapeKey);
    console.log("ImageOverlay mounted with date:", this.selectedDate);
  },
  unmounted() {
    document.removeEventListener("keydown", this.handleEscapeKey);
  },
};
</script>