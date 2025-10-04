// src/stores/useInterros.js
import { makeCrudStore } from './_crudFactory'
import { InterrosService } from '@/services/interros'
export const useInterrosStore = makeCrudStore('interros', InterrosService)
