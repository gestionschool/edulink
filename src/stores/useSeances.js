// src/stores/useSeances.js
import { makeCrudStore } from './_crudFactory'
import { SeancesService } from '@/services/seances'
export const useSeances = makeCrudStore('seances', SeancesService)
