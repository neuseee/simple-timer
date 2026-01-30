import { app, Tray, BrowserWindow, nativeImage } from "electron";
import path from "path";

let tray: Tray | null = null;
let window: BrowserWindow | null = null;

function createTray() {

    const iconPath = app.isPackaged
        ? path.join(process.resourcesPath, "icon.png")
        : path.join(process.cwd(), "public", "icon.png");

    const icon = nativeImage.createFromPath(iconPath);
    icon.setTemplateImage(true);

    tray = new Tray(icon);
    tray.setToolTip("심플 타이머");

    tray.on("click", () => {
        if (!window) return;
        window.isVisible() ? window.hide() : window.show();
    });
}

function createWindow() {
    window = new BrowserWindow({
        width: 400,
        height: 400,
        show: false,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    window.loadFile("index.html");

    window.on("blur", () => {
        if (window) window.hide();
    });
}

app.whenReady().then(() => {
    createTray();
    createWindow();
});