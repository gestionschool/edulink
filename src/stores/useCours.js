// src/stores/useCours.js
import { makeCrudStore } from './_crudFactory'
import { CoursService } from '@/services/cours'
export const useCours = makeCrudStore('cours', CoursService)
