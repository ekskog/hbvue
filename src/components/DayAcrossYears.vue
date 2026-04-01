<template>
    <div class="day-across-years">
        <div class="header">
            <button class="back-button" @click="goHome">
                <i class="fas fa-home"></i>
            </button>
            <div class="header-content">
                <div class="day-month">
                    <span class="arrow" @click="previousDay">&larr;</span>
                    {{ day }} {{ getMonthName(month) }}
                    <span class="arrow" @click="nextDay">&rarr;</span>
                </div>
                <div class="click-message">Click on the thumbnails for a full-size image</div>
            </div>
        </div>
        <div class="image-grid">
            <div v-for="(image, index) in images" :key="index" class="image-card">
                <div class="image-thumbnail" @click="openImageOverlay(index)">
                    <img :src="image.url" :alt="`Image for ${image.year}`">
                </div>
                <div class="image-footer">{{ image.year }}</div>
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
    methods: {
        getMonthName(monthNumber) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            return monthNames[monthNumber - 1];
        },
        goHome() {
            this.$emit('home');
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
            const currentYear = new Date().getFullYear();
            const startYear = 2010;

            this.images = [];
            for (let year = startYear; year <= currentYear; year++) {
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



<style scoped>
.day-across-years {
    padding: 20px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}


.back-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
}

.arrow {
    cursor: pointer;
    padding: 0 10px;
}

.day-month {
    font-size: 24px;
    font-weight: bold;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.image-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-thumbnail {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
    cursor: pointer;
}

.image-thumbnail img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background-color: #f8f8f8;
}

.click-message {
    text-align: center;
    margin-top: 5px;
    font-size: 14px;
    color: #555;
}

.image-footer {
    padding: 10px;
    text-align: center;
    background-color: #f8f8f8;
    font-size: 14px;
}
</style>