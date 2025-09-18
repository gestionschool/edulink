import { defineStore } from 'pinia'
import {
  studentsService, classesService, periodesService, teachersService, coursService,
  evaluationsService, bulletinsMetaService, interrosService, examensService, devoirsService
} from '@/services/resources'

export const useSchoolStore = defineStore('school', {
  state: () => ({
    // Données principales
    students: [], classes: [], periodes: [], teachers: [],
    cours: [], evaluations: [], bulletinsMeta: [],
    interros: [], examens: [], devoirs: [],

    // Status
    loading: false, error: null, lastSync: null,
  }),

  getters: {
    // Index rapides
    classById:  (s) => Object.fromEntries(s.classes.map(c => [c.id, c])),
    periodById: (s) => Object.fromEntries(s.periodes.map(p => [p.id, p])),
    teacherById:(s) => Object.fromEntries(s.teachers.map(t => [t.id, t])),
    coursById:  (s) => Object.fromEntries(s.cours.map(c => [c.id, c])),

    // Helpers libellés
    getClasse:  (s) => (id) => s.classes.find(c => c.id === Number(id)) || null,
    getPeriode: (s) => (id) => s.periodes.find(p => p.id === Number(id)) || null,
    getPeriodeLabel: (s) => (id) => s.periodes.find(p => p.id === Number(id))?.label ?? '',
    getStudent: (s) => (id) => s.students.find(e => e.id === Number(id)) || null,

    teacherName () {
      return (id) => this.teacherById[id]?.nom || ''
    },
    classeLabel () {
      return (id) => this.classById[id]?.libelle || this.classById[id]?.label || ''
    },
    coursMatiere () {
      return (coursId) => this.coursById[coursId]?.matiere || ''
    },
    coursClasseLabel () {
      return (coursId) => {
        const c = this.coursById[coursId]; return c ? this.classeLabel(c.classeId) : ''
      }
    },
    coursPeriodeLabel () {
      return (coursId) => {
        const c = this.coursById[coursId]; return c ? this.getPeriodeLabel(c.periodeId) : ''
      }
    },

    // Vues (compat pages)
    coursView (s) {
      return s.cours.map(c => ({
        ...c,
        classe: this.classeLabel(c.classeId),
        professeur: this.teacherName(c.teacherId),
        periode: this.getPeriodeLabel(c.periodeId),
      }))
    },
    interrosView (s) {
      return s.interros.map(r => {
        const c = this.coursById[r.coursId]
        return { ...r, cours: c?.matiere || '', classe: c ? this.classeLabel(c.classeId) : '', bareme: r.bareme ?? 10 }
      })
    },
    examensView (s) {
      return s.examens.map(r => {
        const c = this.coursById[r.coursId]
        return { ...r, cours: c?.matiere || '', classe: c ? this.classeLabel(c.classeId) : '' }
      })
    },
    devoirsView (s) {
      return s.devoirs.map(d => {
        const c = this.coursById[d.coursId]
        return { ...d, cours: c?.matiere || '', classe: c ? this.classeLabel(c.classeId) : '',
          periode: d.periodeId ? this.getPeriodeLabel(d.periodeId) : (c ? this.getPeriodeLabel(c.periodeId) : '') }
      })
    },
    classesView (s) {
      return s.classes.map(c => ({
        id: c.id, code: c.code ?? '', libelle: c.libelle ?? c.label ?? '',
        niveau: c.niveau ?? '', filiere: c.filiere ?? '', effectif: Number(c.effectif ?? 0), titulaire: c.titulaire ?? '',
      }))
    },

    // Options filtres
    uniqueInterroCours () { return Array.from(new Set(this.interrosView.map(i => i.cours).filter(Boolean))).sort() },
    uniqueInterroClasses () { return Array.from(new Set(this.interrosView.map(i => i.classe).filter(Boolean))).sort() },
    uniqueExamCours () { return Array.from(new Set(this.examensView.map(e => e.cours).filter(Boolean))).sort() },
    uniqueExamClasses () { return Array.from(new Set(this.examensView.map(e => e.classe).filter(Boolean))).sort() },
    uniqueExamSessions (s) { return Array.from(new Set(s.examens.map(e => e.session).filter(Boolean))).sort() },
    uniqueDevoirCours () { return Array.from(new Set(this.devoirsView.map(d => d.cours).filter(Boolean))).sort() },
    uniqueDevoirClasses () { return Array.from(new Set(this.devoirsView.map(d => d.classe).filter(Boolean))).sort() },
    uniqueDevoirPeriodes () { return Array.from(new Set(this.devoirsView.map(d => d.periode).filter(Boolean))).sort() },
    uniqueDevoirStatuts (s) { return Array.from(new Set(s.devoirs.map(d => d.statut).filter(Boolean))).sort() },
    uniqueCoursProfesseurs () { return Array.from(new Set(this.coursView.map(c => c.professeur).filter(Boolean))).sort() },
    uniqueCoursClasses () { return Array.from(new Set(this.coursView.map(c => c.classe).filter(Boolean))).sort() },
    uniqueCoursPeriodeLabels () { return Array.from(new Set(this.coursView.map(c => c.periode).filter(Boolean))).sort() },
    uniqueClasseNiveaux (s) { return Array.from(new Set(s.classes.map(c => c.niveau).filter(Boolean))).sort() },
    uniqueClasseFilieres (s) { return Array.from(new Set(s.classes.map(c => c.filiere).filter(Boolean))).sort() },

    // Bulletin
    getEvaluations: (s) => (eleveId, periodeId) =>
      s.evaluations.filter(e => e.eleveId === Number(eleveId) && e.periodeId === Number(periodeId)),
    getBulletinMeta: (s) => (eleveId, periodeId) =>
      s.bulletinsMeta.find(b => b.eleveId === Number(eleveId) && b.periodeId === Number(periodeId))
      || { observationsGenerales: '', rank: null },
  },

  actions: {
    /* ================== INIT CHARGEMENT ================== */
    async init(force=false){
      if (this.lastSync && !force) return
      this.loading = true; this.error = null
      try {
        const [
          students, classes, periodes, teachers, cours,
          evaluations, bulletinsMeta, interros, examens, devoirs
        ] = await Promise.all([
          studentsService.list(), classesService.list(), periodesService.list(), teachersService.list(), coursService.list(),
          evaluationsService.list(), bulletinsMetaService.list(), interrosService.list(), examensService.list(), devoirsService.list(),
        ])
        Object.assign(this, { students, classes, periodes, teachers, cours, evaluations, bulletinsMeta, interros, examens, devoirs })
        this.lastSync = new Date().toISOString()
      } catch (e) {
        this.error = e.message || String(e)
        throw e
      } finally { this.loading = false }
    },

    /* ================== ÉLÈVES ================== */
    async addEtudiant (payload) {
      const created = await studentsService.create({ matricule:'', photoUrl:'', ...payload })
      this.students.push(created); return created.id
    },
    async updateEtudiant (payload) {
      const updated = await studentsService.update(payload.id, payload)
      const i = this.students.findIndex(r => r.id === payload.id); if (i >= 0) this.students[i] = updated
    },
    async removeEtudiant (id) {
      await studentsService.remove(id)
      this.students = this.students.filter(r => r.id !== id)
    },

    /* ================== PROFS ================== */
    async addTeacher (payload) {
      const created = await teachersService.create({ statut:'Actif', ...payload })
      this.teachers.push(created); return created.id
    },
    async updateTeacher (payload) {
      const updated = await teachersService.update(payload.id, payload)
      const i = this.teachers.findIndex(t => t.id === payload.id); if (i >= 0) this.teachers[i] = updated
    },
    async removeTeacher (id) {
      // détacher cours côté API
      const toPatch = this.cours.filter(c => c.teacherId === id)
      await Promise.all(toPatch.map(c => coursService.update(c.id, { teacherId: null })))
      await teachersService.remove(id)
      this.cours = this.cours.map(c => c.teacherId === id ? { ...c, teacherId: null } : c)
      this.teachers = this.teachers.filter(t => t.id !== id)
    },

    /* ================== CLASSES ================== */
    async addClasse(payload) {
      const row = { code:'', libelle:'', niveau:'', filiere:'', effectif:0, titulaire:'', ...payload }
      row.label = row.libelle || row.label || row.code
      const created = await classesService.create(row)
      this.classes.push(created); return created.id
    },
    async updateClasse(payload) {
      const next = { ...payload }
      if (!next.label) next.label = next.libelle || next.code
      const updated = await classesService.update(payload.id, next)
      const i = this.classes.findIndex(r => r.id === payload.id); if (i >= 0) this.classes[i] = updated
    },
    async removeClasse(id) {
      // 1) Détacher élèves (API + local)
      const eleves = this.students.filter(e => e.classeId === id)
      await Promise.all(eleves.map(e => studentsService.update(e.id, { classeId: null })))
      this.students = this.students.map(e => e.classeId === id ? { ...e, classeId: null } : e)

      // 2) Supprimer dépendances des cours de la classe
      const coursIds = this.cours.filter(c => c.classeId === id).map(c => c.id)
      await Promise.all([
        ...this.interros.filter(r => coursIds.includes(r.coursId)).map(r => interrosService.remove(r.id)),
        ...this.examens.filter(r => coursIds.includes(r.coursId)).map(r => examensService.remove(r.id)),
        ...this.devoirs.filter(d => coursIds.includes(d.coursId)).map(d => devoirsService.remove(d.id)),
        ...coursIds.map(cid => coursService.remove(cid)),
      ])
      this.interros = this.interros.filter(r => !coursIds.includes(r.coursId))
      this.examens  = this.examens.filter(r => !coursIds.includes(r.coursId))
      this.devoirs  = this.devoirs.filter(d => !coursIds.includes(d.coursId))
      this.cours    = this.cours.filter(c => c.classeId !== id)

      // 3) Supprimer la classe
      await classesService.remove(id)
      this.classes = this.classes.filter(r => r.id !== id)
    },

    /* ================== COURS ================== */
    async addCours (payload) {
      const created = await coursService.create({
        code:'', matiere:'', intitule:'', classeId:null, teacherId:null, volume:0, periodeId:null, ...payload,
      })
      this.cours.push(created); return created.id
    },
    async updateCours (payload) {
      const updated = await coursService.update(payload.id, payload)
      const i = this.cours.findIndex(r => r.id === payload.id); if (i >= 0) this.cours[i] = updated
    },
    async removeCours (id) {
      // cascade
      await Promise.all([
        ...this.interros.filter(r => r.coursId === id).map(r => interrosService.remove(r.id)),
        ...this.examens.filter(r => r.coursId === id).map(r => examensService.remove(r.id)),
        ...this.devoirs.filter(d => d.coursId === id).map(d => devoirsService.remove(d.id)),
      ])
      await coursService.remove(id)
      this.interros = this.interros.filter(r => r.coursId !== id)
      this.examens  = this.examens.filter(r => r.coursId !== id)
      this.devoirs  = this.devoirs.filter(d => d.coursId !== id)
      this.cours    = this.cours.filter(r => r.id !== id)
    },

    /* ================== INTERROS / EXAMENS / DEVOIRS ================== */
    async addInterro (payload) {
      const created = await interrosService.create({ titre:'', type:'Programmée', date:'', bareme:10, ...payload })
      this.interros.push(created); return created.id
    },
    async updateInterro (payload) {
      const updated = await interrosService.update(payload.id, payload)
      const i = this.interros.findIndex(r => r.id === payload.id); if (i >= 0) this.interros[i] = updated
    },
    async removeInterro (id) {
      await interrosService.remove(id)
      this.interros = this.interros.filter(r => r.id !== id)
    },

    async addExamen (payload) {
      const created = await examensService.create({ titre:'', type:'Final', session:'Normale', date:'', bareme:20, ...payload })
      this.examens.push(created); return created.id
    },
    async updateExamen (payload) {
      const updated = await examensService.update(payload.id, payload)
      const i = this.examens.findIndex(r => r.id === payload.id); if (i >= 0) this.examens[i] = updated
    },
    async removeExamen (id) {
      await examensService.remove(id)
      this.examens = this.examens.filter(r => r.id !== id)
    },

    async addDevoir (payload) {
      const created = await devoirsService.create({
        titre:'', dateRemise:'', bareme:20, statut:'Publié',
        periodeId: payload.periodeId ?? null, ...payload
      })
      this.devoirs.push(created); return created.id
    },
    async updateDevoir (payload) {
      const updated = await devoirsService.update(payload.id, payload)
      const i = this.devoirs.findIndex(r => r.id === payload.id); if (i >= 0) this.devoirs[i] = updated
    },
    async removeDevoir (id) {
      await devoirsService.remove(id)
      this.devoirs = this.devoirs.filter(r => r.id !== id)
    },

    /* ================== ÉVALUATIONS / BULLETIN ================== */
    async upsertEvaluation (payload) {
      // “UPSERT” json-server: on cherche une ligne équivalente, sinon create
      const { eleveId, periodeId, matiere, type, coef } = payload
      const found = await evaluationsService.list({ eleveId, periodeId, matiere, type, coef })
      if (found?.length) {
        const row = found[0]
        const updated = await evaluationsService.update(row.id, { ...row, ...payload })
        const i = this.evaluations.findIndex(e => e.id === row.id); if (i >= 0) this.evaluations[i] = updated
        else this.evaluations.push(updated)
        return updated.id
      } else {
        const created = await evaluationsService.create(payload)
        this.evaluations.push(created); return created.id
      }
    },
    async setBulletinMeta (eleveId, periodeId, meta) {
      const found = await bulletinsMetaService.list({ eleveId, periodeId })
      if (found?.length) {
        const row = found[0]
        const updated = await bulletinsMetaService.update(row.id, { ...row, ...meta })
        const i = this.bulletinsMeta.findIndex(b => b.id === row.id); if (i >= 0) this.bulletinsMeta[i] = updated
      } else {
        const created = await bulletinsMetaService.create({ eleveId, periodeId, ...meta })
        this.bulletinsMeta.push(created)
      }
    },
  }
})
