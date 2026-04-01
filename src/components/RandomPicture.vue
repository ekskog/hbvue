<template>
  <div class=" mt-4">
    <div v-if="imageUrl" class="card">
      <img :src="imageUrl" alt="Random Picture" class="card-img-top" />
      <div class="card-body">
        <p class="card-text">{{ formattedDate }}</p>
      </div>
    </div>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: null,
      formattedDate: null,
      error: null,
      intervalId: null,
    };
  },
  mounted() {
    this.getRandomPicture();

    // Use setInterval to fetch a new picture every 30 seconds
    this.intervalId = setInterval(() => {
      this.getRandomPicture();
    }, 10000); // 10 seconds in milliseconds
  },
  beforeUnmount() {
    // Clear the interval when the component is about to be unmounted
    clearInterval(this.intervalId);
  },
  methods: {
    async getRandomPicture() {
      try {
        const startDate = new Date(2017, 0, 1);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        this.formattedDate = this.formatDate(randomDate);

        this.imageUrl = `https://objects.ekskog.net/blotpix/${randomDate.getFullYear()}/${String(randomDate.getMonth() + 1).padStart(2, '0')}/${String(randomDate.getDate()).padStart(2, '0')}.jpeg`;

        // Emit an event to inform the parent (App.vue) about the new picture
        this.$emit('pictureFetched', {
          imageUrl: this.imageUrl,
          formattedDate: this.formattedDate,
        });
      } catch (error) {
        console.error('Error fetching random picture:', error);
        this.error = 'Error fetching random picture. Please try again later.';
      }
    },
    formatDate(date) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const day = date.getDate();
      const suffix = this.getDaySuffix(day);
      const formattedDate = `${monthNames[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
      return formattedDate;
    },
    getDaySuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
  },
};
</script>

<style scoped>

* {
    box-sizing: border-box;
}

.card {
    width: 300px;
    border: 1px solid #000;
    border-radius: 8px;
    overflow: hidden;
    font-family: Verdana, sans-serif;
}

.card-img-top {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.card-body {
    padding: 15px;
    text-align: center;
}

.card-text {
    margin: 0;
    font-size: 20px;
}
</style>
