// src/stores/useTeachers.js
import { makeCrudStore } from './_crudFactory'
import { TeachersService } from '@/services/teachers'
export const useTeachers = makeCrudStore('teachers', TeachersService)
