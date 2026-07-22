const STORAGE_KEY = "kategoriKasir";

let kategori = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const input = document.getElementById("namaKategori");

const table = document.getElementById("kategoriTable");

const btn = document.getElementById("btnTambah");

let editIndex = null;

function simpan() {

localStorage.setItem(STORAGE_KEY, JSON.stringify(kategori));

}

function render() {

table.innerHTML = "";

kategori.forEach((item,index)=>{

table.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.nama}</td>

<td>

<button onclick="editKategori(${index})">

Edit

</button>

<button onclick="hapusKategori(${index})">

Hapus

</button>

</td>

</tr>

`;

});

}

btn.onclick = ()=>{

const nama = input.value.trim();

if(nama===""){

alert("Nama kategori wajib diisi");

return;

}

if(editIndex===null){

kategori.push({

id:Date.now(),

nama

});

}else{

kategori[editIndex].nama = nama;

editIndex=null;

btn.innerText="Tambah";

}

input.value="";

simpan();

render();

};

function editKategori(index){

input.value = kategori[index].nama;

editIndex=index;

btn.innerText="Update";

}

function hapusKategori(index){

if(confirm("Hapus kategori?")){

kategori.splice(index,1);

simpan();

render();

}

}

render();
