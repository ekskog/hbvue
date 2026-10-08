<template>
    <header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div class="flex items-center justify-between gap-3 px-3 sm:px-6 lg:px-8 h-14 sm:h-16">
            <!-- hamburger + menu -->
            <div class="relative">
                <button
                    class="btn-primary w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-base sm:text-lg border-none"
                    @click="menuOpen = !menuOpen" aria-label="Menu" :aria-expanded="menuOpen">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- click-away backdrop -->
                <div v-if="menuOpen" class="fixed inset-0 z-10" @click="menuOpen = false" aria-hidden="true"></div>

                <transition enter-active-class="transition ease-out duration-150"
                    enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1">
                    <div v-if="menuOpen"
                        class="absolute left-0 top-full mt-2 z-20 w-48 bg-white rounded-xl shadow-xl border border-gray-200 p-2">
                        <button
                            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            @click="goHome">
                            <i class="fas fa-house w-4 text-center"></i> Home
                        </button>
                    </div>
                </transition>
            </div>

            <!-- date picker -->
            <label class="flex items-center gap-2 text-sm text-gray-500">
                <span class="hidden sm:inline">Go to date</span>
                <input type="date" v-model="date" :min="minDate" :max="maxDate" @change="onPick"
                    class="text-sm rounded-lg border-gray-300" />
            </label>
        </div>
    </header>
</template>

<script>
export default {
    name: "AppNavbar",
    emits: ["home", "navigate"],
    data() {
        return {
            menuOpen: false,
            date: "",
            minDate: "2010-03-11", // first image in the gallery
        };
    },
    computed: {
        // Gallery runs up to yesterday (today's image isn't uploaded yet).
        maxDate() {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            const pad = (n) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        },
    },
    methods: {
        goHome() {
            this.menuOpen = false;
            this.$emit("home");
        },
        onPick() {
            if (!this.date) return;
            const [year, month] = this.date.split("-").map(Number);
            this.$emit("navigate", { type: "month", month, year });
            this.menuOpen = false;
        },
    },
};
</script>
