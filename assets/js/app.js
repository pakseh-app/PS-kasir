import db from "./db.js";

async function init(){

let setting = await db.setting.get(1);

if(!setting){

await db.setting.put({

id:1,

namaToko:"Lab Kopi",

alamat:"Makassar",

footer:"Terima kasih atas pembelian Anda",

ppn:10

});

}

}

init();
