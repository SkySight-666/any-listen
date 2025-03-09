import { findMusic } from './search/music/actions'
import { services } from './shared'
import { buildExtSourceId, getExtSource } from './utils'

export const searchMusicLyric = async ({
  extensionId,
  source,
  name,
  artist,
  interval,
}: {
  extensionId: string
  source: string
  name: string
  artist?: string
  interval?: number
}): Promise<AnyListen.Music.LyricInfo[]> => {
  // console.log(extensionId, source, name, artist, interval)
  if (!name.trim().length) return []
  return services.extensionSerive
    .resourceAction('lyricSearch', {
      extensionId,
      source,
      name,
      artist,
      interval,
    })
    .then((result) => {
      // console.log(result)
      return result
    })
}

export const getMusicLyricByExtensionSource = async ({
  extensionId,
  source,
  musicInfo,
}: {
  extensionId: string
  source: string
  musicInfo: AnyListen.Music.MusicInfo
}): Promise<AnyListen.Music.LyricInfo> => {
  return services.extensionSerive
    .resourceAction('lyric', {
      extensionId,
      source,
      musicInfo,
    })
    .then((result) => {
      // console.log(result)
      if (!result.lyric) throw new Error('Get music lyric failed')
      return result
    })
}

const handleGetMusicLyric = async (
  {
    musicInfo,
  }: {
    musicInfo: AnyListen.Music.MusicInfoOnline
  },
  excludeList: string[] = []
): Promise<AnyListen.Music.LyricInfo> => {
  const source = getExtSource('lyric', excludeList, musicInfo.meta.source)
  if (!source) throw new Error('Get url failed, no, source')
  return getMusicLyricByExtensionSource({
    extensionId: source.extensionId,
    source: source.id,
    musicInfo,
  }).catch(async (e) => {
    console.error(e)
    excludeList.push(buildExtSourceId(source.extensionId, source.id))
    return handleGetMusicLyric({ musicInfo }, excludeList)
  })
}

const handleFindMusicLyric = async (
  info: {
    name: string
    singer: string
    albumName: string
    interval: string | null
  },
  excludeList: string[] = []
): Promise<AnyListen.Music.LyricInfo> => {
  const source = getExtSource('musicSearch', excludeList)
  if (!source) throw new Error('Get url failed, no source')
  const music = await findMusic({ extensionId: source.extensionId, source: source.id, ...info })
  if (music) {
    try {
      return await handleGetMusicLyric({ musicInfo: music })
    } catch (e) {
      console.error(e)
    }
  }
  excludeList.push(buildExtSourceId(source.extensionId, source.id))
  return handleFindMusicLyric(info, excludeList)
}

export const getMusicLyric = async (data: { musicInfo: AnyListen.Music.MusicInfo }): Promise<AnyListen.Music.LyricInfo> => {
  if (!data.musicInfo.isLocal) {
    try {
      return await handleGetMusicLyric({ musicInfo: data.musicInfo })
    } catch {}
  }
  return handleFindMusicLyric({
    name: data.musicInfo.name,
    singer: data.musicInfo.singer,
    albumName: data.musicInfo.meta.albumName,
    interval: data.musicInfo.interval,
  })
}
