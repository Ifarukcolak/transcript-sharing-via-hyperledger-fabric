module.exports = {
    getDesktopPath: () => {
        const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
        return desktopPath;
    }
}