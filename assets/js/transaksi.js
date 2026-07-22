import db from "./db.js";

const daftarBarang=document.getElementById("daftarBarang");
const keranjangDiv=document.getElementById("keranjang");
const totalBelanja=document.getElementById("totalBelanja");
const bayar=document.getElementById("bayar");
const previewBtn=document.getElementById("previewBtn");
const kembalian=document.getElementById("kembalian");

let keranjang=[];

async function loadBarang(){

const barang=await db.barang.toArray();

daftarBarang.innerHTML="";

barang.forEach(item=>{

daftarBarang.innerHTML+=`

<div class="card mb-2">

<div class="card-body">

<h5>${item.nama}</h5>

<p>

Rp ${item.harga.toLocaleString()}

</p>

<button
class="btn btn-success"
onclick="tambahKeranjang(${item.id})">

Tambah

</button>

</div>

</div>

`;

});

}

window.tambahKeranjang=async(id)=>{

const barang=await db.barang.get(id);

const ada=keranjang.find(x=>x.id===id);

if(ada){

ada.qty++;

}else{

keranjang.push({

id:barang.id,

nama:barang.nama,

harga:barang.harga,

qty:1

});

}

render();

}

window.plus=(id)=>{

keranjang.find(x=>x.id===id).qty++;

render();

}

window.minus=(id)=>{

const item=keranjang.find(x=>x.id===id);

item.qty--;

if(item.qty<=0){

keranjang=
keranjang.filter(x=>x.id!==id);

}

render();

}

function render(){

keranjangDiv.innerHTML="";

let total=0;

keranjang.forEach(item=>{

total+=item.qty*item.harga;

keranjangDiv.innerHTML+=`

<div class="border rounded p-2 mb-2">

<b>${item.nama}</b>

<br>

${item.qty}

x

Rp ${item.harga.toLocaleString()}

<br><br>

<button
class="btn btn-danger btn-sm"
onclick="minus(${item.id})">

-

</button>

<button
class="btn btn-success btn-sm"
onclick="plus(${item.id})">

+

</button>

</div>

`;

});

totalBelanja.innerHTML="Rp "+total.toLocaleString();

const uang=Number(bayar.value);

if(uang>0){

kembalian.innerHTML=

"Rp "+(uang-total).toLocaleString();

}else{

kembalian.innerHTML="Rp0";

}

}

bayar.addEventListener("keyup",render);

loadBarang();

previewBtn.onclick=()=>{

localStorage.setItem(

"keranjang",

JSON.stringify(keranjang)

);

localStorage.setItem(

"total",

totalBelanja.innerText

);

localStorage.setItem(

"tunai",

"Rp "+Number(bayar.value).toLocaleString()

);

localStorage.setItem(

"kembali",

kembalian.innerText

);

window.open(

"receipt/preview.html",

"_blank"

);

}
