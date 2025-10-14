// Adding overlay
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('search');


searchInput.addEventListener('focus', addOverlay);

searchInput.addEventListener('blur', removeOverlay);


function addOverlay(){
    overlay.classList.remove('hidden');
}

function removeOverlay(){
    overlay.classList.add('hidden');
}