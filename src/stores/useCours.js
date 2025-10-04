// src/stores/useCours.js
import { makeCrudStore } from './_crudFactory'
import { CoursService } from '@/services/cours'
export const useCoursStore = makeCrudStore('cours', CoursService)
