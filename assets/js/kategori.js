import db from "./db.js";

db.open().then(() => {
    console.log("Versi DB :", db.verno);
    console.log("Tables :", db.tables.map(t => t.name));
});

const namaKategori = document.getElementById("namaKategori");
const btnTambah = document.getElementById("btnTambah");
const kategoriTable = document.getElementById("kategoriTable");

async function loadKategori() {

    const data = await db.kategori.toArray();

    kategoriTable.innerHTML = "";

    if (data.length === 0) {

        kategoriTable.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">
                    Belum ada kategori.
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((item, index) => {

        kategoriTable.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>${item.nama}</td>

                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="hapusKategori(${item.id})">

                        🗑 Hapus

                    </button>

                </td>

            </tr>
        `;

    });

}

btnTambah.onclick = async () => {

    const nama = namaKategori.value.trim();

    if (!nama) {

        alert("Nama kategori masih kosong.");

        return;

    }

    await db.kategori.add({

        nama

    });

    namaKategori.value = "";

    loadKategori();

};

window.hapusKategori = async (id) => {

    if (!confirm("Hapus kategori ini?")) return;

    await db.kategori.delete(id);

    loadKategori();

};

loadKategori();
