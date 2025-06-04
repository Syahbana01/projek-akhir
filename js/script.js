let jawabanBenar = {};

function tampilkanSoal(key) {
  fetch('/data/data_soal.json')
    .then(res => res.json())
    .then(data => {
      const kontainer = document.getElementById("kontainer-soal");
      const jumbotron = document.querySelector(".jumbotron");
      kontainer.innerHTML = "";

      const bagian = data[key];
      if (!bagian || !bagian.soal || bagian.soal.length === 0) {
        kontainer.innerHTML = "<p>Soal tidak ditemukan.</p>";
        return;
      }

      // Tampilkan judul di jumbotron
      jumbotron.innerHTML = `<div class="container py-4"><h1 class="display-5">${bagian.judul}</h1></div>`;

      const soalList = bagian.soal;

      for (let index = 0; index < soalList.length; index++) {
        const soal = soalList[index];
        const namaRadio = `soal-${index}`;
        jawabanBenar[namaRadio] = soal.jawaban;

        const divSoal = document.createElement("div");
        divSoal.className = "question-box mb-4";

        divSoal.innerHTML = `
          <h5 class="mb-3">
            <span class="question-number">${index + 1}</span>
            ${soal.pertanyaan}
          </h5>
        `;

        const pilihanDiv = document.createElement("div");

        for (let i = 0; i < soal.pilihan.length; i++) {
          const opsi = soal.pilihan[i];
          const id = `${namaRadio}-opsi-${i}`;
          const label = document.createElement("label");
          label.className = "form-control mb-2";
          label.setAttribute("for", id);

          label.innerHTML = `
            <input type="radio" name="${namaRadio}" id="${id}" value="${opsi}">
            <span>${opsi}</span>
          `;

          pilihanDiv.appendChild(label);
        }

        divSoal.appendChild(pilihanDiv);
        kontainer.appendChild(divSoal);
      }
    })
    .catch(err => {
      console.error("Gagal memuat soal:", err);
    });
}

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
    return; // Stop penilaian kalau belum dijawab semua
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
  Object.keys(jawabanBenar).forEach(nama => {
    const radios = document.querySelectorAll(`input[name="${nama}"]`);
    radios.forEach(radio => {
      radio.checked = false;
    });
  });
}

function tampilkanModalHasil(pesan, status) {
  const body = document.getElementById("modalHasilBody");
  body.innerHTML = `<div class="text-${status} fs-5">${pesan}</div>`;

  const modal = new bootstrap.Modal(document.getElementById("modalHasil"));
  modal.show();
}

// Event listener
document.getElementById("submitBtn").addEventListener("click", cekJawaban);
