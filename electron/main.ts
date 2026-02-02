import { app, Tray, BrowserWindow, nativeImage, screen } from "electron";
import path from "path";
import isDev from "electron-is-dev";

let tray: Tray | null = null;
let window: BrowserWindow | null = null;

function createTray() {
    const iconPath = isDev
        ? path.join(process.cwd(), "public", "tray.png")
        : path.join(process.resourcesPath, "tray.png");

    const icon = nativeImage.createFromPath(iconPath);
    icon.setTemplateImage(true);

    tray = new Tray(icon);
    tray.setToolTip("simple timer");

    tray.on("click", (_, bounds) => {
        if (!window || !bounds) return;

        const { x, y } = bounds;

        window.setPosition(
            Math.round(x), 
            Math.round(y),
            false,
        );

        window.isVisible()
            ? window.hide()
            : (window.show(), window.focus());
    });
}

function createWindow() {
    window = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: "simple timer",
    });

    window.loadURL(
        isDev
            ? "http://localhost:5173"
            : `file://${ path.join(process.resourcesPath, "renderer", "index.html") }`,
    );

    window.on("blur", () => window?.hide());
}

app.whenReady().then(() => {
    createTray();
    createWindow();
});