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

    tray.on("click", (_, bounds) => {
        if (!window || !bounds) return;

        const { x, y, width, height } = bounds;
        const { width: w } = window.getBounds();

        window.setPosition(
            Math.round(x + width / 2 - w / 2),
            Math.round(y + height + 5),
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

    app.isPackaged
        ? window.loadFile(path.join(process.resourcesPath, "renderer", "index.html"))
        : window.loadURL("http://localhost:5173");

    window.on("blur", () => window?.hide());
}

app.whenReady().then(() => {
    createTray();
    createWindow();
});