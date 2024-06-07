document.getElementById('debut').addEventListener('click', function() {
    window.location.href = "./เทสระบบ";
});

document.getElementById('shutter3k').addEventListener('click', function() {
    window.location.href = "./ชัตเตอร์ 3k";
});

document.getElementById('sleepy').addEventListener('click', function() {
    window.location.href = "./ง่วงนอน";
});

document.getElementById('nunid-day').addEventListener('click', function() {
    window.location.href = "./หนูนิด Day";
});

document.getElementById('s302-computer-hellyeah').addEventListener('click', function() {
    window.location.href = "./ห้องคอมเย็นเป็นเหตุทำกล้องรวน";
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 100,
})

sr.reveal(`.main`, {interval: 100, delay:100})
