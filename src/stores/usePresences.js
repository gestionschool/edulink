// src/stores/usePresences.js
import { makeCrudStore } from './_crudFactory'
import { PresencesService } from '@/services/presences'

export const usePresences = makeCrudStore('presences', PresencesService)
