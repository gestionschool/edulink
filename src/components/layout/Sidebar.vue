<!-- src/components/layout/Sidebar.vue -->
<template>
  <div class="h-full flex flex-col">
    <!-- Brand -->
    <div class="px-4 h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v10H6V11H3l9-8z"/></svg>
        <span>Edulink</span>
      </RouterLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <div v-for="section in filteredSections" :key="section.title" class="space-y-2 mb-4">
        <div class="sr-only">{{ section.title }}</div>

        <div v-for="item in section.items" :key="item.key ?? item.to" class="space-y-1">
          <!-- Groupe avec sous-liens -->
          <template v-if="item.children?.length">
            <button
              type="button"
              @click="toggle(item.key)"
              :aria-expanded="isOpen(item.key) ? 'true' : 'false'"
              :aria-controls="`group-${item.key}`"
              class="w-full flex items-center justify-between px-4 h-12 rounded-2xl text-[15px] font-semibold
                     transition-colors bg-violet-50 text-violet-700 hover:bg-violet-100
                     dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50"
              :class="isAnyChildActive(item) ? 'ring-1 ring-violet-300/60 dark:ring-violet-400/30' : ''"
            >
              <span class="inline-flex items-center gap-3">
                <span class="h-5 w-5" v-html="iconSvg(item.icon)"></span>
                <span>{{ item.label }}</span>
              </span>
              <svg class="h-5 w-5 transition-transform" :class="{ 'rotate-180': isOpen(item.key) }" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" clip-rule="evenodd"/>
              </svg>
            </button>

            <transition name="fade">
              <ul :id="`group-${item.key}`" v-show="isOpen(item.key)" class="pl-6 pt-2 space-y-2">
                <li v-for="child in item.children" :key="child.to">
                  <RouterLink
                    :to="child.to"
                    class="block px-4 py-2 text-[15px] rounded-md text-slate-600 hover:text-violet-700 hover:bg-slate-100
                           dark:text-slate-300 dark:hover:text-violet-200 dark:hover:bg-white/5"
                    :class="isActive(child.prefix) ? 'text-violet-700 font-semibold dark:text-violet-200' : ''"
                    @click="$emit('navigate')"
                  >
                    {{ child.label }}
                  </RouterLink>
                </li>
              </ul>
            </transition>
          </template>

          <!-- Lien direct -->
          <template v-else>
            <RouterLink
              :to="item.to"
              class="w-full flex items-center justify-between px-4 h-12 rounded-2xl text-[15px] font-semibold
                     transition-colors bg-violet-50 text-violet-700 hover:bg-violet-100
                     dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50"
              :class="isActive(item.prefix) ? 'ring-1 ring-violet-300/60 dark:ring-violet-400/30' : ''"
              @click="$emit('navigate')"
            >
              <span class="inline-flex items-center gap-3">
                <span class="h-5 w-5" v-html="iconSvg(item.icon)"></span>
                <span>{{ item.label }}</span>
              </span>
              <svg class="h-5 w-5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.22 14.28a.75.75 0 0 1 0-1.06L10.44 10 7.22 6.78a.75.75 0 1 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0z" clip-rule="evenodd"/>
              </svg>
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { ROLES } from '@/types/roles'

defineEmits(['navigate'])

const route = useRoute()
const auth = useAuthStore()
const currentRole = computed(() => auth.role ?? auth.user?.role ??  null)

// --------- helpers robustes ----------
const roleCode = (r) => {
  // supporte string, {code:'...'}, {value:'...'}, enums, etc.
  if (typeof r === 'string') return r.trim()
  if (r && typeof r === 'object') {
    return (r.code ?? r.value ?? r.key ?? String(r)).trim()
  }
  return String(r ?? '').trim()
}

const hasRole = (allowed, role) => {
  // public si pas de roles
  if (!allowed || !Array.isArray(allowed) || allowed.length === 0) return true
  if (!role) return false
  const me = roleCode(role)
  const list = allowed.map(roleCode)
  return list.includes(me)
}


/* ===== MENU MVP (6 groupes) ===== */
const sections = [
  // ─── 👑 Admin général ──────────────────────────────────────────────
  { title: 'Admin général', items: [
    {
      key: 'saas-admin',
      label: 'Administration globale',
      icon: 'shield',
      roles: [ROLES.ADMIN_GENERALE],
      children: [
        { to: '/admin/ecoles',       prefix: '/admin/ecoles',       label: 'Écoles' },
        { to: '/admin/utilisateurs', prefix: '/admin/utilisateurs', label: 'Utilisateurs' },
      ],
    },
  ]},

  // ─── 🏫 Admin école (inclut Académique) ────────────────────────────
  { title: 'Admin école', items: [
    {
      key: 'ecole-structure',
      label: 'Structure académique',
      icon: 'layers',
      roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
      children: [
        { to: '/classes',  prefix: '/classes',  label: 'Classes' },
        { to: '/filieres', prefix: '/filieres', label: 'Filières' },
        { to: '/niveaux',  prefix: '/niveaux',  label: 'Niveaux' },
        { to: '/emplois',  prefix: '/emplois',  label: 'Emplois du temps' },
      ],
    },
    {
      key: 'ecole-communautes',
      label: 'Communautés',
      icon: 'building',
      roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
      children: [
        { to: '/communautes/etudiants',   prefix: '/communautes/etudiants',   label: 'Élèves' },
        { to: '/communautes/professeurs', prefix: '/communautes/professeurs', label: 'Professeurs' },
      ],
    },
  ]},

  // ─── 👨‍🏫 Pédagogie (prof + supervision admin) ─────────────────────
  { title: 'Pédagogie', items: [
    {
      key: 'pedago',
      label: 'Pédagogie',
      icon: 'book',
      roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR],
      children: [
        { to: '/cours',     prefix: '/cours',     label: 'Cours' },
        { to: '/devoirs',   prefix: '/devoirs',   label: 'Devoirs' },
        { to: '/interros',  prefix: '/interros',  label: 'Interrogations' },
        { to: '/examens',   prefix: '/examens',   label: 'Examens' },
        { to: '/notes',     prefix: '/notes',     label: 'Saisie des notes' },
        { to: '/bulletins', prefix: '/bulletins', label: 'Bulletins' },
      ],
    },
  ]},

  // ─── 📊 Rapports ───────────────────────────────────────────────────
  { title: 'Rapports', items: [
    {
      key: 'reports',
      label: 'Rapports & Stats',
      icon: 'chart',
      roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
      children: [
        { to: '/rapports/academiques', prefix: '/rapports/academiques', label: 'Académiques' },
        { to: '/rapports/presences',   prefix: '/rapports/presences',   label: 'Présences' },
      ],
    },
  ]},
]


/* ===== Filtrage par rôle ===== */
const filteredSections = computed(() => {
  const role = currentRole.value
  const out = sections
    .map(sec => ({
      ...sec,
      items: sec.items.filter(it => hasRole(it.roles, role)),
    }))
    .filter(sec => sec.items.length > 0)

  // debug optionnel :
  // console.log('role=', roleCode(role))
  // out.forEach(s => s.items.forEach(i => console.log('kept:', i.key, i.roles?.map(roleCode))))
  return out
})


/* ===== Ouverture/fermeture des groupes ===== */
const groupsState = reactive({})

// index rapide: key -> item
const itemByKey = computed(() => {
  const m = {}
  sections.forEach(sec => sec.items.forEach(it => { if (it.key) m[it.key] = it }))
  return m
})

function isAnyChildActive(item){ return item.children?.some(c => isActive(c.prefix)) }
function ensureInit(key){
  if (key in groupsState) return
  const it = itemByKey.value[key]
  groupsState[key] = !!(it?.children && isAnyChildActive(it))
}
function isOpen(key){ ensureInit(key); return !!groupsState[key] }
function toggle(key){ ensureInit(key); groupsState[key] = !groupsState[key] }

/* Ouvre automatiquement le groupe qui correspond à la route active */
watch(() => route.path, () => {
  Object.keys(itemByKey.value).forEach(k => {
    const it = itemByKey.value[k]
    groupsState[k] = !!(it?.children && isAnyChildActive(it))
  })
}, { immediate: true })

/* ===== Actifs ===== */
function isActive(prefix){
  return !!prefix && (route.path === prefix || route.path.startsWith(prefix + '/'))
}

/* ===== Icônes inline ===== */
function iconSvg(name){
  const icons = {
    shield:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 4v6c0 5-3.5 9.74-8 10-4.5-.26-8-5-8-10V6l8-4z"/></svg>',
    building:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18V3H3v18zm2-2V5h14v14H5zM7 7h4v4H7V7z"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z"/></svg>',
    layers:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 11-6-11-6zm0 9L1 18l11 6 11-6-11-6z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V2zM6 4h10v14H6a2 2 0 0 0-2 2V4z"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3zM8 13h2v8H8zM13 9h2v12h-2zM18 5h2v16h-2z"/></svg>',
  }
  return icons[name] ?? icons.layers
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
