// src/stores/useUsers.js
import { makeCrudStore } from './_crudFactory'
import { UsersService } from '@/services/users'
export const useUsers = makeCrudStore('users', UsersService)
