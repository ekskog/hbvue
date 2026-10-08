<template>
    <div class="px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div class="flex items-center justify-center mb-5 sm:mb-6">
            <div class="flex items-center gap-0.5 sm:gap-3">
                <button
                    class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    @click="previousDay" aria-label="Previous day">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h2 class="text-lg sm:text-2xl font-bold tracking-tight tabular-nums min-w-[6rem] sm:min-w-[7.5rem] text-center select-none">
                    {{ day }} {{ getMonthName(month) }}
                </h2>
                <button
                    class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    @click="nextDay" aria-label="Next day">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 sm:gap-5 mt-5">
            <div v-for="(image, index) in images" :key="index" class="photo-card">
                <div class="aspect-square relative cursor-pointer group" @click="openImageOverlay(index)">
                    <img class="absolute w-full h-full object-contain object-center bg-gray-50" :src="image.url" :alt="`Image for ${image.year}`">
                    <!-- non-intrusive hover affordance: a faint veil + zoom icon, invisible at rest -->
                    <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors duration-200" :title="`View ${image.year} full size`">
                        <i class="fas fa-magnifying-glass-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md"></i>
                    </div>
                </div>
                <div class="p-2.5 text-center bg-gray-50 text-sm">{{ image.year }}</div>
            </div>
        </div>
        <ImageOverlay :showOverlay="showOverlay" :selectedImage="selectedImage" :selectedDate="selectedDate"
            @close-overlay="closeOverlay" @prvImg="prvImg" @nxtImg="nxtImg" />
    </div>
</template>

<script>
import ImageOverlay from "@/components/ImageOverlay";

export default {
    name: 'DayAcrossYears',
    emits: ["navigate"],
    components: {
        ImageOverlay
    },
    props: {
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            images: [],
            showOverlay: false,
            selectedImage: "",
            selectedDate: "",
            selectedIndex: 0,
        };
    },
    watch: {
        month: 'fetchImages',
        day: 'fetchImages',
    },
    methods: {
        getMonthName(monthNumber) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            return monthNames[monthNumber - 1];
        },
        previousDay() {
            let newDay = this.day - 1;
            let newMonth = this.month;
            if (newDay < 1) {
                newMonth = newMonth - 1;
                if (newMonth < 1) newMonth = 12;
                newDay = new Date(new Date().getFullYear(), newMonth, 0).getDate();
            }
            this.$emit('navigate', { day: newDay, month: newMonth });
        },
        nextDay() {
            let newDay = this.day + 1;
            let newMonth = this.month;
            const daysInMonth = new Date(new Date().getFullYear(), this.month, 0).getDate();
            if (newDay > daysInMonth) {
                newDay = 1;
                newMonth = newMonth + 1;
                if (newMonth > 12) newMonth = 1;
            }
            this.$emit('navigate', { day: newDay, month: newMonth });
        },
        fetchImages() {
            // The gallery only spans 11 Mar 2010 (its first image) up to yesterday
            // (today's image isn't uploaded yet). Skip this day's instances that
            // fall outside that range; missing images within it still render.
            const galleryStart = new Date(2010, 2, 11);
            galleryStart.setHours(0, 0, 0, 0);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 1);
            cutoff.setHours(0, 0, 0, 0);

            const startYear = 2010;
            const endYear = new Date().getFullYear();

            this.images = [];
            for (let year = startYear; year <= endYear; year++) {
                const date = new Date(year, this.month - 1, this.day);
                date.setHours(0, 0, 0, 0);
                if (date < galleryStart || date > cutoff) {
                    continue;
                }

                const formattedMonth = this.month.toString().padStart(2, '0');
                const formattedDay = this.day.toString().padStart(2, '0');
                const imageUrl = `https://objects.ekskog.net/blotpix/${year}/${formattedMonth}/${formattedDay}.jpeg`;
                this.images.push({ url: imageUrl, year: year });
            }
        },
        openImageOverlay(index) {
            this.selectedIndex = index;
            this.selectedImage = this.images[index].url;
            this.selectedDate = `${this.day} ${this.getMonthName(this.month)} ${this.images[index].year}`;
            this.showOverlay = true;
        },
        closeOverlay() {
            this.showOverlay = false;
            this.selectedImage = "";
            this.selectedDate = "";
            this.selectedIndex = 0;
        },
        prvImg() {
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
                this.selectedImage = this.images[this.selectedIndex].url;
                this.selectedDate = `${this.day} ${this.getMonthName(this.month)} ${this.images[this.selectedIndex].year}`;
            }
        },
        nxtImg() {
            if (this.selectedIndex < this.images.length - 1) {
                this.selectedIndex++;
                this.selectedImage = this.images[this.selectedIndex].url;
                this.selectedDate = `${this.day} ${this.getMonthName(this.month)} ${this.images[this.selectedIndex].year}`;
            }
        },
    },
    mounted() {
        console.log('Fetching images for Month:', this.month, 'and Day:', this.day);
        this.fetchImages();
    },
};
</script>