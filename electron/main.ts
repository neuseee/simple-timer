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
    tray.setToolTip("simple timer");

    tray.on("click", () => {
        if (!window) return;

        if (window.isVisible()) {
            window.hide();
        } else {
            setWindowPosition();
            window.show();
            window.focus();
        }
    });
}

function createWindow() {
    window = new BrowserWindow({
        width: 300,
        height: 300,
        show: false,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    window.on("blur", () => {
        window?.hide();
    });
}

function setWindowPosition() {
    if (!tray || !window ) return;

    const trayBounds = tray.getBounds();
    const windowBounds = window.getBounds();

    const x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );

    const y = Math.round(
        trayBounds.y + trayBounds.height + 4
    );

    window.setPosition(x, y, false);
}

app.whenReady().then(() => {
    createTray();
    createWindow();
});