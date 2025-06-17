import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0aleQtzBmRiFQEqEOw-aaGqmyEn6FBPI",
  authDomain: "db-pian.firebaseapp.com",
  databaseURL: "https://db-pian-default-rtdb.firebaseio.com",
  projectId: "db-pian",
  storageBucket: "db-pian.firebasestorage.app",
  messagingSenderId: "55150345932",
  appId: "1:55150345932:web:df580a35564871ac84cc69"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let jawabanBenar = {};

function tampilkanSoal(key) {
  const soalRef = ref(db, `soal/${key}`);

  onValue(soalRef, (snapshot) => {
    const data = snapshot.val();

    const kontainer = document.getElementById("kontainer-soal");
    const jumbotron = document.querySelector(".jumbotron");
    kontainer.innerHTML = "";

    if (!data) {
      alert("❌ Soal belum tersedia. Silakan buat soal di halaman admin.");
      return;
    }

    jumbotron.innerHTML = `<div class="container py-4"><h1 class="display-5">${data.materi || 'Quiz'}</h1></div>`;

    if (!data.soal || data.soal.length === 0) {
      kontainer.innerHTML = "<p>Soal tidak ditemukan.</p>";
      return;
    }

    jawabanBenar = {};

    const listSoal = Array.isArray(data.soal) ? data.soal : Object.values(data.soal);

    listSoal.forEach((soal, index) => {
      const namaRadio = `soal-${index}`;
      jawabanBenar[namaRadio] = soal.jawaban;
      let pilihanHTML = '';
      soal.pilihan.forEach((opsi, i) => {
        const id = `${namaRadio}-opsi-${i}`;
        pilihanHTML += `
          <label class="form-control mb-2" for="${id}">
            <input type="radio" name="${namaRadio}" id="${id}" value="${escapeHTML(opsi)}" aria-label="Jawaban ${escapeHTML(opsi)}">
            ${escapeHTML(opsi)}
          </label>
        `;
      });

      const divSoal = document.createElement("div");
      divSoal.className = "question-box mb-4";
      divSoal.innerHTML = `<h5 class="mb-3">${index + 1}. ${escapeHTML(soal.pertanyaan)}</h5>${pilihanHTML}`;

      kontainer.appendChild(divSoal);
    });
  }, {
    onlyOnce: true
  });
}

window.tampilkanSoal = tampilkanSoal;



function cekJawaban() {
  let total = 0;
  let benar = 0;
  let adaYangBelum = false;

  for (const nama in jawabanBenar) {
    total++;
    const dipilih = document.querySelector(`input[name="${nama}"]:checked`);
    if (!dipilih) {
      adaYangBelum = true;
    } else if (dipilih.value === jawabanBenar[nama]) {
      benar++;
    }
  }

  if (adaYangBelum) {
    const toastEl = document.getElementById('toastBelumDijawab');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    return; 
  }

  const nilai = (benar / total) * 100;

  if (nilai >= 80) {
    tampilkanModalHasil(`
      <div class="text-center p-4 rounded shadow">
        <i class="fa-solid fa-trophy fa-3x mb-3" style="color: #FFD43B;"></i>
        <h4 class="fw-bold text-success mb-2">Selamat!</h4>
        <p>Nilai kamu adalah <strong class="text-primary">${nilai.toFixed(2)}%</strong></p>
        <button type="button" class="btn btn-secondary" onclick="location.reload()">Ulangi</button>
        <a href="/materi.html" class="btn btn-success">Lanjut</a>
      </div>
    `, 'success');
  } else {
    tampilkanModalHasil(`
      <div class="text-center p-4 rounded shadow">
       <i class="fa-solid fa-face-sad-tear fa-3x mb-3" style="color: #ff0000;"></i>
        <h4 class="fw-bold text-success mb-2">Oo-www!</h4>
        <p>Nilai kamu adalah <strong class="text-primary">${nilai.toFixed(2)}%</strong></p>
        <button type="button" class="btn btn-secondary" onclick="location.reload()">Ulangi</button>
      </div>
    `);
  }

  resetJawaban();
}


function resetJawaban() {
  const semuaRadio = document.querySelectorAll('input[type="radio"]');
  semuaRadio.forEach(radio => {
    radio.checked = false;
  });
}

function tampilkanModalHasil(pesan, status) {
  const body = document.getElementById("modalHasilBody");
  body.innerHTML = `<div class="text-${status} fs-5">${pesan}</div>`;

  const modal = new bootstrap.Modal(document.getElementById("modalHasil"));
  modal.show();
}

// Supaya bisa pakai <>
document.getElementById("submitBtn").addEventListener("click", cekJawaban);

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

