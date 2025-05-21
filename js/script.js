let indexKonten = 0;
let sudahDiAkhir = false;
const semuaKonten = document.querySelectorAll('.konten');
const tombolNext = document.getElementById('next');

function tampilkanKonten(index) {
    semuaKonten.forEach((konten, i) => {
        konten.classList.toggle('active', i === index);
    });

    if (index === semuaKonten.length - 1) {
        tombolNext.innerHTML = 'Selesai';
    } else {
        tombolNext.innerHTML = 'Selanjutnya';
    }
}

function selanjutnya() {
    if (indexKonten < semuaKonten.length - 1) {
        indexKonten++;
        tampilkanKonten(indexKonten);
    } else {
        window.location.href = '../../materi.html';
    }
}

function sebelumnya() {
    if (indexKonten > 0) {
        indexKonten--;
        tampilkanKonten(indexKonten);
    } 
}