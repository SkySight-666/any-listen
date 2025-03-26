import getStore from '@/app/shared/store'
import { DATA_KEYS, STORE_NAMES } from '@any-listen/common/constants'
import type { ExposeClientFunctions } from '.'
import { updateIgnoreVersion } from '../autoUpdate'

// 暴露给前端的方法
export const createExposeData = () => {
  return {
    async getLastStartInfo(event) {
      return getStore(STORE_NAMES.DATA).get(DATA_KEYS.lastStartInfo)
    },
    async saveLastStartInfo(event, version) {
      getStore(STORE_NAMES.DATA).set(DATA_KEYS.lastStartInfo, version)
    },

    async getListPrevSelectId(event) {
      return getStore(STORE_NAMES.DATA).get(DATA_KEYS.listPrevSelectId)
    },
    async saveListPrevSelectId(event, id) {
      getStore(STORE_NAMES.DATA).set(DATA_KEYS.listPrevSelectId, id)
    },

    async getSearchHistoryList(event) {
      return getStore(STORE_NAMES.DATA).get(DATA_KEYS.searchHistoryList)
    },
    async saveSearchHistoryList(event, list) {
      getStore(STORE_NAMES.DATA).set(DATA_KEYS.searchHistoryList, list)
    },

    async saveIgnoreVersion(event, ver) {
      getStore(STORE_NAMES.DATA).set(DATA_KEYS.ignoreVersion, ver)
      updateIgnoreVersion(ver)
    },
  } satisfies Partial<ExposeClientFunctions>
}
