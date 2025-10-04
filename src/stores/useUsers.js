// src/stores/useUsers.js
import { makeCrudStore } from './_crudFactory'
import { UsersService } from '@/services/users'
export const useUsersStore = makeCrudStore('users', UsersService)
