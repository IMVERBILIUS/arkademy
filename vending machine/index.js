function bayar(){
    let harga = document.querySelector('#harga').value
    let uang = document.querySelector('#uang').value
    let kembalian = parseInt(uang)-parseInt(harga)

    let result = konvert(kembalian)

    if(kembalian < 0){
        document.querySelector('#result').innerHTML = "uang anda Tidak cukup"
    }else{
        document.querySelector('#result').innerHTML= "kembalian anda"+kembalian+result+ "rupiah"
    }
}

function konvert(uang){
    let kalimat = ['','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh','sebelas']
    if(uang < 12) {
        return kalimat[uang]
    }else if(uang < 20){
        return konvert(uang-10) + " belas "
    }else if(uang < 100){
        return konvert(uang / 10) + " puluh "+ konvert(uang%10)
    }else if(uang < 200){
        return " seratus " + konvert(uang-100)
    }else if(uang < 1000){
        return konvert(uang / 100) + " ratus " + konvert(uang%100)
    }else if(uang < 2000){
        return  " seribu "+ konvert(uang-1000)
    }else if(uang < 10000){
        return konvert(uang / 1000) + " ribu " +konvert(uang%1000)
    }

}