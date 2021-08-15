const m = require('mithril');

var Hello = {
    view() {
        return m('h1', { class: 'test'}, 'Hello There!')
    }
}

m.mount(document.querySelector('#app'), Hello);
