import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

createApp(App)
  .use(createPinia())
  .mount('#app');

/*
-нужно просчитывать связи между ящиками не последовательно а деревом, начиная от первого изначального ящика
-сейчас нет возможности перелома оптики, которая входит в дом (на случай, когда она по разным этажам должна проходить)
*/
