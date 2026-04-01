import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import DayAcrossYears from './components/DayAcrossYears.vue';
import '@fortawesome/fontawesome-free/css/all.css'

const routes = [
    { path: '/', name: 'Home', component: LandingPage },
    { path: '/landing', name: 'LandingPage', component: LandingPage },
    { path: '/day/:month/:day', name: 'DayAcrossYears', component: DayAcrossYears },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

async function bootstrap() {
  let config = {};
  try {
    const res = await fetch('/config.json');
    if (res.ok) config = await res.json();
  } catch (e) {
    console.warn('Could not load /config.json, using defaults');
  }

  const app = createApp(App);
  app.use(router);

  // expose config as $config in components
  app.config.globalProperties.$config = config;

  app.config.errorHandler = (err, vm, info) => {
    console.error('Global error:', err, info)
  }

  app.mount('#app');
}

bootstrap();