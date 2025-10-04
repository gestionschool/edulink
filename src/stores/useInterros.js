// src/stores/useInterros.js
import { makeCrudStore } from './_crudFactory'
import { InterrosService } from '@/services/interros'
export const useInterros = makeCrudStore('interros', InterrosService)
