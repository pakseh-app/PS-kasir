const db = new Dexie("KasirKuDB");

db.version(1).stores({

    barang: "++id,nama,kategori,harga,stok",

    transaksi: "++id,tanggal,total,tunai,kembalian",

    detail: "++id,transaksiId,barangId",

    setting: "id"

});

export default db;
