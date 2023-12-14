import { applyPolyfills, defineCustomElements } from 'wc-discord-message/loader';

applyPolyfills().then(() => defineCustomElements(window));


function openPage(page) {
    window.location.href = page;
}

function openLink(link) {
    window.open(link, '_blank');
}