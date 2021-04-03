import Vue from 'vue'
import App from './App.vue'
import dateFilter from './assets/datefilter'
import numFilter from './assets/numberfilter'
import VueHtmlToPaper from 'vue-html-to-paper';
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    
  ],
  styles: [
    '../style1.css'
  ]
}
Vue.use(VueHtmlToPaper, options);
Vue.filter('date',dateFilter)
Vue.filter('num',numFilter)
new Vue({
  el: '#app',
  render: h => h(App)
})
