const Vue = require('vue');
const App = require('./components/App');
const firebase = require('firebase');
const auth = require('firebase/auth');
const firebaseConfig = {
    apiKey: "AIzaSyCC11i7bTVT31PvPJWKovTl6BIRYO5Hi-M",
    authDomain: "server-fyre.firebaseapp.com",
    databaseURL: "https://server-fyre.firebaseio.com",
    projectId: "server-fyre",
    storageBucket: "server-fyre.appspot.com",
    messagingSenderId: "470237292808",
    appId: "1:470237292808:web:3b89778efd4b9bf89a64bd"
};

firebase.initializeApp(firebaseConfig);

new Vue({
    el: '#app',
    render: render => render(App)
});

