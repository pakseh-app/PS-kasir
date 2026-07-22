import db from "./db.js";

const tbody = document.getElementById("barangTable");
const form = document.getElementById("barangForm");

let editId = null;

async function loadBarang(){

    const data = await db.barang.toArray();

    tbody.innerHTML="";

    data.forEach((item,index)=>{

        tbody.innerHTML+=`

        <tr>

            <td>${index+1}</td>

            <td>${item.nama}</td>

            <td>Rp ${item.harga.toLocaleString()}</td>

            <td>${item.stok}</td>

            <td>

<button
class="btn btn-warning btn-sm"
onclick="editBarang(${item.id})">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="hapusBarang(${item.id})">

Hapus

</button>

            </td>

        </tr>

        `;

    });

}

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const barang={

        nama:document.getElementById("nama").value,

        harga:Number(document.getElementById("harga").value),

        stok:Number(document.getElementById("stok").value)

    };

    if(editId){

        await db.barang.update(editId,barang);

        editId=null;

    }else{

        await db.barang.add(barang);

    }

    form.reset();

    loadBarang();

});

window.editBarang=async(id)=>{

    const item=await db.barang.get(id);

    document.getElementById("nama").value=item.nama;

    document.getElementById("harga").value=item.harga;

    document.getElementById("stok").value=item.stok;

    editId=id;

}

window.hapusBarang=async(id)=>{

    if(confirm("Yakin hapus barang?")){

        await db.barang.delete(id);

        loadBarang();

    }

}

loadBarang();
