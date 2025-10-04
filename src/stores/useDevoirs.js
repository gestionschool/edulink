// src/stores/useDevoirs.js
import { makeCrudStore } from './_crudFactory'
import { DevoirsService } from '@/services/devoirs'
export const useDevoirsStore = makeCrudStore('devoirs', DevoirsService)
