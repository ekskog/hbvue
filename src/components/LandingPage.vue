<template>
  <div class="flex items-center justify-center min-h-screen p-5 box-border">
    <div class="w-[min(90vmin,800px)] aspect-square flex flex-col p-2 box-border">
      <h1 class="text-center text-3xl font-bold pt-2.5 pb-1.5 m-0">EKSKOG 365</h1>
      <div class="flex flex-1 flex-col sm:flex-row mb-auto">
        <div class="flex-1 flex flex-col justify-center items-center px-2 py-2.5 sm:py-0">
          <RandomPicture @pictureFetched="updateRandomImage" />
        </div>
        <div class="flex-1 flex flex-col justify-center items-center px-2 py-2.5 sm:py-0">
          <form @submit.prevent class="w-full">
            <div class="mb-4">
              <label for="month" class="block mb-1">Select Month:</label>
              <select v-model="selectedMonth" id="month" required class="w-full">
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="day" class="block mb-1">Enter Day (optional for month):</label>
              <input type="text" v-model="selectedDay" id="day" placeholder="Day" class="w-full"/>
            </div>
            <div class="mb-4">
              <label for="year" class="block mb-1">Select Year (From 2010):</label>
              <input type="number" v-model="selectedYear" id="year" placeholder="Enter Year" min="2010" :max="currentYear" class="w-full"/>
            </div>
            <div class="flex justify-between mt-4">
              <button class="btn-primary w-[48%] px-4 py-2.5 text-base border-none" @click="submitForm('month')">Show Month</button>
              <button class="btn-primary w-[48%] px-4 py-2.5 text-base border-none" @click="submitForm('dayAcrossYears')">Show Day Across Years</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RandomPicture from "@/components/RandomPicture";

export default {
  components: {
    RandomPicture,
  },
  data() {
    return {
      selectedMonth: "",
      selectedDay: "",
      selectedYear: "",
      currentYear: new Date().getFullYear(),
      months: [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
      ],
    };
  },
  methods: {
    updateRandomImage({ imageUrl, formattedDate }) {
      this.randomImageUrl = imageUrl;
      this.randomImageDate = formattedDate;
    },
    submitForm(viewType) {
      console.log("submitForm called with viewType:", viewType);
      console.log("Current form data:", {
        month: this.selectedMonth,
        day: this.selectedDay,
        year: this.selectedYear
      });

      if (this.validateInputs(viewType)) {
        console.log("Inputs validated successfully");
        if (viewType === 'month') {
          this.$emit("form-submitted", {
            type: 'month',
            month: this.selectedMonth,
            year: this.selectedYear,
          });
        } else {
          this.$emit("form-submitted", {
            type: 'dayAcrossYears',
            month: this.selectedMonth,
            day: this.selectedDay,
          });
        }
      } else {
        console.log("Input validation failed");
        
        if (viewType === 'month') {
          alert("Please enter valid month and year.");
        } else {
          alert("Please enter valid month and day.");
        }
      }
    },
    validateInputs(viewType) {
      const enteredMonth = parseInt(this.selectedMonth, 10);
      
      if (isNaN(enteredMonth) || enteredMonth < 1 || enteredMonth > 12) {
        return false;
      }

      if (viewType === 'month') {
        const enteredYear = parseInt(this.selectedYear, 10);
        return !isNaN(enteredYear) && enteredYear >= 2010 && enteredYear <= this.currentYear;
      } else if (viewType === 'dayAcrossYears') {
        const enteredDay = parseInt(this.selectedDay, 10);
        const daysInMonth = new Date(this.currentYear, enteredMonth, 0).getDate();
        
        return !isNaN(enteredDay) && enteredDay >= 1 && enteredDay <= daysInMonth;
      }

      return false;
    },
  },
};
</script>