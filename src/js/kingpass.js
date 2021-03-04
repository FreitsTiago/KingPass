const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const crypto = require("crypto")
const { clipboard,shell } = require('electron')
const { dialog } = require('electron').remote
const fs = require('fs')
const { stringify } = require('querystring')
const alg = 'aes-256-ctr'
var client_key = ''
bootstrap_visual_task()

$("#contein_pass").on("DOMNodeInserted DOMNodeRemoved","#div1coApp1",function(){
    alert("Hello");
    });

// Configura e inicializa o Banco de Dados
const db = low(new FileSync(app.getPath("userData") + '/database.json'));
db.defaults({ keNLVOly8g: [], OLEvDbiPUr: "", w5egoQHoRn: "", id: 0 }).write() // Usado para criar a parte das mensagens no arquivo

document.querySelector('body').addEventListener('keydown', function (event) {
    if (event.keyCode == 13) {
        if (!$('#Register_Content').is(':hidden')) {
            register()
        } else if (!$('#Login_Content').is(':hidden')) {
            login()
        }
    };
});

// Identifica em qual tela ele deve iniciar
if (db.get('OLEvDbiPUr').value() == '' && db.get('w5egoQHoRn').value() == '') {
    interface('show', 'Register_Content')
} else if (db.get('OLEvDbiPUr').value() != '' && db.get('w5egoQHoRn').value() != '') {
    interface('show', 'Login_Content')
    $('#pass_login').select()
} else {
    interface('show', 'Register_Content')
}

// Ajusta o tamanho da area dos cartões de senha na tela principal
window.onresize = function () {
    $('#contein_pass').css({ height: ($(window).height() - ($('#nav_home').height() - $('#alert_zone_home').height()) - 50).toFixed(0), overflow: "auto" });
};

// Exibe qual o tamanho da senha para o cliente no gerador de senha
document.getElementById('new_pass_length').addEventListener('input', function () {
    $('#new_pass_length_display').html($('#new_pass_length').val())
});

function empty_image(action){
    if(action == 'hide'){
        interface('hide', 'empyt_image')
    }else if(action == 'auto'){
        if($('#passwords_cards').html().trim() == ''){
            interface('show', 'empyt_image')
        }else{
            interface('hide', 'empyt_image')
        }
    }
    console.log($('#passwords_cards').html().trim())
}

function export_pass() {
    let date = new Date(); if ((date.getMonth() + 1) < 10) { var month = '0' + (date.getMonth() + 1) } else { var month = (date.getMonth() + 1) }; if (date.getDate() < 10) { var day = '0' + date.getDate() } else { var day = date.getDate() }; if (date.getHours() < 10) { var hours = '0' + date.getHours() } else { var hours = date.getHours() }; if (date.getMinutes() < 10) { var minutes = '0' + date.getMinutes() } else { var minutes = date.getMinutes() }; var year = date.getFullYear();
    let content = '{\n"keNLVOly8g": ' + (JSON.stringify(db.get('keNLVOly8g').value())) + ',\n"OLEvDbiPUr": "' + (db.get('OLEvDbiPUr').value()) + '",\n"w5egoQHoRn": "' + (db.get('w5egoQHoRn').value()) + '",\n"id": ' + (db.get('id').value()) + '\n}'
    let options = {
        title: 'Exportar senhas',
        filters: [
            { name: 'KingPass', extensions: ['kgp'] }
        ],
        defaultPath: `${year}.${month}.${day}-${hours}.${minutes}`
    }
    dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
            fs.writeFile(result.filePath, content, (err) => {
                console.log(err)
            })
        }
    })
}

function import_pass(action,cmp) {
    if(action == 'import'){
        let options = {
            title: 'Importar senhas',
            filters: [
                { name: 'KingPass', extensions: ['kgp'] }
            ],
            properties: ['openFile']
        }
        dialog.showOpenDialog(options).then(result => {
            if (!result.canceled) {
                fs.readFile(result.filePaths[0], 'utf-8', (err, data) => {
                    fs.writeFile(app.getPath("userData") + '/database.json', data, (err) => {
                        window_control('reload')
                    })
                })
            }
        })
    }else if(action == 'modal_create'){
        var import_serial = crypto.randomBytes(3).toString('hex')
        $('#modal_area').append(`
                    <div id="import_modal_${import_serial}" class="modal" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body bg-king">
                                    <h5 class="card-title text-white">Importar pacote de senhas?</h5>
                                    <p class="text-white m-0">Você está prestes a importar um pacote de senhas, isso significa que você vai sobreescrever suas senhas e sua senha de login atual!</p>
                                    <input id="import_pass_${import_serial}" type="text" class="form-control mb-2 mt-1" placeholder="Digite sua senha para confirmar" aria-label="Senha" aria-describedby="basic-addon1">
                                    <div id="import_incorect_${import_serial}"></div>
                                    <button type="button" class="btn btn-success" onclick="import_pass('modal_delete','${import_serial}')">Cancelar</button>
                                    <button type="button" class="btn btn-secondary" onclick="import_pass('validate','${import_serial}')">Importar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
        modal('open', `import_modal_${import_serial}`)
        setTimeout(() => {
            modal('close', `import_modal_${cmp}`)
            $(`#import_modal_${cmp}`).remove()
        }, 180000);
    }else if(action == 'modal_delete'){
        modal('close', `import_modal_${cmp}`)
        $(`#import_modal_${cmp}`).remove()
    }else if(action == 'validate'){
        if ($(`#import_pass_${cmp}`).val() == decrypt(db.get('OLEvDbiPUr').value(), $(`#import_pass_${cmp}`).val())) {
            modal('close', `import_modal_${cmp}`)
            $(`#import_modal_${cmp}`).remove()
            bootstrap_visual_task()
            import_pass('import')
        } else {
            $(`#import_incorect_${cmp}`).html('<div class="alert alert-danger p-2 text-center" role="alert">Senha incorreta!</div>')
        }
    }
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
function encrypt_iv(text, secret) {
    var iv = crypto.randomBytes(16)
    var cipher = crypto.createCipheriv(alg, secret, iv)
    var crypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    return (iv.toString('hex') + ':' + crypted)
}
function decrypt_iv(text, secret) {
    var parts = text.split(':')
    var decipher = crypto.createDecipheriv(alg, secret, new Buffer(parts[0], 'hex'))
    var plain = decipher.update(parts[1], 'hex', 'utf8')
    return plain
}

//-------Fim-dos-tradores-de-criptografia---------------------------------------------

// Registra o cliente
function register() {
    if (db.get('OLEvDbiPUr').value() == '' && db.get('w5egoQHoRn').value() == '') {
        var pass = $('#new_pass_register').val()
        var c_pass = $('#confirm_pass_register').val()

        if (pass != '' && pass != null && c_pass != '' && c_pass != null) {
            if (pass.length >= 8 && pass.length <= 20) {
                if (pass == c_pass) {
                    var secret = crypto.randomBytes(16).toString('hex')
                    var cr_pass = encrypt(pass, pass)
                    var cr_secret = encrypt(secret, pass)
                    db.set('OLEvDbiPUr', cr_pass).write()
                    db.set('w5egoQHoRn', cr_secret).write()
                    interface('hide', 'Register_Content')
                    interface('show', 'Home_Content')
                    $('#alert_zone_home').append(`<div class="alert alert-success ml-2 mr-2 pt-2 pb-2" role="alert"> Senha bem vindo ao painel KingPass! Você registrou sua senha com sucesso! <button type="button" class="btn btn-outline-success m-0 p-0 pl-2 pr-2" onclick="interface('dismiss_alert','alert_zone_home')"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black"width="10px" height="10px"><g><rect fill="none" height="24" width="24" /></g><g><g><path d="M18.3,5.71L18.3,5.71c-0.39-0.39-1.02-0.39-1.41,0L12,10.59L7.11,5.7c-0.39-0.39-1.02-0.39-1.41,0l0,0 c-0.39,0.39-0.39,1.02,0,1.41L10.59,12L5.7,16.89c-0.39,0.39-0.39,1.02,0,1.41l0,0c0.39,0.39,1.02,0.39,1.41,0L12,13.41l4.89,4.89 c0.39,0.39,1.02,0.39,1.41,0l0,0c0.39-0.39,0.39-1.02,0-1.41L13.41,12l4.89-4.89C18.68,6.73,18.68,6.09,18.3,5.71z" /></g></g></svg></button></div>`)
                    $('#new_pass_register').val('')
                    $('#confirm_pass_register').val('')
                    bootstrap_visual_task()
                    client_key = pass
                    render_passwords()
                } else {
                    $('#alert_zone_register').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> As senhas precisão ser iguais! </div>')
                }
            } else {
                $('#alert_zone_register').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> Sua senha deve ter de 8 a 20 caracteres! </div>')
            }
        } else {
            $('#alert_zone_register').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> Você precisa digitar as duas senhas! </div>')
        }
    }
}

// Loga o cliente e o leva para e tela principal
function login() {
    client_key = $('#pass_login').val()
    if (client_key == decrypt(db.get('OLEvDbiPUr').value(), client_key)) {
        interface('hide', 'Login_Content')
        interface('show', 'Home_Content')
        render_passwords()
    } else {
        $('#alert_zone_login').html('<div class="alert alert-danger mt-2 pt-2 pb-2" role="alert"> Sua senha esta incorreta! </div>')
    }
}

// Renderiza todas as senhas
function render_passwords() {
    $('#passwords_cards').html('')
    var passwords = db.get('keNLVOly8g').value()
    var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
    try {
        for (pass of passwords) {
            var user = decrypt_iv(pass.Evmo1J9ohG, secret)
            var local = decrypt_iv(pass.CqcFkpQc2i, secret)
            render_card(pass.id, user, local)
        }
    } catch (error) {

    }
    empty_image('auto')
}

// Trada da exibição de conteudos da interfacee telas
function interface(action, id) {
    action == 'hide' ? document.getElementById(id).hidden = true : null
    action == 'show' ? document.getElementById(id).hidden = false : null
    action == 'dismiss_alert' ? $('#' + id).html('') : null
    $('#contein_pass').css({ height: ($(window).height() - ($('#nav_home').height() - $('#alert_zone_home').height()) - 50).toFixed(0), overflow: "auto" });
}

// Exibe ou esconde um modal
function modal(action, modal_name) {
    if(action == 'close'){
        $('#' + modal_name).modal('hide')
        empty_image('auto')
    }else if(action == 'open'){
        $('#' + modal_name).modal('show')
        empty_image('hide')
    }
}

// Registra uma nova senha
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
        $('#new_pass_length').val('8')
        $('#new_pass_length_display').html('8')
        var id = save_pass(user, pass, local)
        render_card(id, user, local)
        empty_image('auto')
    }
}

// Gera uma senha para o usuario
function gen_password(destiny_id, checkbox_id, leght_id) {
    let capital_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let lowercase = 'abcdefghijklmnopqrstuvwxyz'
    let numbers = '0123456789'
    let symbols = '!@#$%&~^'
    let charset = ''
    let pass_lenght = $('#' + leght_id).val()
    let password = ''

    $('#' + checkbox_id + '1').is(':checked') ? charset = charset + capital_letters : null
    $('#' + checkbox_id + '2').is(':checked') ? charset = charset + lowercase : null
    $('#' + checkbox_id + '3').is(':checked') ? charset = charset + numbers : null
    $('#' + checkbox_id + '4').is(':checked') ? charset = charset + symbols : null

    for (var i = 0, n = charset.length; i < pass_lenght; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n))
    }
    $('#' + destiny_id).val(password)
}

// Guarda os dados na DataBase
function save_pass(user, pass, local) {
    var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
    var c_user = encrypt_iv(user, secret)
    var c_pass = encrypt_iv(pass, secret)
    var c_local = encrypt_iv(local, secret)
    var id = db.get('id').value() + 1
    db.set('id', id).write()
    db.get('keNLVOly8g').push({ id: id, Evmo1J9ohG: c_user, a9wz65IZLo: c_pass, CqcFkpQc2i: c_local }).write() //Evmo1J9ohG - User  |  a9wz65IZLo - Senha  |  CqcFkpQc2i - Local
    bootstrap_visual_task()
    return id
}

// Copia a senha na interface
function copy_pass(id) {
    var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
    var group = db.get('keNLVOly8g').find({ "id": id }).value()
    var password = decrypt_iv(group.a9wz65IZLo, secret)
    clipboard.writeText(password)
    $('#password_copied_' + id).html('<div class="alert alert-success pt-2 pb-2 text-center" role="alert">Copiada!</div>')
    setTimeout(() => { $('#password_copied_' + id).html('') }, 3000);
}

// Exibe a senha na interface
function show_pass(id) {
    if (!$('#password_subs_' + id).hasClass('visible_password')) {
        var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
        var group = db.get('keNLVOly8g').find({ "id": id }).value()
        var password = decrypt_iv(group.a9wz65IZLo, secret)
        $('#password_subs_' + id).html(`<strong>Senha:</strong><br>${password}`)
        $('#password_subs_' + id).addClass('visible_password');
        $('#password_visibility_' + id).html('<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><path d="M22.65,10.7C20.74,6.74,16.69,4,12,4c-1.53,0-3,0.3-4.34,0.83l2.55,2.55C10.76,7.14,11.36,7,12,7c2.48,0,4.5,2.02,4.5,4.5 c0,0.64-0.14,1.24-0.38,1.79l3.17,3.17c1.41-1.11,2.57-2.53,3.35-4.16C22.89,11.8,22.89,11.2,22.65,10.7z"/><path d="M12,8.8c-0.12,0-0.23,0.02-0.34,0.03l3,3c0.01-0.11,0.03-0.22,0.03-0.34C14.7,10.01,13.49,8.8,12,8.8z"/><path d="M3.51,3.51c-0.39-0.39-1.02-0.39-1.41,0v0c-0.39,0.39-0.39,1.02,0,1.41l2.06,2.06C3,8.02,2.04,9.28,1.35,10.7 c-0.24,0.5-0.24,1.1,0,1.6C3.26,16.26,7.31,19,12,19c1.26,0,2.47-0.2,3.6-0.57l3.47,3.47c0.39,0.39,1.02,0.39,1.41,0 c0.39-0.39,0.39-1.02,0-1.41L3.51,3.51z M12,16c-2.48,0-4.5-2.02-4.5-4.5c0-0.36,0.05-0.7,0.13-1.04l1.78,1.78 c0.26,0.89,0.95,1.58,1.84,1.84l1.78,1.78C12.7,15.95,12.36,16,12,16z"/></g></g></svg>')
    } else {
        $('#password_subs_' + id).html(`<strong>Senha:</strong><br>••••••••`)
        $('#password_subs_' + id).removeClass('visible_password');
        $('#password_visibility_' + id).html('<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><path d="M12,4C7.31,4,3.26,6.74,1.35,10.7c-0.24,0.5-0.24,1.1,0,1.6C3.26,16.26,7.31,19,12,19s8.74-2.74,10.65-6.7 c0.24-0.5,0.24-1.1,0-1.6C20.74,6.74,16.69,4,12,4z M12,16c-2.48,0-4.5-2.02-4.5-4.5S9.52,7,12,7s4.5,2.02,4.5,4.5S14.48,16,12,16 z"/><circle cx="12" cy="11.5" r="2.7"/></g></g></svg>')
    }
}

// Gera um modal de confirmação para apagar uma senha
function request_delete_pass(action, id) {
    if (action == 'delete_modal') {
        modal('close', `delete_pass_modal_${id}`)
        $('#delete_pass_modal_' + id).remove();
    } else if (action == 'delete_pass') {
        var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
        var group = db.get('keNLVOly8g').find({ "id": id }).value()
        var local = decrypt_iv(group.CqcFkpQc2i, secret)
        $('#modal_area').append(`
                <div id="delete_pass_modal_${id}" class="modal" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-body bg-king">
                                <h5 class="card-title text-white">Apagar senha</h5>
                                <p class="text-white m-0">Você realmente deseja apagar a senha do(a) <strong>${local}</strong> <br>Esta é uma ação irreverssivel!<br>Mas antes você precisa digital sua senha!</p>
                                <input id="delete_pass_pass_${id}" type="text" class="form-control mb-2 mt-1" placeholder="Digite sua senha" aria-label="Senha" aria-describedby="basic-addon1">
                                <div id="delete_pass_incorrect_${id}"></div>
                                <button type="button" class="btn btn-success" onclick="request_delete_pass('delete_modal',${id})">Cancelar</button>
                                <button type="button" class="btn btn-secondary" onclick="delete_pass(${id})">Apagar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        modal('open', `delete_pass_modal_${id}`)
    }
}

// Deleta uma senha do Banco de Dados
function delete_pass(id) {
    if ($('#delete_pass_pass_' + id).val() == decrypt(db.get('OLEvDbiPUr').value(), $('#delete_pass_pass_' + id).val())) {
        request_delete_pass('delete_modal', id)
        db.get('keNLVOly8g').remove({ "id": id }).write()
        bootstrap_visual_task()
        $('#pass_card_' + id).remove()
        $('#alert_zone_home').html('<div class="alert alert-success p-2 text-center" role="alert">Senha apagada com sucesso!</div>')
        setTimeout(() => { $('#alert_zone_home').html('') }, 3000);
    } else {
        $('#delete_pass_incorrect_' + id).html('<div class="alert alert-danger p-2 text-center" role="alert">Senha incorreta!</div>')
    }
    empty_image('auto')
}

// Edita a senha no banco de dados pela interface
function edit_pass(action, id, cmp) {
    if (action == 'show_modal') {
        var edit_ps = crypto.randomBytes(3).toString('hex')
        var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
        var group = db.get('keNLVOly8g').find({ "id": id }).value()
        var user = decrypt_iv(group.Evmo1J9ohG, secret)
        var pass = decrypt_iv(group.a9wz65IZLo, secret)
        var local = decrypt_iv(group.CqcFkpQc2i, secret)
        $('#modal_area').append(`
        <div id="edit_pass_modal_${edit_ps}" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content rounded">
            <div class="modal-body bg-king">
              <h5 class="card-title text-white">Editar senha</h5>
              <label for="edit_pass_local_${edit_ps}" class="col-form-label text-light">Nome da aplicação:</label>
              <input type="text" class="form-control mb-1" placeholder="Ex: Youtube, Google, EpicGames, etc."
                id="edit_pass_local_${edit_ps}" aria-describedby="basic-addon3" value="${local}">
              <label for="edit_pass_user_${edit_ps}" class="col-form-label text-light">Usuario:</label>
              <input id="edit_pass_user_${edit_ps}" type="text" class="form-control mb-1" placeholder="Digite o nome de usuario"
                aria-label="Usuário" aria-describedby="basic-addon1"value="${user}">
              <label for="edit_pass_pass_${edit_ps}" class="col-form-label text-light">Senha:</label>
              <input id="edit_pass_pass_${edit_ps}" type="text" class="form-control mb-1"
                placeholder="Digite a senha ou gere uma abaixo" aria-label="Senha" aria-describedby="basic-addon1" value="${pass}">
    
              <div class="hadow-lg p-2 mb-2 mt-2 bg-king_50 rounded">
    
                <div>
                  <label class="form-check-label text-light" for="edit_pass_length_${edit_ps}">Gerar senha</label>
                  <input type="range" min="8" max="40" class="form-control-range" id="edit_pass_length_${edit_ps}" value="8">
                  <a class="text-light" id="edit_pass_length_display_${edit_ps}">8</a>
                </div>
    
    
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit_pass_checkbox_${edit_ps}_1" value="true" checked>
                  <label class="form-check-label text-light" for="edit_pass_checkbox_${edit_ps}_1">Maiúsculas</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit_pass_checkbox_${edit_ps}_2" value="true" checked>
                  <label class="form-check-label text-light" for="edit_pass_checkbox_${edit_ps}_2">Minúsculas</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit_pass_checkbox_${edit_ps}_3" value="true" checked>
                  <label class="form-check-label text-light" for="edit_pass_checkbox_${edit_ps}_3">Números</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit_pass_checkbox_${edit_ps}_4" value="true">
                  <label class="form-check-label text-light" for="edit_pass_checkbox_${edit_ps}_4">Símbolos</label>
                </div>
    
                <button type="button" class="btn btn-secondary w-100" onclick="gen_password('edit_pass_pass_${edit_ps}','edit_pass_checkbox_${edit_ps}_','edit_pass_length_${edit_ps}')">Gerar</button>
              </div>
    
              <div id="edit_pass_alerts_${edit_ps}">
    
              </div>
              <button type="button" class="btn btn-success" onclick="edit_pass('edit_pass',${id},'${edit_ps}')">Salvar</button>
              <button type="button" class="btn btn-secondary" onclick="edit_pass('edit_pass_calcel','${edit_ps}')">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
        `)
        modal('open', `edit_pass_modal_${edit_ps}`)
        document.getElementById('edit_pass_length_' + edit_ps).addEventListener('input', function () {
            $('#edit_pass_length_display_' + edit_ps).html($('#edit_pass_length_' + edit_ps).val())
        });
        setTimeout(() => { modal('close', `edit_pass_modal_${edit_ps}`); $('#edit_pass_modal_' + edit_ps).remove() }, 120000);
    } else if (action == 'edit_pass_calcel') {
        modal('close', `edit_pass_modal_${id}`)
        $('#edit_pass_modal_' + id).remove()
    } else if (action == 'edit_pass') {
        var user = $('#edit_pass_user_' + cmp).val()
        var pass = $('#edit_pass_pass_' + cmp).val()
        var local = $('#edit_pass_local_' + cmp).val()
        if (user == '') {
            $('#edit_pass_alerts_' + cmp).html('<div class="alert alert-danger mb-1 pt-2 pb-2" role="alert"> Você precisa digitar um usuario! </div>')
        } else if (pass == '') {
            $('#edit_pass_alerts_' + cmp).html('<div class="alert alert-danger mb-1 pt-2 pb-2" role="alert"> Você precisa digitar uma senha! </div>')
        } else if (local == '') {
            $('#edit_pass_alerts_' + cmp).html('<div class="alert alert-danger mb-1 pt-2 pb-2" role="alert"> Você precisa digitar o local! </div>')
        } else {
            modal('close', `edit_pass_modal_${cmp}`)
            $('#edit_pass_modal_' + cmp).remove()
            var secret = decrypt(db.get('w5egoQHoRn').value(), client_key)
            var c_user = encrypt_iv(user, secret)
            var c_pass = encrypt_iv(pass, secret)
            var c_local = encrypt_iv(local, secret)
            db.get('keNLVOly8g').find({ "id": id }).assign({ id: id, Evmo1J9ohG: c_user, a9wz65IZLo: c_pass, CqcFkpQc2i: c_local }).write()
            bootstrap_visual_task()
            render_passwords()
        }
    }
}

// Renderiza um cartão de senha na pagina principal
function render_card(id, user, local) {
    $('#passwords_cards').append(`
        <div id="pass_card_${id}" class="col-md-3 p-1" style="max-width: 231px;">
            <div class="card bg-king">
                <div class="card-body">
                    <h3 class="card-title text-success">${local}</h3>
                    <p class="card-text text-left text-light mb-0"><strong>Usuario:</strong><br>${user}</p>
                    <p class="card-text text-left text-light" id="password_subs_${id}"><strong>Senha:</strong><br>••••••••</p>
                    <div id="password_copied_${id}"></div>
                    <div class="btn-group" role="group" aria-label="Exemplo básico">
                        <button type="button" class="btn btn-outline-success" id="password_visibility_${id}" onclick="show_pass(${id})"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><path d="M12,4C7.31,4,3.26,6.74,1.35,10.7c-0.24,0.5-0.24,1.1,0,1.6C3.26,16.26,7.31,19,12,19s8.74-2.74,10.65-6.7 c0.24-0.5,0.24-1.1,0-1.6C20.74,6.74,16.69,4,12,4z M12,16c-2.48,0-4.5-2.02-4.5-4.5S9.52,7,12,7s4.5,2.02,4.5,4.5S14.48,16,12,16 z"/><circle cx="12" cy="11.5" r="2.7"/></g></g></svg></button>
                        <button type="button" class="btn btn-outline-success" onclick="copy_pass(${id})"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><g><rect fill="none" height="24" width="24"/></g><g><path d="M15,20H5V7c0-0.55-0.45-1-1-1h0C3.45,6,3,6.45,3,7v13c0,1.1,0.9,2,2,2h10c0.55,0,1-0.45,1-1v0C16,20.45,15.55,20,15,20z M20,16V4c0-1.1-0.9-2-2-2H9C7.9,2,7,2.9,7,4v12c0,1.1,0.9,2,2,2h9C19.1,18,20,17.1,20,16z M18,16H9V4h9V16z"/></g></svg></button>
                        <button type="button" class="btn btn-outline-success" onclick="edit_pass('show_modal',${id})"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M3,17.46l0,3.04C3,20.78,3.22,21,3.5,21h3.04c0.13,0,0.26-0.05,0.35-0.15L17.81,9.94l-3.75-3.75L3.15,17.1 C3.05,17.2,3,17.32,3,17.46z"/></g><g><path d="M20.71,5.63l-2.34-2.34c-0.39-0.39-1.02-0.39-1.41,0l-1.83,1.83l3.75,3.75l1.83-1.83C21.1,6.65,21.1,6.02,20.71,5.63z"/></g></g></g></svg></button>
                        <button type="button" class="btn btn-outline-success" onclick="request_delete_pass('delete_pass',${id})"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="20px" height="20px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M6,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7H6V19z M18,4h-2.5l-0.71-0.71C14.61,3.11,14.35,3,14.09,3H9.91 c-0.26,0-0.52,0.11-0.7,0.29L8.5,4H6C5.45,4,5,4.45,5,5s0.45,1,1,1h12c0.55,0,1-0.45,1-1S18.55,4,18,4z"/></g></svg></button>
                    </div>
                </div>
            </div>
        </div>
    `)
}