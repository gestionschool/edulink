
// src/stores/useClasses.js
import { makeCrudStore } from './_crudFactory'
import { ClassesService } from '@/services/classes'
export const useClasses = makeCrudStore('classes', ClassesService)
