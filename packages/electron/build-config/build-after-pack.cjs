const fs = require('fs').promises

const macLanguagesInfoPlistStrings = {
  en: {
    CFBundleDisplayName: 'LX Music',
    CFBundleName: 'LX Music',
  },
  zh_CN: {
    CFBundleDisplayName: 'LX Music',
    CFBundleName: 'LX Music',
  },
  zh_TW: {
    CFBundleDisplayName: 'LX Music',
    CFBundleName: 'LX Music',
  },
}

// https://github.com/electron-userland/electron-builder/issues/4630
// https://github.com/electron-userland/electron-builder/issues/4630#issuecomment-782020139

module.exports = async (context) => {
  const { electronPlatformName, appOutDir, packager } = context
  if (electronPlatformName !== 'darwin') return

  const resPath = `${appOutDir}/${packager.appInfo.productFilename}.app/Contents/Resources`

  // 创建APP语言包文件
  return Promise.all(
    Object.entries(macLanguagesInfoPlistStrings).map(([lang, config]) => {
      let infos = Object.entries(config)
        .map(([k, v]) => `"${k}" = "${v}";`)
        .join('\n')
      return fs.writeFile(`${resPath}/${lang}.lproj/InfoPlist.strings`, infos)
    })
  )
}
