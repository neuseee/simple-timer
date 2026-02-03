import { app, BrowserWindow, nativeImage, Tray } from "electron";
import isDev from "electron-is-dev";
import path from "path";

let tray: Tray | null = null;
let window: BrowserWindow | null = null;

const getWindowPosition = () => {
    if (!window || !tray) return { x: 0, y: 0 };

    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();

    const x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );

    const y = Math.round(
        trayBounds.y + trayBounds.height + 4
    );

    return { x, y };
}

const toggleWindow = () => {
    if (!window) return;

    const { x, y } = getWindowPosition();

    window.setBounds({
        x,
        y,
        width: window.getBounds().width,
        height: window.getBounds().height
    });

    window.isVisible()
        ? window.hide()
        : (window.show(), window.focus());
}

const createTray = () => {
    const iconPath = isDev
        ? path.join(process.cwd(), "public", "tray.png")
        : path.join(process.resourcesPath, "assets", "tray.png");

    const icon = nativeImage.createFromPath(iconPath);
    icon.setTemplateImage(true);

    tray = new Tray(icon);
    tray.setToolTip("Simple Timer");

    tray.on("click", () => toggleWindow());
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 300,
        height: 450,
        show: false,
        frame: false,
        resizable: false,
        webPreferences: {

        }
    });

    window.loadURL(
        isDev
            ? "http://localhost:5173"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    window.on("blur", () => window?.hide());
}

app.on("ready", () => {
    if (process.platform === "darwin") {
        app.dock?.hide();
    }

    createTray();
    createWindow();
});