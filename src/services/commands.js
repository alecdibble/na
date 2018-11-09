const acc = require('./accessors')
const alert = require('./alert')

let noNameError = `Error: Please supply a valid command name.

Example:

  na create test test-alias "cd ~/"

  - Will create an alias called test-alias in the test namespace
    that will change to the home directory
`;

let commandDoesntExistError = `Error: Supplied command doesn't exist`;

module.exports = { 
  create: (args) => {
    if(args._.length < 4) {
      return alert(noNameError)
    }

    let namespace = args._[1]
    let name = args._[2]
    let command = args._[3]

    acc.writeCommand(namespace, name, command)
  },

  list: (args) => {
    let namespace = args._[0]
    let currentCommands = acc.getCommands(namespace)
    
    if(currentCommands < 1) { 
      return alert(`Error: No commands have been created for namespace: ${namespace} `)
    }
    alert(`Aliases for ${namespace} namespace: \n`) 
    commandString = Object.keys(currentCommands).map(key => '  ' + key.padEnd(12) + '   ' + currentCommands[key]).filter(v => v).join(', ');
    return alert(commandString) 
  },

  run: (args) => {
    let namespace = args._[0]
    let name = args._[1]
    let currentCommand = acc.getCommand(namespace, name)
    if(!currentCommand) {
      return alert(commandDoesntExistError)
    }
    return alert(currentCommand, 'run')
  },
}