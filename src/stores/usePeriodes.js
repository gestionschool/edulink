// src/stores/usePeriodes.js
import { makeCrudStore } from './_crudFactory'
import { PeriodesService } from '@/services/periodes'
export const usePeriodesStore = makeCrudStore('periodes', PeriodesService)
