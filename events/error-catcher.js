//Do more..
const chalk = require("chalk"); // Importing Chalk from Chalk

process.on("unhandledRejection", (reason, p) => {
    console.log(
        chalk.yellow('——————————[Unhandled Rejection/Catch]——————————\n'),
        reason, p
    )
})

process.on("uncaughtException", (err, origin) => {
    console.log(
        chalk.yellow('——————————[Uncaught Exception/Catch]——————————\n'),
        err, origin
    )
})


process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(
        chalk.yellow('——————————[Uncaught Exception/Catch (MONITOR)]——————————\n'),
        err, origin
    )
})


process.on("warning", (warn) => {
    console.log(
        chalk.yellow('——————————[Warning]——————————\n'),
    )
})