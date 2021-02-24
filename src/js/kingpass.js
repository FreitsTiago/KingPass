var secret = 'AfVqhIXfKBPMsxzwBO63hD1V3mXvP3'
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')

function modal(action, modal_name) {
    action == 'close' ? $('#' + modal_name).modal('hide') : null
    action == 'open' ? $('#' + modal_name).modal('show') : null
}

function New_Password() {
    var user = $('#new_pass_user').val()
    var pass = $('#new_pass_pass').val()
    var local = $('#new_pass_local').val()

    if (user == '') {
        $('#new_pass_alerts').html('<div class="alert alert-danger mb-1 pt-2 pb-2" role="alert"> Você precisa digitar um usuario! </div>')
    } else if (pass == '') {
        $('#new_pass_alerts').html('<div class="alert alert-danger mb-1 pt-2 pb-2" role="alert"> Você precisa digitar uma senha! </div>')
    } else if (local == '') {
        $('#new_pass_alerts').html('<div class="alert alert-danger mb-1 pt-2 pb-2" role="alert"> Você precisa digitar o local! </div>')
    } else {
        modal('close', 'new_pass_modal')
        $('#pass_lenght').val('')
        $('#new_pass_user').val('')
        $('#new_pass_pass').val('')
        $('#new_pass_local').val('')
        save_pass(user,pass,local)
        console.log(database)
    }
}

function save_pass(user,pass,local){
    var c_user = encrypt(user,secret)
    var c_pass = encrypt(pass,secret)
    var c_local = encrypt(local,secret)
    console.log(c_user+'  []  '+c_pass+'  []  '+c_local)
}

function gen_password() {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let pass_lenght = $('#pass_lenght').val()
    let password = ''
    for (var i = 0, n = charset.length; i < pass_lenght; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n))
    }
    $('#new_pass_pass').val(password)
}

function encrypt(text, secrety) {
    return (CryptoJS.AES.encrypt(text, secrety)).toString()
}
function decrypt(text, secrety) {
    var decryptedBytes = CryptoJS.AES.decrypt(text, secrety)
    return decryptedBytes.toString(CryptoJS.enc.Utf8)
}