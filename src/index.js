const Vue = require('vue');
const App = require('./components/App');

new Vue({
    el: '#app',
    render: render => render(App)
});

