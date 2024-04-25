const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const { Client, Authenticator } = require('minecraft-launcher-core');
const fs = require("fs");
const launcher = new Client();



let mainWindow;
let urlInstance = "/.AuroraCraft/";

function createWindow () {
    mainWindow = new BrowserWindow({
        frame: false,
        title: "AuroraCraft Launcher - 0.1.0",
        width: 1100,
        height: 710,
        resizable: false,
        icon: path.join(__dirname, "/assets/logo.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    mainWindow.loadFile('page/index.html')
    mainWindow.setMenuBarVisibility(false);

}

// CREATION DE L'ONGLET PRINCIPAL
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})

// METTRE EN PETIT L'ONGLET PRINCIPAL
ipcMain.on("manualMinimize", () => {
    mainWindow.minimize();
});

// FERMETURE DE L'ONGLET PRINCIPAL
ipcMain.on("manualClose", () => {
    app.quit();
});


// LANCEMENT DU JEUX
ipcMain.on("login", (event, data) => {


    // CREER L'USER MC
    let User = {
        access_token: '',
        client_token: '',
        uuid: '',
        name: data.pseudo,
        user_properties: '{}',
        meta: {
            // type: "msa",
            type: "mojang",
            demo: false,
            xuid: '',
            clientId: ''
        }
    }


    // CREER LES OPTIONS MC
    let options = {
        clientPackage: "http://tyrolium.fr/Download/TyroServS3/instance.zip", //null,
        authorization: User,
        // https://wiki.vg/Launching_the_game
        customLaunchArgs: [
            // "--useritiumTokenPrivate ",
            // data.token_tyroserv,
            // "--useritiumTokenA2F ",
            // data.token_tyroserv_a2f,
            // "--width",
            // settingsContenu.width,
            // "--height",
            // settingsContenu.height,
        ],
        root: path.join(app.getPath("appData"), urlInstance),
        version: {
            number: "1.12.2",
            type: "release",
            // custom: "Forge 1.12.2"
        },
        forge:path.join(app.getPath("appData"), urlInstance + "Launch.jar"),
        memory: {
            max: "10G",
            min: "4G",
        },
    }
    launcher.launch(options);

    launcher.on('debug', (e) => {
        console.log("debug", e)
        event.sender.send("lancement", e)

        // UPDATE DU REACH PRESENCE
        if (e === "[MCLC]: Set launch options") {
            // setActivity('Joue à AuroraCraft ', data.pseudo);
        }
    });
    launcher.on('data', (e) => {
        console.log("data", e)

        mainWindow.hide();
    });
    launcher.on('progress', (e) => {
        console.log("progress", e);
        event.sender.send("progression", e)
    });
    launcher.on('arguments', (e) => {
        console.log("arguments", e)
    });
    launcher.on('close', (e) => {
        console.log("close", e)

        mainWindow.show();
        event.sender.send("stopping")

        // UPDATE DU REACH PRESENCE
        // setActivity('Navigue sur le Launcher', data.pseudo);
    });
    launcher.on('package-extract', (e) => {
        console.log("package-extract", e)
    });
    launcher.on('download', (e) => {
        console.log("download", e)
    });
    launcher.on('download-status', (e) => {
        // console.log("download-status", e)
        event.sender.send("progressionDownload", e)
    });








});