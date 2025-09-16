// src/composables/useAcl.js
import { computed } from 'vue'
import { useAuthStore, ROLES } from '@/stores/useAuth'

export function useAcl() {
  const auth = useAuthStore()
  const role = computed(() => auth.user?.role)

  const isAdminGen   = computed(() => role.value === ROLES.ADMIN_GENERALE)
  const isAdminEcole = computed (() => role.value === ROLES.ADMIN_ECOLE)
  const isProf       = computed (() => role.value === ROLES.PROFESSEUR)
  const isEleve      = computed (() => role.value === ROLES.ELEVE)

  // Capabilities (UI)
  const canManageUsers      = computed(() => isAdminGen.value)
  const canManageSchools    = computed(() => isAdminGen.value)                 // création d’écoles
  const canManageStructure  = computed(() => isAdminGen.value || isAdminEcole.value) // périodes/semestres/classes/cours
  const canEditPedago       = computed(() => isProf.value || isAdminEcole.value || isAdminGen.value)
  const canReadPedago       = computed(() => !!role.value) // tout utilisateur connecté

  return {
    role, isAdminGen, isAdminEcole, isProf, isEleve,
    canManageUsers, canManageSchools, canManageStructure, canEditPedago, canReadPedago
  }
}
