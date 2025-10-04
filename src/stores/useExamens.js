// src/stores/useExamens.js
import { makeCrudStore } from './_crudFactory'
import { ExamensService } from '@/services/examens'
export const useExamens = makeCrudStore('examens', ExamensService)
