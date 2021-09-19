import m from 'mithril';
import Home from './home';
import Dashboard from './dashboard';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import firebaseConfig from './../private/firebaseConfig';

const app = initializeApp(firebaseConfig);

connectAuthEmulator(getAuth(app), 'http://localhost:9099');
connectFunctionsEmulator(getFunctions(app), 'localhost', 5001);

console.log(getFunctions(app));

m.route.prefix = '';
m.route(document.querySelector('#app'), '/', {
    '/': Home,
    '/dashboard': Dashboard
});
