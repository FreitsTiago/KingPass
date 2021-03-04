const app = require('electron').remote.app
const { remote } = require('electron')

function window_control(assignment) {
    if (assignment == 'minimize') {
        remote.BrowserWindow.getFocusedWindow().minimize()
    } else if (assignment == 'resize') {
        if (remote.BrowserWindow.getFocusedWindow().isMaximized()) { 
            remote.BrowserWindow.getFocusedWindow().unmaximize()
            $('.resize_button').prop('title', 'Maximizar')
            $('.resize_button').html('<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black" width="20px" height="20px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><g><path d="M6,14L6,14c-0.55,0-1,0.45-1,1v3c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1l0,0c0-0.55-0.45-1-1-1H7v-2 C7,14.45,6.55,14,6,14z M6,10L6,10c0.55,0,1-0.45,1-1V7h2c0.55,0,1-0.45,1-1l0,0c0-0.55-0.45-1-1-1H6C5.45,5,5,5.45,5,6v3 C5,9.55,5.45,10,6,10z M17,17h-2c-0.55,0-1,0.45-1,1l0,0c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1v-3c0-0.55-0.45-1-1-1l0,0 c-0.55,0-1,0.45-1,1V17z M14,6L14,6c0,0.55,0.45,1,1,1h2v2c0,0.55,0.45,1,1,1l0,0c0.55,0,1-0.45,1-1V6c0-0.55-0.45-1-1-1h-3 C14.45,5,14,5.45,14,6z"/></g></g></g></svg>')
        } else { 
            remote.BrowserWindow.getFocusedWindow().maximize()
            $('.resize_button').prop('title', 'Desmaximizar') 
            $('.resize_button').html('<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black" width="20px" height="20px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><g><path d="M6,16h2v2c0,0.55,0.45,1,1,1l0,0c0.55,0,1-0.45,1-1v-3c0-0.55-0.45-1-1-1H6c-0.55,0-1,0.45-1,1l0,0C5,15.55,5.45,16,6,16 z M8,8H6C5.45,8,5,8.45,5,9l0,0c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1V6c0-0.55-0.45-1-1-1l0,0C8.45,5,8,5.45,8,6V8z M15,19 L15,19c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1l0,0c0-0.55-0.45-1-1-1h-3c-0.55,0-1,0.45-1,1v3C14,18.55,14.45,19,15,19z M16,8 V6c0-0.55-0.45-1-1-1l0,0c-0.55,0-1,0.45-1,1v3c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1l0,0c0-0.55-0.45-1-1-1H16z"/></g></g></g></svg>')
        }
    } else if (assignment == 'close') {
        remote.BrowserWindow.getFocusedWindow().close()
    }
    else if (assignment == 'reload') {
        remote.BrowserWindow.getFocusedWindow().reload()
    }
}