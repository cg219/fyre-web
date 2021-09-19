import m from 'mithril';
import Login from './components/login';

export default {
    view() {
        return m('div.home', m(Login))
    }
}
