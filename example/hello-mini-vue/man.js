import { createApp } from '../../lib/guide-mini-vue.esm.js';
import { App } from './app.js';
const app = createApp(App);
console.log(app);
app.mount(document.querySelector('#app'));
