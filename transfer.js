const fs = require('fs')
const util = require('util')
const path = require('path')
const copyFile = util.promisify(fs.copyFile)
const rename = util.promisify(fs.rename)
const unlink = util.promisify(fs.unlink)

async function createFolderIfNotExists (newPath) {
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath)
  }
}

async function validateRequest (body) {
  if (body.sourceFolder === null || body.sourceFolder === undefined) {
    return {
      message: 'Source Folder is missing'
    }
  }
  if (body.destFolder === null || body.destFolder === undefined) {
    return {
      message: 'Destination Folder is missing'
    }
  }
  if (body.patternToMatch === null || body.patternToMatch === undefined) {
    return {
      message: 'Pattern is missing'
    }
  }
  return null
}

async function handleStatus (errors, res, validator) {
  if (errors.length === 0 && validator.numberOfFiles === 0) {
    return res.status(400).json({ message: 'There was no files to match with the given pattern' })
  }

  if (errors.length === 0) {
    return res.status(200).json({ message: 'Files are successfully moved' })
  } else if (errors.length >= 0) {
    return res.status(500).json({ message: 'There were some errors moving these files', errors })
  }
};

async function copyFiles (context) {
  let {
    files,
    patternToMatch,
    matchedFiles,
    destFolder,
    res,
    sourceFolder
  } = context
  files.forEach(async file => {
    if (file.includes(patternToMatch)) {
      matchedFiles++
      const destPath = path.join(destFolder, file)
      try {
        await createFolderIfNotExists(destFolder)
        await rename(file, destPath)
      } catch (err) {
        try {
          if (err.code === 'EXDEV') {
            const completeCurrentPath = path.join(sourceFolder, file)
            await copyFile(completeCurrentPath, destPath)
            await unlink(completeCurrentPath)
          } else {
            console.log('error', err)
            throw err
          }
        } catch (e) {
          return res.status(500).json({ message: 'Something went wrong, check the logs' })
        }
      }
    }
  })
  return matchedFiles
}

async function transfer (req, res) {
  const {
    sourceFolder,
    destFolder,
    patternToMatch
  } = req.body

  const validationResponse = await validateRequest(req.body)
  if (validationResponse) {
    return res.status(400).json(validationResponse)
  }
  fs.readdir(sourceFolder, async (err, files) => {
    if (err) {
      console.log('Error', err)
      return res.status(500).json({ message: 'There was an error reading the directory' })
    }
    const matchedFiles = 0
    const errors = []
    const contextBody = {
      res,
      matchedFiles,
      files,
      sourceFolder,
      destFolder,
      patternToMatch
    }
    const numberOfFiles = await copyFiles(contextBody)

    const validator = {
      numberOfFiles
    }
    await handleStatus(errors, res, validator)
  })
}

module.exports = {
  transfer
}
