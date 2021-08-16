const m = require('mithril');
const Home = require('./home');
const Dashboard = require('./dashboard');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./../private/firebaseConfig');

initializeApp(firebaseConfig);

m.route.prefix = '';
m.route(document.querySelector('#app'), '/', {
    '/': Home,
    '/dashboard': Dashboard
});
