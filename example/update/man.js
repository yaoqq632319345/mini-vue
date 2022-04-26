import { createApp } from '../../lib/guide-mini-vue.esm.js';
import { App } from './app.js';
const app = createApp(App);
app.mount(document.querySelector('#app'));
