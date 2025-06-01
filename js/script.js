// JavaScript
let jawabanBenar = {}; // Menyimpan jawaban benar berdasarkan nama input radio

function tampilkanSoal(key) {
  fetch('/data/data_soal.json')
    .then(res => res.json())
    .then(data => {
      const kontainer = document.getElementById("kontainer-soal");
      kontainer.innerHTML = "";

      const soalList = data[key];
      if (!soalList) {
        kontainer.innerHTML = "<p>Soal tidak ditemukan.</p>";
        return;
      }

      soalList.forEach((soal, index) => {
        const namaRadio = `soal-${index}`;
        jawabanBenar[namaRadio] = soal.jawaban;

        const divSoal = document.createElement("div");
        divSoal.className = "question-box";

        divSoal.innerHTML = `
          <h5 class="mb-3">
            <span class="question-number badge bg-primary me-2">${index + 1}</span>
            ${soal.pertanyaan}
          </h5>
        `;

        const pilihanDiv = document.createElement("div");

        soal.pilihan.forEach((opsi, i) => {
          const id = `${namaRadio}-opsi-${i}`;
          const label = document.createElement("label");
          label.className = "form-control mb-2 d-flex align-items-center gap-2";
          label.setAttribute("for", id);

          label.innerHTML = `
            <input type="radio" name="${namaRadio}" id="${id}" value="${opsi}" class="form-check-input">
            <span>${opsi}</span>
          `;

          pilihanDiv.appendChild(label);
        });

        divSoal.appendChild(pilihanDiv);
        kontainer.appendChild(divSoal);
      });
    })
    .catch(err => {
      console.error("Gagal memuat soal:", err);
    });
}

function cekJawaban() {
  let total = 0;
  let benar = 0;

  for (const nama in jawabanBenar) {
    total++;
    const dipilih = document.querySelector(`input[name="${nama}"]:checked`);
    if (dipilih && dipilih.value === jawabanBenar[nama]) {
      benar++;
    }
  }

  const hasilDiv = document.getElementById("hasil");

  if (total === 0) {
    hasilDiv.innerHTML = `❌ Soal tidak ditemukan atau belum dijawab.`;
    hasilDiv.className = "text-danger mt-3 fw-bold";
    return;
  }

  const nilai = (benar / total) * 100;

  if (nilai >= 80) {
    hasilDiv.className = "text-success mt-3 fw-bold";
    hasilDiv.innerHTML = `🎉 Selamat! Nilai kamu <strong>${nilai.toFixed(2)}%</strong>.`;
  } else {
    hasilDiv.className = "text-danger mt-3 fw-bold";
    hasilDiv.innerHTML = `❌ Maaf, nilai kamu <strong>${nilai.toFixed(2)}%</strong>. Silakan coba lagi.`;
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

// Event listener
document.getElementById("submitBtn").addEventListener("click", cekJawaban);
