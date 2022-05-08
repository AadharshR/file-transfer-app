const fs = require('fs')
const util = require('util')
const path = require('path')
const copyFile = util.promisify(fs.copyFile)
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const process = require('process');
const sourceFolder = process.argv[2];
const destFolder = process.argv[3];
const stringToMatch = process.argv[4];
async function createFolderIfNotExists(newPath) {
    if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath);
    }
    return;
}

async function move() {
    fs.readdir(sourceFolder, (err, files) => {
        files.forEach(async file => {
            if (file.includes(stringToMatch)) {
                const destPath = path.join(destFolder, file)
                try {
                    await createFolderIfNotExists(destFolder);
                    await rename(file, destPath)
                } catch (err) {
                    try {
                        if (err.code === 'EXDEV') {
                            // we need to copy if the destination is on another parition
                            const completeCurrentPath = path.join(sourceFolder, file)

                            await copyFile(completeCurrentPath, destPath)
                            // delete the old file if copying was successful
                            await unlink(completeCurrentPath);
                        } else {
                            // re throw the error if it is another error
                            throw err
                        }
                    }
                    catch (e) {
                        console.log("e", e)
                    }

                }
            }
        });
    });
}
move();
