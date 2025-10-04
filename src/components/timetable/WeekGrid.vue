<!-- src/components/timetable/WeekGrid.vue -->
<template>
  <div
    class="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    :style="{
      '--time-col':'64px',
      '--cols': days.length,
      '--total-mins': totalMins,
      '--minute-h': minuteH + 'px'
    }"
  >
    <!-- En-têtes -->
    <div class="grid border-b border-slate-100 dark:border-slate-800"
         :style="{ gridTemplateColumns:`var(--time-col) repeat(${days.length}, 1fr)` }">
      <div class="h-12"></div>
      <div v-for="(d,i) in days" :key="i" class="h-12 flex items-center justify-center text-sm font-medium">
        {{ d }}
      </div>
    </div>

    <!-- Corps -->
    <div class="grid"
         :style="{ gridTemplateColumns:`var(--time-col) repeat(${days.length}, 1fr)` }">
      <!-- Colonne temps -->
      <div class="relative">
        <div v-for="h in hours" :key="h" class="h-[48px] flex items-start justify-end pr-2 text-xs text-slate-500 dark:text-slate-400">
          <span class="translate-y-[-6px]">{{ h }}:00</span>
        </div>
      </div>

      <!-- Colonnes jours -->
      <div v-for="(d,i) in days" :key="i" class="relative border-l border-slate-100 dark:border-slate-800">
        <!-- lignes de fond heure -->
        <div v-for="h in hours" :key="h" class="h-[48px] border-b border-dashed border-slate-100 dark:border-slate-800"></div>

        <!-- séances du jour -->
        <div v-for="ev in dayEvents(i+startDay)" :key="ev.id"
             class="absolute left-1 right-1 rounded-md border px-2 py-1 text-xs shadow-sm
                    bg-violet-600 text-white border-violet-500 dark:bg-violet-500 dark:border-violet-400"
             :style="styleEvent(ev)"
             @click="$emit('edit', ev)">
          <div class="font-semibold truncate">
            {{ ev.label || ev.matiere || ev.intitule || 'Séance' }}
          </div>
          <div class="opacity-90">
            {{ ev.start }}–{{ ev.end }} <span v-if="ev.salle">• {{ ev.salle }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Légende / action -->
    <div class="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-xs dark:border-slate-800">
      <span class="text-slate-500 dark:text-slate-400">Cliquer une séance pour modifier</span>
      <button class="rounded-md border border-violet-200 bg-violet-600 px-2 py-1 text-white dark:border-violet-900"
              @click="$emit('create')">Ajouter une séance</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sessions: { type: Array, default: () => [] }, // [{ id, jour, start, end, ... }]
  startHour: { type: Number, default: 7 },
  endHour:   { type: Number, default: 18 },
  days:      { type: Array,  default: () => ['Lun','Mar','Mer','Jeu','Ven','Sam'] },
  startDay:  { type: Number, default: 1 }, // 1=Mon
})
defineEmits(['create','edit'])

const hours = Array.from({ length: (props.endHour - props.startHour) }, (_,i) => i + props.startHour)
const totalMins = (props.endHour - props.startHour) * 60
const minuteH = 48 / 60 // 48px = 1h → 0.8px/min

function toMin(t){ const [H,M] = String(t).split(':').map(Number); return H*60+M }
function topFor(t){ return (toMin(t) - props.startHour*60) * minuteH }
function heightFor(s,e){ return (toMin(e) - toMin(s)) * minuteH }

function dayEvents(j){ return (props.sessions||[]).filter(ev => Number(ev.jour) === Number(j)) }
function styleEvent(ev){
  return {
    top:    topFor(ev.start) + 'px',
    height: heightFor(ev.start, ev.end) + 'px',
  }
}
</script>
