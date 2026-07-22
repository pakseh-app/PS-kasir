import db from "./db.js";

const totalPenjualan = document.getElementById("totalPenjualan");
const jumlahTransaksi = document.getElementById("jumlahTransaksi");
const rataTransaksi = document.getElementById("rataTransaksi");
const laporanTable = document.getElementById("laporanTable");
const refreshBtn = document.getElementById("refreshBtn");

async function loadLaporan() {

    try {

        const transaksi = await db.transaksi.toArray();

        laporanTable.innerHTML = "";

        if (transaksi.length === 0) {

            laporanTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Belum ada transaksi.
                    </td>
                </tr>
            `;

            totalPenjualan.innerHTML = "Rp0";
            jumlahTransaksi.innerHTML = "0";
            rataTransaksi.innerHTML = "Rp0";

            return;
        }

        let total = 0;

        transaksi.forEach((item, index) => {

            total += Number(item.total);

            laporanTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.tanggal}</td>
                    <td>Rp ${Number(item.total).toLocaleString("id-ID")}</td>
                    <td>Rp ${Number(item.tunai).toLocaleString("id-ID")}</td>
                    <td>Rp ${Number(item.kembalian).toLocaleString("id-ID")}</td>
                </tr>
            `;

        });

        totalPenjualan.innerHTML =
            "Rp " + total.toLocaleString("id-ID");

        jumlahTransaksi.innerHTML =
            transaksi.length;

        rataTransaksi.innerHTML =
            "Rp " +
            Math.round(total / transaksi.length).toLocaleString("id-ID");

    } catch (err) {

        console.error(err);

        laporanTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-danger text-center">
                    Gagal memuat data.
                </td>
            </tr>
        `;

    }

}

refreshBtn.addEventListener("click", loadLaporan);

loadLaporan();