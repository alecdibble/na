const moment = require('moment');

const db = require('./db')
const alert = require('./alert')
const shell = require('shelljs');

module.exports = {
  getSyncStatus: () => {
    const status = db.getSyncStatus()
  },
  serializeForSync: () => {
    return console.log(Buffer.from(JSON.stringify(db.serializeDB())).toString('base64'))
  },
  deserializeDb: (schema) => {
    db.deserializeOverwriteDB(JSON.parse(Buffer.from(schema, 'base64').toString()))
    return
  },
  syncSendChanges: () => {
    if(shell.which('nama-sync')) {
      var syncStatus = db.getSyncStatus();
      if(syncStatus && syncStatus['synced_datetime']) {
        alert("Syncing changes with the AliaSync server")
        shell.exec('nama-sync schemaMerge ' + Buffer.from(JSON.stringify(db.serializeDB())).toString('base64') , {silent:true}, function(code, stdout, stderr) {
          if(code == 0) {
            return alert('Sync sucessful!')
          }
          return alert(stderr)
          return alert('\x1b[31mERROR\x1b[0m: Problem with sync!')
        });
      }
    }
  },
  syncRemoveNamespace: (namespace) => {
    if(shell.which('nama-sync')) {
      var syncStatus = db.getSyncStatus();
      if(syncStatus && syncStatus['synced_datetime']) {
        alert("Syncing changes with the AliaSync server")
        shell.exec('nama-sync namespace remove ' + namespace , {silent:true}, function(code, stdout, stderr) {
          if(code == 0) {
            return alert('Sync sucessful!')
          }
          return alert('\x1b[31mERROR\x1b[0m: Problem with sync!')
        });
      }
    }
  },
  syncRemoveCommand: (namespace, commandName) => {
    if(shell.which('nama-sync')) {
      var syncStatus = db.getSyncStatus();
      if(syncStatus && syncStatus['synced_datetime']) {
        alert("Syncing changes with the AliaSync server")
        shell.exec('nama-sync command remove ' + namespace + ' ' + commandName, {silent:true}, function(code, stdout, stderr) {
          if(code == 0) {
            return alert('Sync sucessful')
          }
          return alert('\x1b[31mERROR\x1b[0m: Problem with sync!')
        });
      }
    }
  },
  syncStatus: () => {
    if(shell.which('nama-sync')) {
      var syncStatus = db.getSyncStatus();
      if(syncStatus && syncStatus['synced_datetime']) {
        alert("\x1b[4mAliaSync\x1b[0m: (nama-sync) last synced:\n" + moment.unix(db.getSyncStatus()['synced_datetime']).format("dddd, MMMM Do YYYY, h:mm:ss a"))
      }
    }
  }
}
