// src/stores/useEvaluations.js
import { makeCrudStore } from './_crudFactory'
import { EvaluationsService } from '@/services/evaluations'
export const useEvaluations = makeCrudStore('evaluations', EvaluationsService)
