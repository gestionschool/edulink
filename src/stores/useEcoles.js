// src/stores/useEcoles.js
import { makeCrudStore } from './_crudFactory'
import { EcolesService } from '@/services/ecoles'
export const useEcoles = makeCrudStore('ecoles', EcolesService)
