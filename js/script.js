let jawabanBenar = {}; // untuk simpan jawaban benar dari JSON nanti

function tampilkanSoal(key) {
  fetch('/data/data_soal.json')
    .then(res => res.json())
    .then(data => {
      const soal = data[key];
      if (!soal) {
        console.error("Key soal tidak ditemukan:", key);
        return;
      }

      const kontainer = document.getElementById("kontainer-soal");
      kontainer.innerHTML = "";

      jawabanBenar = {};  // reset jawaban benar

      soal.forEach((item, index) => {
        jawabanBenar[`soal-${index}`] = item.jawaban; // sesuaikan dengan JSON

        const div = document.createElement("div");
        div.className = "soal";

        const pertanyaan = document.createElement("p");
        pertanyaan.innerHTML = `${index + 1}. ${item.pertanyaan}`;
        div.appendChild(pertanyaan);

        const pilihanDiv = document.createElement("div");
        pilihanDiv.className = "pilihan";

        item.pilihan.forEach((opsi, i) => {
          const id = `soal-${index}-opsi-${i}`;
          const input = document.createElement("input");
          input.type = "radio";
          input.name = `soal-${index}`;
          input.id = id;
          input.value = opsi;

          const label = document.createElement("label");
          label.htmlFor = id;
          label.innerHTML = opsi;

          pilihanDiv.appendChild(input);
          pilihanDiv.appendChild(label);
          pilihanDiv.appendChild(document.createElement("br"));
        });

        div.appendChild(pilihanDiv);
        kontainer.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error fetching soal:", err);
    });
}

// Fungsi cek jawaban dan hitung nilai
function cekJawaban() {
  let totalSoal = Object.keys(jawabanBenar).length;
  let benar = 0;

  for (let key in jawabanBenar) {
    const pilihan = document.querySelector(`input[name="${key}"]:checked`);
    if (pilihan && pilihan.value === jawabanBenar[key]) {
      benar++;
    }
  }

  const nilai = (benar / totalSoal) * 100;
  const hasilDiv = document.getElementById("hasil");

  if (!hasilDiv) {
    alert("Elemen hasil tidak ditemukan di HTML!");
    return;
  }

  if (nilai >= 80) {
    hasilDiv.innerHTML = `Selamat! Nilai kamu ${nilai.toFixed(2)}%. Kamu mendapatkan reward 🎉`;
  } else {
    hasilDiv.innerHTML = `Maaf, nilai kamu ${nilai.toFixed(2)}%. Kamu gagal dan bisa coba lagi.`;
  }
}

const btnSubmit = document.getElementById("submitBtn");
if (btnSubmit) {
  btnSubmit.addEventListener("click", cekJawaban);
} else {
  console.warn("Tombol submitBtn tidak ditemukan");
}
tampilkanSoal('html1');
