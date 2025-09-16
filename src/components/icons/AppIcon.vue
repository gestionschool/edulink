<template>
  <svg v-if="name==='home'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 12l9-9 9 9-1.5 1.5L12 5.5 4.5 13.5 3 12z"/><path d="M4.5 13.5V21h6v-5h3v5h6v-7.5L12 6z"/>
  </svg>

  <svg v-else-if="name==='users'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11a3 3 0 100-6 3 3 0 000 6zM8 11a3 3 0 100-6 3 3 0 000 6z"/><path d="M8 13c-2.67 0-8 1.34-8 4v3h12v-3c0-2.66-5.33-4-8-4zm16 4c0-2.66-5.33-4-8-4-.7 0-1.37.04-2 .12 2.39 1.03 4 2.58 4 4.88v3h6v-4z"/>
  </svg>

  <svg v-else-if="name==='student'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3l9 4.5-9 4.5L3 7.5 12 3z"/><path d="M4.5 8.5V12c0 3.5 3.5 6.5 7.5 6.5s7.5-3 7.5-6.5V8.5L12 11z"/>
  </svg>

  <svg v-else-if="name==='classroom'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6h16v10H4z"/><path d="M2 18h20v2H2zM7 8h6v2H7z"/>
  </svg>

  <svg v-else-if="name==='book'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h9a3 3 0 013 3v11H9a3 3 0 00-3 3V4z"/><path d="M9 18h9"/>
  </svg>

  <svg v-else-if="name==='task'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 11l3 3L21 5l-2-2-7 7-3-3-2 2z"/><path d="M3 21h18v-2H3v2z"/>
  </svg>

  <svg v-else-if="name==='quiz'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 17h2v-2h-2v2zm1-11a3 3 0 00-3 3h2a1 1 0 112 0c0 .7-.64 1.16-1.5 1.75C10.45 11.45 10 12 10 13v1h2v-1c0-.5.11-.69.5-1 1.16-.9 2.5-1.84 2.5-3.5A3 3 0 0012 6z"/>
  </svg>

  <svg v-else-if="name==='calendar'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v2H5a2 2 0 00-2 2v2h18V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7z"/><path d="M21 10H3v10a2 2 0 002 2h14a2 2 0 002-2V10z"/>
  </svg>

  <svg v-else-if="name==='shield'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l8 4v6c0 5-3.5 9.74-8 11-4.5-1.26-8-6-8-11V6l8-4z"/><path d="M12 6v12"/>
  </svg>

  <svg v-else-if="name==='plus'" xmlns="http://www.w3.org/2000/svg" :class="cls" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  class: { type: String, default: '' }
})
// permettre de passer des classes Tailwind depuis le parent
const cls = props.class || 'h-5 w-5'
</script>
