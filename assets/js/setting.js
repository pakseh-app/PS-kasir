import db from "./db.js";

// ===============================
// ELEMENT
// ===============================

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

// Preview
const previewNama = document.getElementById("previewNama");
const previewAlamat = document.getElementById("previewAlamat");
const previewTelepon = document.getElementById("previewTelepon");
const previewFooter = document.getElementById("previewFooter");

// ===============================
// DEFAULT SETTING
// ===============================

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

// ===============================
// PREVIEW
// ===============================

function updatePreview() {

    previewNama.innerText =
        namaToko.value || defaultSetting.namaToko;

    previewAlamat.innerText =
        alamat.value || defaultSetting.alamat;

    previewTelepon.innerText =
        telepon.value || defaultSetting.telepon;

    previewFooter.innerText =
        footer.value || defaultSetting.footer;

}

// ===============================
// LOAD
// ===============================

async function loadSetting() {

    let setting = await db.setting.get(1);

    if (!setting) {

        await db.setting.put(defaultSetting);

        setting = defaultSetting;

    }

    namaToko.value = setting.namaToko;
    alamat.value = setting.alamat;
    telepon.value = setting.telepon;
    footer.value =
    setting.footer || defaultSetting.footer;

    showAlamat.checked = setting.showAlamat;
    showTelepon.checked = setting.showTelepon;
    showTanggal.checked = setting.showTanggal;

    updatePreview();

}

// ===============================
// SAVE
// ===============================

saveBtn.addEventListener("click", async () => {

    await db.setting.put({

        id:1,

        namaToko:namaToko.value,

        alamat:alamat.value,

        telepon:telepon.value,

        footer:footer.value.trim(),

        showAlamat:showAlamat.checked,

        showTelepon:showTelepon.checked,

        showTanggal:showTanggal.checked

    });

    alert("Pengaturan berhasil disimpan.");

});

// ===============================
// RESET
// ===============================

resetBtn.addEventListener("click", async()=>{

    if(!confirm("Reset ke pengaturan bawaan?")) return;

    await db.setting.put(defaultSetting);

    loadSetting();

});

// ===============================
// HAPUS DATABASE
// ===============================

hapusDataBtn.addEventListener("click",async()=>{

    const yakin=confirm(
        "Semua barang, transaksi dan laporan akan dihapus.\n\nLanjutkan?"
    );

    if(!yakin) return;

    await db.barang.clear();
    await db.transaksi.clear();
    await db.detail.clear();

    alert("Semua data berhasil dihapus.");

});

// ===============================
// LIVE PREVIEW
// ===============================

namaToko.addEventListener("input",updatePreview);
alamat.addEventListener("input",updatePreview);
telepon.addEventListener("input",updatePreview);
footer.addEventListener("input",updatePreview);

// ===============================

loadSetting();
