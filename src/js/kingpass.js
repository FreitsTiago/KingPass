const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const crypto = require("crypto");
const { Renderer } = require('electron');
const alg = 'aes-256-ctr'
var client_key = ''

const db = low(new FileSync(__dirname+'/src/database.json'));
db.defaults({ keNLVOly8g: [], OLEvDbiPUr: "", w5egoQHoRn:"" }).write() // Usado para criar a parte das mensagens no arquivo

if(db.get('OLEvDbiPUr').value() == '' && db.get('w5egoQHoRn').value() == ''){
    interface('show','Register_Content')
}else if(db.get('OLEvDbiPUr').value() != '' && db.get('w5egoQHoRn').value() != ''){
    interface('show','Login_Content')
}else{
    interface('show','Register_Content')
}

//-------Tradores-de-criptografia-----------------------------------------------------

function encrypt(text, secure) {
    var cipher = crypto.createCipher(alg, secure)
    return (cipher.update(text, 'utf8', 'hex') + cipher.final('hex'))
}
function decrypt(text, secure) {
    var decipher = crypto.createDecipher(alg, secure)
    return (decipher.update(text, 'hex', 'utf8'))
}
function encrypt_iv(text,secret) {
    var iv = crypto.randomBytes(16)
    var cipher = crypto.createCipheriv(alg, secret, iv)
    var crypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    return (iv.toString('hex') + ':' + crypted)
}
function decrypt_iv(text,secret){
    var parts = text.split(':')
    var decipher = crypto.createDecipheriv(alg, secret, new Buffer(parts[0], 'hex'))
    var plain = decipher.update(parts[1], 'hex', 'utf8')
    return plain
}

//-------Fim-dos-tradores-de-criptografia---------------------------------------------

function register(){
    if(db.get('OLEvDbiPUr').value() == '' && db.get('w5egoQHoRn').value() == ''){
        var pass = $('#new_pass_register').val()
        var c_pass = $('#confirm_pass_register').val()

        if(pass != '' && pass != null && c_pass != '' && c_pass != null){
            if(pass.length >= 8 && pass.length <= 20){
                if(pass == c_pass){
                    var secret = crypto.randomBytes(16).toString('hex')
                    var cr_pass = encrypt(pass,pass)
                    var cr_secret = encrypt(secret,pass)
                    db.set('OLEvDbiPUr',cr_pass).write()
                    db.set('w5egoQHoRn',cr_secret).write()
                    interface('hide','Register_Content')
                    interface('show','Home_Content')
                    $('#alert_zone_home').append(`<div class="alert alert-success ml-2 mr-2 pt-2 pb-2" role="alert"> Senha bem vindo ao painel KingPass! Você registrou sua senha com sucesso! <button type="button" class="btn btn-outline-success m-0 p-0 pl-2 pr-2" onclick="interface('dismiss_alert','alert_zone_home')"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black"width="10px" height="10px"><g><rect fill="none" height="24" width="24" /></g><g><g><path d="M18.3,5.71L18.3,5.71c-0.39-0.39-1.02-0.39-1.41,0L12,10.59L7.11,5.7c-0.39-0.39-1.02-0.39-1.41,0l0,0 c-0.39,0.39-0.39,1.02,0,1.41L10.59,12L5.7,16.89c-0.39,0.39-0.39,1.02,0,1.41l0,0c0.39,0.39,1.02,0.39,1.41,0L12,13.41l4.89,4.89 c0.39,0.39,1.02,0.39,1.41,0l0,0c0.39-0.39,0.39-1.02,0-1.41L13.41,12l4.89-4.89C18.68,6.73,18.68,6.09,18.3,5.71z" /></g></g></svg></button></div>`)
                    $('#new_pass_register').val('')
                    $('#confirm_pass_register').val('')
                }else{
                    $('#alert_zone_register').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> As senhas precisão ser iguais! </div>')
                }
            }else{
                $('#alert_zone_register').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> Sua senha deve ter de 8 a 20 caracteres! </div>')
            }
        }else{
            $('#alert_zone_register').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> Você precisa digitar as duas senhas! </div>')
        }
    }
}

function login(){
    client_key = $('#pass_login').val()
    if(client_key == decrypt(db.get('OLEvDbiPUr').value(),client_key)){
        interface('hide','Login_Content')
        interface('show','Home_Content')
        render_passwords()
    }else{
        $('#alert_zone_login').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> Sua senha esta incorreta! </div>')
    }
}

function render_passwords(){
    console.log('pediu')
}

function interface(action,id){
    action == 'hide' ? document.getElementById(id).hidden=true : null
    action == 'show' ? document.getElementById(id).hidden=false : null
    action == 'dismiss_alert' ? $('#' + id).html('') : null
}

function modal(action, modal_name) {
    action == 'close' ? $('#' + modal_name).modal('hide') : null
    action == 'open' ? $('#' + modal_name).modal('show') : null
}

function New_Password() {
    $('#new_pass_alerts').html('')

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
        $('#new_pass_alerts').html('')
        console.log(`Foi gerada uma nova senha: ${pass}, cujo usuario é: ${user}, e o local é: ${local}`)
    }
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