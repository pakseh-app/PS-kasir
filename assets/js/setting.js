import db from "./db.js";

// =====================================
// ELEMENT
// =====================================

const namaToko = document.getElementById("namaToko");
const alamat = document.getElementById("alamat");
const telepon = document.getElementById("telepon");
const footer = document.getElementById("footer");

const showAlamat = document.getElementById("showAlamat");
const showTelepon = document.getElementById("showTelepon");
const showTanggal = document.getElementById("showTanggal");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const hapusDataBtn = document.getElementById("hapusDataBtn");

// =====================================
// PREVIEW
// =====================================

const previewNama = document.getElementById("previewNama");
const previewAlamat = document.getElementById("previewAlamat");
const previewTelepon = document.getElementById("previewTelepon");
const previewFooter = document.getElementById("previewFooter");

// =====================================
// DEFAULT SETTING
// =====================================

const defaultSetting = {

    id:1,

    namaToko:"Pakseh",

    alamat:"Alamat Toko",

    telepon:"085156028912",

    footer:`========================

Terima kasih
telah berbelanja

Yang mau dibuatin
Aplikasi Kasir

WA
085156028912

Powered by Pakseh

========================`,

    showAlamat:true,

    showTelepon:true,

    showTanggal:true

};

// =====================================
// UPDATE PREVIEW
// =====================================

function updatePreview(){

    previewNama.textContent =
        namaToko.value.trim() || defaultSetting.namaToko;

    previewAlamat.textContent =
        alamat.value.trim() || defaultSetting.alamat;

    previewTelepon.textContent =
        telepon.value.trim() || defaultSetting.telepon;

    previewFooter.textContent =
        footer.value || defaultSetting.footer;

}

// =====================================
// LOAD SETTING
// =====================================

async function loadSetting(){

    let setting = await db.setting.get(1);

    if(!setting){

        await db.setting.put(defaultSetting);

        setting = defaultSetting;

    }

    namaToko.value =
        setting.namaToko || defaultSetting.namaToko;

    alamat.value =
        setting.alamat || defaultSetting.alamat;

    telepon.value =
        setting.telepon || defaultSetting.telepon;

    footer.value =
        setting.footer || defaultSetting.footer;

    showAlamat.checked =
        setting.showAlamat ?? defaultSetting.showAlamat;

    showTelepon.checked =
        setting.showTelepon ?? defaultSetting.showTelepon;

    showTanggal.checked =
        setting.showTanggal ?? defaultSetting.showTanggal;

    updatePreview();

}

// =====================================
// SIMPAN PENGATURAN
// =====================================

saveBtn.addEventListener("click", async()=>{

    const setting = {

        id:1,

        namaToko:
            namaToko.value.trim() || defaultSetting.namaToko,

        alamat:
            alamat.value.trim() || defaultSetting.alamat,

        telepon:
            telepon.value.trim() || defaultSetting.telepon,

        footer:
            footer.value.trim() || defaultSetting.footer,

        showAlamat:
            showAlamat.checked,

        showTelepon:
            showTelepon.checked,

        showTanggal:
            showTanggal.checked

    };

    await db.setting.put(setting);

    updatePreview();

    alert("Pengaturan berhasil disimpan.");

});

// =====================================
// RESET PENGATURAN
// =====================================

resetBtn.addEventListener("click", async()=>{

    const yakin = confirm(
        "Reset semua pengaturan ke bawaan?"
    );

    if(!yakin) return;

    // Hapus setting lama
    await db.setting.clear();

    // Simpan default
    await db.setting.put(defaultSetting);

    // Muat ulang
    await loadSetting();

    alert("Pengaturan berhasil direset.");

});

// =====================================
// HAPUS SEMUA DATA
// =====================================

hapusDataBtn.addEventListener("click", async()=>{

    const yakin = confirm(
`Semua data berikut akan dihapus :

• Barang
• Kategori
• Transaksi
• Detail Transaksi

Data tidak dapat dikembalikan.

Lanjutkan?`);

    if(!yakin) return;

    await db.barang.clear();

    if(db.kategori){
        await db.kategori.clear();
    }

    await db.transaksi.clear();

    await db.detail.clear();

    alert("Semua data berhasil dihapus.");

});

// =====================================
// LIVE PREVIEW
// =====================================

namaToko.addEventListener("input", updatePreview);

alamat.addEventListener("input", updatePreview);

telepon.addEventListener("input", updatePreview);

footer.addEventListener("input", updatePreview);

// =====================================
// START
// =====================================

loadSetting();
