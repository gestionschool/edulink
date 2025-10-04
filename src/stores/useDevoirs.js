// src/stores/useDevoirs.js
import { makeCrudStore } from './_crudFactory'
import { DevoirsService } from '@/services/devoirs'
export const useDevoirs = makeCrudStore('devoirs', DevoirsService)
