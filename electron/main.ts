import { app, Tray, BrowserWindow, nativeImage } from "electron";
import * as path from "path";
import isDev from "electron-is-dev";

let tray: Tray | null = null;
let window: BrowserWindow | null = null;

const createTray = () => {
    const iconPath = path.join(app.getAppPath(), "public", "tray.png");

    const icon = nativeImage.createFromPath(iconPath);
    icon.setTemplateImage(true);

    tray = new Tray(icon);
    tray.setToolTip("Simple Timer");

    tray.on("click", () => toggleWindow());
};

const setWindowPosition = () => {
    if (!tray || !window) return;

    const trayBounds = tray.getBounds();
    const windowBounds = window.getBounds();

    const x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );

    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    window.setPosition(x, y, false);
}

const toggleWindow = () => {
    if (!window) return;

    window.isVisible()
        ? window.hide()
        : (window.show(), setWindowPosition());
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 300,
        height: 450,
        frame: false,
        resizable: false,
        show: false,
        alwaysOnTop: true,
        fullscreenable: false,
        webPreferences: {
            /** */
        },
    });

    window.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true,
    });

    window.loadURL(
        isDev
            ? "http://localhost:5173"
            : `file://${path.join(app.getAppPath(), "dist", "index.html")}`
    );
};

app.whenReady().then(() => {
    createTray();
    createWindow();
});