import { hostContext } from '@/host/state'

export const player: AnyListen_API.Player = {
  async getPlayInfo() {
    return hostContext.hostFuncs.getPlayInfo()
  },
  async playListAction(action) {
    return hostContext.hostFuncs.playListAction(action)
  },
  async playerAction(action) {
    return hostContext.hostFuncs.playerAction(action)
  },
  async playHistoryListAction(action) {
    return hostContext.hostFuncs.playHistoryListAction(action)
  },
}
