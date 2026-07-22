const db = new Dexie("KasirKuDB");

// Versi lama
db.version(1).stores({

    barang: "++id,nama,kategori,harga,stok",

    transaksi: "++id,tanggal,total,tunai,kembalian",

    detail: "++id,transaksiId,barangId",

    setting: "id"

});

// Versi baru (menambah tabel kategori)
db.version(2).stores({

    barang: "++id,nama,kategori,harga,stok",

    kategori: "++id,nama",

    transaksi: "++id,tanggal,total,tunai,kembalian",

    detail: "++id,transaksiId,barangId",

    setting: "id"

});

export default db;
