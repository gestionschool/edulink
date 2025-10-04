// src/stores/useStudents.js
import { makeCrudStore } from './_crudFactory'
import { StudentsService } from '@/services/students'
export const useStudents = makeCrudStore('students', StudentsService)
