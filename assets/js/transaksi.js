import db from "./db.js";

// =====================================
// ELEMENT
// =====================================

const daftarBarang = document.getElementById("daftarBarang");
const keranjangDiv = document.getElementById("keranjang");

const totalBelanja = document.getElementById("totalBelanja");
const bayar = document.getElementById("bayar");
const kembalian = document.getElementById("kembalian");

const previewBtn = document.getElementById("previewBtn");
const jumlahItem = document.getElementById("jumlahItem");

// =====================================
// DATA
// =====================================

let keranjang = [];

// =====================================
// FORMAT RUPIAH
// =====================================

function rupiah(nilai){

    return "Rp " + Number(nilai).toLocaleString("id-ID");

}

// =====================================
// LOAD BARANG
// =====================================

async function loadBarang(){

    const barang = await db.barang.toArray();

    daftarBarang.innerHTML = "";

    if(barang.length === 0){

        daftarBarang.innerHTML = `

        <div class="alert alert-warning w-100">

            Belum ada data barang.

        </div>

        `;

        return;

    }

    barang.forEach(item=>{

        daftarBarang.innerHTML += `

        <div class="produk-card">

            <img
                class="produk-img"
                src="../assets/img/no-image.png"
                alt="${item.nama}">

            <div class="produk-body">

                <div class="produk-nama">

                    ${item.nama}

                </div>

                <div class="produk-harga">

                    ${rupiah(item.harga)}

                </div>

                <div class="produk-stok">

                    Stok : ${item.stok}

                </div>

                <button
                    class="btn btn-success btn-tambah"
                    onclick="tambahKeranjang(${item.id})"
                    ${item.stok <= 0 ? "disabled" : ""}>

                    ${item.stok <= 0 ? "Stok Habis" : "+ Tambah"}

                </button>

            </div>

        </div>

        `;

    });

}

// =====================================
// TAMBAH KE KERANJANG
// =====================================

window.tambahKeranjang = async(id)=>{

    const barang = await db.barang.get(id);

    if(!barang) return;

    const item = keranjang.find(x=>x.id===id);

    if(item){

        if(item.qty >= barang.stok){

            alert("Stok tidak mencukupi.");

            return;

        }

        item.qty++;

    }else{

        if(barang.stok <= 0){

            alert("Stok habis.");

            return;

        }

        keranjang.push({

            id:barang.id,

            nama:barang.nama,

            harga:barang.harga,

            qty:1

        });

    }

    render();

};

// =====================================
// TAMBAH QTY
// =====================================

window.plus = async(id)=>{

    const barang = await db.barang.get(id);

    const item = keranjang.find(x=>x.id===id);

    if(!item) return;

    if(item.qty >= barang.stok){

        alert("Jumlah melebihi stok.");

        return;

    }

    item.qty++;

    render();

};

// =====================================
// KURANGI QTY
// =====================================

window.minus = (id)=>{

    const item = keranjang.find(x=>x.id===id);

    if(!item) return;

    item.qty--;

    if(item.qty <= 0){

        keranjang = keranjang.filter(x=>x.id!==id);

    }

    render();

};

// =====================================
// RENDER KERANJANG
// =====================================

function render(){

    keranjangDiv.innerHTML = "";

    let total = 0;

    let totalItem = 0;

    if(keranjang.length === 0){

        keranjangDiv.innerHTML = `

        <div class="text-center text-muted py-4">

            Keranjang masih kosong.

        </div>

        `;

    }

    keranjang.forEach(item=>{

        const subtotal = item.qty * item.harga;

        total += subtotal;

        totalItem += item.qty;

        keranjangDiv.innerHTML += `

        <div class="item-cart">

            <div class="item-info">

                <div class="item-nama">

                    ${item.nama}

                </div>

                <div class="item-harga">

                    ${rupiah(item.harga)} × ${item.qty}

                </div>

                <div class="fw-bold text-success mt-1">

                    ${rupiah(subtotal)}

                </div>

            </div>

            <div class="qty-box">

                <button
                    class="qty-btn"
                    onclick="minus(${item.id})">

                    −

                </button>

                <span class="qty-value">

                    ${item.qty}

                </span>

                <button
                    class="qty-btn"
                    onclick="plus(${item.id})">

                    +

                </button>

            </div>

        </div>

        `;

    });

    // ===============================
    // BADGE JUMLAH ITEM
    // ===============================

    if(jumlahItem){

        jumlahItem.textContent = totalItem + " Item";

    }

    // ===============================
    // TOTAL BELANJA
    // ===============================

    totalBelanja.textContent = rupiah(total);

    // ===============================
    // HITUNG KEMBALIAN
    // ===============================

    const uang = Number(bayar.value) || 0;

    if(uang >= total){

        kembalian.textContent = rupiah(uang - total);

    }else{

        kembalian.textContent = rupiah(0);

    }

}

// =====================================
// UPDATE KEMBALIAN SAAT MENGETIK
// =====================================

bayar.addEventListener("input", render);

// =====================================
// LOAD AWAL
// =====================================

loadBarang();

render();

// =====================================
// PREVIEW & SIMPAN TRANSAKSI
// =====================================

previewBtn.addEventListener("click", async()=>{

    if(keranjang.length === 0){

        alert("Keranjang masih kosong.");

        return;

    }

    const total = keranjang.reduce(

        (sum,item)=>sum + (item.qty * item.harga),

        0

    );

    const tunai = Number(bayar.value) || 0;

    if(tunai < total){

        alert("Uang pembayaran kurang.");

        bayar.focus();

        return;

    }

    const kembali = tunai - total;

    try{

        // ==========================
        // SIMPAN TRANSAKSI
        // ==========================

        const transaksiId = await db.transaksi.add({

            tanggal:new Date().toLocaleString("id-ID"),

            total,

            tunai,

            kembalian:kembali

        });

        // ==========================
        // SIMPAN DETAIL + UPDATE STOK
        // ==========================

        for(const item of keranjang){

            await db.detail.add({

                transaksiId,

                barangId:item.id,

                nama:item.nama,

                harga:item.harga,

                qty:item.qty

            });

            const barang = await db.barang.get(item.id);

            await db.barang.update(item.id,{

                stok:barang.stok - item.qty

            });

        }

        // ==========================
        // DATA UNTUK PREVIEW STRUK
        // ==========================

        localStorage.setItem(

            "keranjang",

            JSON.stringify(keranjang)

        );

        localStorage.setItem(

            "total",

            rupiah(total)

        );

        localStorage.setItem(

            "tunai",

            rupiah(tunai)

        );

        localStorage.setItem(

            "kembali",

            rupiah(kembali)

        );

        // ==========================
        // BUKA PREVIEW
        // ==========================

        window.open(

            "preview.html",

            "_blank"

        );

        // ==========================
        // RESET TRANSAKSI
        // ==========================

        keranjang = [];

        bayar.value = "";

        render();

        await loadBarang();

    }catch(err){

        console.error(err);

        alert("Terjadi kesalahan saat menyimpan transaksi.");

    }

});
