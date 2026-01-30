import { app, Tray, BrowserWindow, nativeImage } from "electron";

let tray: Tray | null = null;
let window: BrowserWindow | null = null;

function createTray() {
    tray = new Tray(nativeImage.createEmpty());

    tray.setTitle("00:00:25");
}

function createWindow() {
    /**
     * 
     */
}

app.whenReady().then(() => {
    createTray();
});