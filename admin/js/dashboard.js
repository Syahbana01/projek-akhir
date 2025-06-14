import { database, ref, set, get, update, remove, onValue, push } from './firebase.js';

const selectKategori = document.getElementById('selectKategori');
const judulKategoriEl = document.getElementById('judulKategori');
const formSoalContainer = document.getElementById('formSoalContainer');
const listSoal = document.getElementById('listSoal');
const inputPertanyaan = document.getElementById('inputPertanyaan');
const inputPilihan = document.getElementById('inputPilihan');
const inputJawaban = document.getElementById('inputJawaban');
const btnTambahSoal = document.getElementById('btnTambahSoal');
const btnEditJudulKategori = document.getElementById('btnEditJudulKategori');

let currentKategoriKey = null;
let currentSoalData = {};

// Load semua kategori soal dari database
function loadKategori() {
    get(ref(database, 'soal')).then(snapshot => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        selectKategori.innerHTML = '<option value="">-- Pilih kategori soal --</option>';
        for (const key in data) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data[key].materi || key;
        selectKategori.appendChild(option);
        }
    } else {
        selectKategori.innerHTML = '<option value="">Tidak ada kategori soal</option>';
    }
    });
}

loadKategori();


// Saat pilih kategori
selectKategori.addEventListener('change', () => {
    const key = selectKategori.value;
    if (!key) {
    formSoalContainer.style.display = 'none';
    return;
    }
    currentKategoriKey = key;
    get(ref(database, 'soal/' + key)).then(snapshot => {
        const kategori = snapshot.val();
        judulKategoriEl.textContent = `Judul: ${kategori.materi || ''}`;
    });

    formSoalContainer.style.display = 'block';
    loadSoal(key);
});

// Load soal dari kategori tertentu
function loadSoal(kategoriKey) {
    get(ref(database, 'soal/' + kategoriKey + '/soal')).then(snapshot => {
    listSoal.innerHTML = '';
    if (snapshot.exists()) {
        currentSoalData = snapshot.val();
        for (const soalKey in currentSoalData) {
        const soal = currentSoalData[soalKey];
        const div = document.createElement('div');
        div.className = 'soal-box';
        div.innerHTML = `
            <p><strong>Soal:</strong> ${escapeHTML(soal.pertanyaan)}</p>
            <p><strong>Pilihan:</strong> ${soal.pilihan.map(escapeHTML).join(', ')}</p>
            <p><strong>Jawaban benar:</strong> ${escapeHTML(soal.jawaban)}</p>
            <button data-key="${soalKey}" class="btn-hapus"><i class="fa-solid fa-trash"></i></button>
            <button data-key="${soalKey}" class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
        `;
        listSoal.appendChild(div);
        }
        document.querySelectorAll('.btn-hapus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const soalKey = e.target.getAttribute('data-key');
            if (confirm('Yakin ingin menghapus soal ini?')) {
            remove(ref(database, `soal/${kategoriKey}/soal/${soalKey}`))
                .then(() => {
                alert('Soal berhasil dihapus');
                loadSoal(kategoriKey);
                }).catch(err => alert('Gagal hapus soal: ' + err.message));
            }
        });
        });
    } else {
        listSoal.innerHTML = '<label>Belum ada soal di kategori ini.</label>';
        currentSoalData = {};
    }
    });
}

// Tambah soal baru
btnTambahSoal.addEventListener('click', () => {
  if (!currentKategoriKey) {
    alert('Pilih kategori soal dulu');
    return;
  }

  const pertanyaan = inputPertanyaan.value.trim();
  const pilihanRaw = inputPilihan.value.trim();
  const jawaban = inputJawaban.value.trim();

  if (!pertanyaan || !pilihanRaw || !jawaban) {
    alert('Isi semua input soal');
    return;
  }

  const pilihan = pilihanRaw.split(',').map(s => s.trim());

  if (!pilihan.includes(jawaban)) {
    alert('Jawaban benar harus salah satu dari pilihan');
    return;
  }

  const editingKey = btnTambahSoal.dataset.editingKey;

  if (editingKey) {
    // Mode edit
    update(ref(database, `soal/${currentKategoriKey}/soal/${editingKey}`), {
      pertanyaan,
      pilihan,
      jawaban
    }).then(() => {
      alert('Soal berhasil diperbarui');
      btnTambahSoal.textContent = 'Tambah Soal';
      delete btnTambahSoal.dataset.editingKey;
      inputPertanyaan.value = '';
      inputPilihan.value = '';
      inputJawaban.value = '';
      loadSoal(currentKategoriKey);
    }).catch(err => alert('Gagal update soal: ' + err.message));
  } else {
    // Mode tambah
    const newSoalRef = push(ref(database, `soal/${currentKategoriKey}/soal`));
    set(newSoalRef, { pertanyaan, pilihan, jawaban })
    .then(() => {
      alert('Soal berhasil ditambahkan');
      inputPertanyaan.value = '';
      inputPilihan.value = '';
      inputJawaban.value = '';
      loadSoal(currentKategoriKey);
    }).catch(err => alert('Gagal tambah soal: ' + err.message));
  }
});


//edit soal
listSoal.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-edit')) {
    const soalKey = e.target.getAttribute('data-key');
    const soal = currentSoalData[soalKey];
    inputPertanyaan.value = soal.pertanyaan;
    inputPilihan.value = soal.pilihan.join(', ');
    inputJawaban.value = soal.jawaban;
    btnTambahSoal.textContent = 'Simpan Perubahan';
    btnTambahSoal.dataset.editingKey = soalKey;
  }
});


//edit judul
btnEditJudulKategori.addEventListener('click', () => {
  if (!currentKategoriKey) {
    alert('Pilih kategori terlebih dahulu');
    return;
  }

  // Ambil judul lama
  const judulLama = judulKategoriEl.textContent.replace('Judul: ', '');
  const newMateri = prompt('Edit Judul Materi:', judulLama);

  if (!newMateri) {
    alert('Judul materi tidak boleh kosong');
    return;
  }

  // Update hanya bagian materi (tanpa mengubah key)
  update(ref(database, `soal/${currentKategoriKey}`), {
    materi: newMateri
  }).then(() => {
    alert('Judul materi berhasil diperbarui');
    loadKategori();
    judulKategoriEl.textContent = `Judul: ${newMateri}`;
  }).catch(err => alert('Gagal update judul materi: ' + err.message));
});

function escapeHTML(text) {
    return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
