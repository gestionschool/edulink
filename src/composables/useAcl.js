// composables/useAcl.js
import { ROLES } from '@/types/roles'
export function can(user, perm) {
  if (!user) return false
  const role = user.role
  const MAP = {
    // Supervise tout
    [ROLES.SUPER_ADMIN]: [
      'schools:*', 'users:*', 'reports:global', 'periods:*', 'semesters:*'
    ],
    // Gère sa propre école
    [ROLES.SCHOOL_ADMIN]: [
      'classes:*', 'students:*', 'teachers:*', 'courses:*',
      'timetable:*', 'evaluations:*', 'periods:*', 'semesters:*',
      'presence:*', 'reports:school'
    ],
    // Prof
    [ROLES.TEACHER]: [
      'my:classes:read', 'presence:mark', 'evaluations:create',
      'notes:edit', 'bulletins:read'
    ],
  }
  const allowed = MAP[role] || []
  if (allowed.includes('*')) return true
  const [res, act='read'] = perm.split(':')
  return allowed.some(p => {
    if (p === `${res}:${act}`) return true
    if (p === `${res}:*`) return true
    if (p.endsWith(':*') && p.split(':')[0] === res) return true
    return false
  })
}
