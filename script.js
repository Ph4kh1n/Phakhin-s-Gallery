document.getElementById('debut').addEventListener('click', function() {
    window.location.href = "./เทสระบบ";
});

document.getElementById('shutter3k').addEventListener('click', function() {
    window.location.href = "./ชัตเตอร์ 3k";
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 100,
})

sr.reveal(`.main`, {interval: 100, delay:100})
