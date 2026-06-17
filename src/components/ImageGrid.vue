<template>
    <div class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between mb-5">
            <button class="btn-primary px-4 py-2.5 text-base border-none" @click="goHome">
                <i class="fas fa-home"></i>
            </button>
            <div class="flex flex-col items-center">
                <div class="text-2xl font-bold">
                    <span class="cursor-pointer px-2.5" @click="previous">&larr;</span>
                    {{ getMonthName(month) }} {{ year }}
                    <span class="cursor-pointer px-2.5" @click="next">&rarr;</span>
                </div>
                <div class="text-center mt-1 text-sm text-gray-600">Click on the thumbnails for a full-size image</div>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            <div v-if="isLoading" class="col-span-full text-center p-5 text-lg text-gray-600">Loading images...</div>
            <div v-else-if="imageUrls.length === 0" class="col-span-full text-center p-5 text-lg text-gray-600">No images available for this period.</div>
            <div v-else v-for="(image, index) in imageUrls" :key="index" class="photo-card hover:scale-105 transition-transform">
                <div class="aspect-square relative cursor-pointer" @click="openImageOverlay(index)">
                    <img class="absolute w-full h-full object-contain object-center bg-gray-50" :src="image.url" :alt="`Image for ${formatDate(image.day)}`">
                </div>
                <div class="p-2 text-center bg-gray-50 text-xs text-gray-700">{{ formatCardLabel(image.day) }}</div>
            </div>
        </div>
        <ImageOverlay :showOverlay="showOverlay" :selectedImage="selectedImage" :selectedDate="selectedDate"
            @close-overlay="closeOverlay" @prvImg="prvImg" @nxtImg="nxtImg" />
    </div>
</template>

<script>
import ImageOverlay from "@/components/ImageOverlay";

export default {
    props: {
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            imageUrls: [],
            showOverlay: false,
            selectedImage: "",
            selectedDate: "",
            selectedIndex: 0,
            isLoading: true,
        };
    },
    components: {
        ImageOverlay
    },
    mounted() {
        this.fetchImages();
    },
    watch: {
        month: 'fetchImages',
        year: 'fetchImages',
    },
    methods: {
        fetchImages() {
            this.isLoading = true;
            this.imageUrls = [];

            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate() - 1;

            const lastDay = new Date(this.year, this.month, 0).getDate();

            // this.startDay = (this.year === 2010 && this.month === 3) ? 11 : 1;
            this.startDay = 1;

            for (let day = this.startDay; day <= lastDay; day++) {
                const formattedDay = day < 10 ? `0${day}` : `${day}`;
                const formattedMonth = this.month < 10 ? `0${this.month}` : `${this.month}`;

                // Check if the date is in the future
                const isFutureDate =
                    this.year > currentYear ||
                    (this.year === currentYear && this.month > currentMonth) ||
                    (this.year === currentYear && this.month === currentMonth && day > currentDay);

                this.imageUrls.push({
                    url: isFutureDate ? null : `https://objects.ekskog.net/blotpix/${this.year}/${formattedMonth}/${formattedDay}.jpeg`,
                    day: day
                });
            }

            this.isLoading = false;
        },
        getMonthName(month) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthNames[month - 1] || '';
        },
        ordinal(day) {
            const suffixes = ["st", "nd", "rd", "th"];
            if (day >= 11 && day <= 13) return `${day}${suffixes[3]}`;
            switch (day % 10) {
                case 1: return `${day}${suffixes[0]}`;
                case 2: return `${day}${suffixes[1]}`;
                case 3: return `${day}${suffixes[2]}`;
                default: return `${day}${suffixes[3]}`;
            }
        },
        // Card label: weekday + day, e.g. "Monday 1st" (month/year already shown in the header)
        formatCardLabel(day) {
            if (!day || isNaN(day)) {
                console.error("Invalid day passed to formatCardLabel:", day);
                return "Invalid Date";
            }
            const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const weekday = weekdayNames[new Date(this.year, this.month - 1, day).getDay()];
            return `${weekday} ${this.ordinal(day)}`;
        },
        // Full date for the overlay caption, e.g. "May 1st, 2026"
        formatDate(day) {
            if (!day || isNaN(day)) {
                console.error("Invalid day passed to formatDate:", day);
                return "Invalid Date";
            }
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return `${monthNames[this.month - 1]} ${this.ordinal(day)}, ${this.year}`;
        },
        goHome() {
            this.$emit('home');
        },
        previous() {
            const previousMonth = this.month === 1 ? 12 : this.month - 1;
            const previousYear = this.month === 1 ? this.year - 1 : this.year;
            this.$emit('navigate', { month: previousMonth, year: previousYear });
        },
        next() {
            const nextMonth = this.month === 12 ? 1 : this.month + 1;
            const nextYear = this.month === 12 ? this.year + 1 : this.year;
            this.$emit('navigate', { month: nextMonth, year: nextYear });
        },
        openImageOverlay(index) {
            this.selectedIndex = index;
            this.selectedImage = this.imageUrls[index].url; // Change this line
            this.selectedDate = this.formatDate(this.imageUrls[index].day);
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
                this.selectedImage = this.imageUrls[this.selectedIndex].url;
                this.selectedDate = this.formatDate(this.imageUrls[this.selectedIndex].day);
            } else {
                alert("This is the first available image for this month.");
            }
        },

        nxtImg() {
            if (this.selectedIndex < this.imageUrls.length - 1) {
                this.selectedIndex++;
                this.selectedImage = this.imageUrls[this.selectedIndex].url;
                this.selectedDate = this.formatDate(this.imageUrls[this.selectedIndex].day);
            } else {
                alert("This is the last available image for this month.");
            }
        },
    },
};
</script>