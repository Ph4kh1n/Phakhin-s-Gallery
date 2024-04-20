document.getElementById('cat').addEventListener('click', function() {
    window.location.href = "./รูปแมว";
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 100,
})

sr.reveal(`.main`, {interval: 100, delay:100})
