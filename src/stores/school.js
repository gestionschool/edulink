// src/stores/school.js
import { defineStore } from 'pinia'

/**
 * Store local normalisé :
 * - Références par ID entre cours ⇄ classes ⇄ profs ⇄ périodes
 * - Getters "view" qui exposent des libellés (compatibles avec tes pages)
 * - Helpers de jointure + options uniques pour filtres
 */
export const useSchoolStore = defineStore('school', {
  state: () => ({
    // ========= ÉLÈVES =========
    students: [
      { id: 1, nom: 'Amina Kapinga', matricule: 'EL-2025-001', photoUrl: '', classeId: 11 },
      { id: 2, nom: 'Patrick K.',    matricule: 'EL-2025-002', photoUrl: '', classeId: 11 },
    ],

    // ========= CLASSES =========
    classes: [
        { id: 21, code: '6A', libelle: '6ème A', niveau: '6', filiere: 'Scientifique', effectif: 42, titulaire: 'M. Kasa' },
        { id: 22, code: '6B', libelle: '6ème B', niveau: '6', filiere: 'Scientifique', effectif: 40, titulaire: 'M. Ilunga' },
        { id: 23, code: '6C', libelle: '6ème C', niveau: '6', filiere: 'Scientifique', effectif: 38, titulaire: 'Mme Tumba' },
        // garde aussi ton ancienne 1ère S A si tu veux
        { id: 11, code: '1SA', libelle: '1ère Scientifique A', niveau: '1', filiere: 'Scientifique', effectif: 30, titulaire: '—' },
    ],


    // ========= PÉRIODES =========
    periodes: [
      { id: 101, label: 'Semestre 1', dateDebut: '2025-09-01', dateFin: '2026-01-31', active: true  },
      { id: 102, label: 'Semestre 2', dateDebut: '2026-02-01', dateFin: '2026-06-30', active: false },
    ],

    // ========= PROFESSEURS =========
    teachers: [
      { id: 1, nom: 'Kabeya',  prenom: 'Paul',   email: 'paul@ecole.com',   matiere: 'Math',     statut: 'Actif'   },
      { id: 2, nom: 'Ngoma',   prenom: 'Sophie', email: 'sophie@ecole.com', matiere: 'Physique', statut: 'Actif'   },
      { id: 3, nom: 'Mbuyi',   prenom: 'Jean',   email: 'jean@ecole.com',   matiere: 'Français', statut: 'Inactif' },
      { id: 4, nom: 'Mukendi', prenom: 'Alice',  email: 'alice@ecole.com',  matiere: 'SVT',      statut: 'Actif'   },
    ],

    // ========= COURS (normalisés) =========
    // On relie aux entités par IDs + on garde 'matiere' pour filtres transverses (Math/Physique/…)
    cours: [
      { id: 1, code: 'MAT101', matiere: 'Math',     intitule: 'Math Générales', classeId: 21, teacherId: 1, volume: 48, periodeId: 101 },
      { id: 2, code: 'PHY102', matiere: 'Physique', intitule: 'Physique I',     classeId: 22, teacherId: 2, volume: 36, periodeId: 101 },
      { id: 3, code: 'FRN103', matiere: 'Français', intitule: 'Français Oral',  classeId: 21, teacherId: 3, volume: 24, periodeId: 102 },
      { id: 4, code: 'SVT104', matiere: 'SVT',      intitule: 'SVT',            classeId: 23, teacherId: 4, volume: 30, periodeId: 101 },
    ],

    // ========= ÉVALUATIONS (bulletin) =========
    // (on garde la structure actuelle pour compat BulletinDetail.vue)
    evaluations: [
      // Amina S1
      { eleveId: 1, periodeId: 101, matiere: 'Mathématiques', type: 'Devoir',  coef: 2, note: 14, obs: '' },
      { eleveId: 1, periodeId: 101, matiere: 'Mathématiques', type: 'Examen',  coef: 3, note: 12, obs: 'Manque de rigueur' },
      { eleveId: 1, periodeId: 101, matiere: 'Physique',      type: 'Interro', coef: 1, note: 13, obs: '' },
      { eleveId: 1, periodeId: 101, matiere: 'Physique',      type: 'Examen',  coef: 3, note: 15, obs: '' },
      { eleveId: 1, periodeId: 101, matiere: 'Français',      type: 'Devoir',  coef: 1, note: 11.5, obs: '' },
      { eleveId: 1, periodeId: 101, matiere: 'Français',      type: 'Examen',  coef: 2, note: 10, obs: '' },

      // Patrick S1
      { eleveId: 2, periodeId: 101, matiere: 'Mathématiques', type: 'Devoir',  coef: 2, note: 11, obs: '' },
      { eleveId: 2, periodeId: 101, matiere: 'Mathématiques', type: 'Examen',  coef: 3, note: 15, obs: '' },
      { eleveId: 2, periodeId: 101, matiere: 'Physique',      type: 'Interro', coef: 1, note: 12, obs: '' },
      { eleveId: 2, periodeId: 101, matiere: 'Physique',      type: 'Examen',  coef: 3, note: 14, obs: '' },
    ],

    bulletinsMeta: [
      { eleveId: 1, periodeId: 101, observationsGenerales: 'Ensemble satisfaisant, poursuivre les efforts en Mathématiques.', rank: 5 },
      { eleveId: 2, periodeId: 101, observationsGenerales: 'Bon trimestre, participation active.', rank: 3 },
    ],

    // ========= INTERROS / EXAMENS / DEVOIRS (normalisés via coursId) =========
    interros: [
      { id: 1, titre: 'Interro dérivées',    type: 'Surprise',   date: '2025-10-03', coursId: 1 }, // Math 6A S1
      { id: 2, titre: 'Interro vocabulaire', type: 'Programmée', date: '2025-10-06', coursId: 3 }, // Français 6A S2
      { id: 3, titre: 'Interro énergie',     type: 'Programmée', date: '2025-10-10', coursId: 2 }, // Physique 6B S1
    ],

    examens: [
      { id: 1, titre: 'Examen T1',                 type: 'Final',   session: 'Normale',    date: '2025-11-20', coursId: 1, bareme: 20 },
      { id: 2, titre: 'Examen T2',                 type: 'Partiel', session: 'Normale',    date: '2025-12-05', coursId: 2, bareme: 15 },
      { id: 3, titre: 'Examen Rattrapage Math',    type: 'Final',   session: 'Rattrapage', date: '2026-01-10', coursId: 1, bareme: 20 },
      { id: 4, titre: 'Examen T1',                 type: 'Partiel', session: 'Normale',    date: '2025-11-22', coursId: 4, bareme: 18 },
      { id: 5, titre: 'Examen T2',                 type: 'Final',   session: 'Normale',    date: '2025-12-15', coursId: 3, bareme: 20 },
      { id: 6, titre: 'Examen Rattrapage Physique',type: 'Partiel', session: 'Rattrapage', date: '2026-01-12', coursId: 2, bareme: 15 },
    ],

    devoirs: [
      { id: 1, titre: 'DM1 - Fonctions',  dateRemise: '2025-10-05', coursId: 1, bareme: 20, statut: 'Publié',  periodeId: 101 },
      { id: 2, titre: 'TP – Cinématique', dateRemise: '2025-10-10', coursId: 2, bareme: 20, statut: 'Publié',  periodeId: 101 },
      { id: 3, titre: 'Rédaction 1',      dateRemise: '2025-11-02', coursId: 3, bareme: 10, statut: 'Archivé', periodeId: 102 },
    ],
  }),

  getters: {
    // ===== Index rapides
    classById:  (s) => Object.fromEntries(s.classes.map(c => [c.id, c])),
    periodById: (s) => Object.fromEntries(s.periodes.map(p => [p.id, p])),
    teacherById:(s) => Object.fromEntries(s.teachers.map(t => [t.id, t])),
    coursById:  (s) => Object.fromEntries(s.cours.map(c => [c.id, c])),

    // ===== Helpers libellés
    getClasse:  (s) => (id) => s.classes.find(c => c.id === Number(id)) || null,
    getPeriode: (s) => (id) => s.periodes.find(p => p.id === Number(id)) || null,
    getPeriodeLabel: (s) => (id) => s.periodes.find(p => p.id === Number(id))?.label ?? '',
    getStudent: (s) => (id) => s.students.find(e => e.id === Number(id)) || null,
    getEleve:   (s) => (id) => s.students.find(e => e.id === Number(id)) || null, // alias

    teacherName () {
      return (id) => {
        const t = this.teacherById[id]
        if (!t) return ''
        // Pour tes pages actuelles, on affiche surtout le nom (ex: "Kabeya")
        return t.nom || `${t.prenom ?? ''} ${t.nom ?? ''}`.trim()
      }
    },
    classeLabel () {
      return (id) => this.classById[id]?.label || ''
    },
    coursMatiere () {
      return (coursId) => this.coursById[coursId]?.matiere || ''
    },
    coursClasseLabel () {
      return (coursId) => {
        const c = this.coursById[coursId]
        return c ? this.classeLabel(c.classeId) : ''
      }
    },
    coursPeriodeLabel () {
      return (coursId) => {
        const c = this.coursById[coursId]
        return c ? this.getPeriodeLabel(c.periodeId) : ''
      }
    },

    // ===== Bulletin complet
    getEvaluations: (s) => (eleveId, periodeId) =>
      s.evaluations.filter(e => e.eleveId === Number(eleveId) && e.periodeId === Number(periodeId)),

    getBulletinMeta: (s) => (eleveId, periodeId) =>
      s.bulletinsMeta.find(b => b.eleveId === Number(eleveId) && b.periodeId === Number(periodeId))
      || { observationsGenerales: '', rank: null },

    getBulletin () {
      return (eleveId, periodeId) => {
        const eleve = this.getStudent(eleveId)
        const classe = eleve ? this.getClasse(eleve.classeId) : null
        const periode = this.getPeriode(periodeId)
        const evaluations = this.getEvaluations(eleveId, periodeId)
        const meta = this.getBulletinMeta(eleveId, periodeId)
        return { eleve, classe, periode, evaluations, ...meta }
      }
    },

    // ======== Vues “dénormalisées” pour DataTable (compat avec tes pages) ========
    coursView (s) {
      // expose { id, code, intitule, classe, professeur, volume, periode }
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
        return {
          ...r,
          cours: c?.matiere || '',
          classe: c ? this.classeLabel(c.classeId) : '',
          bareme: r.bareme ?? 10,
        }
      })
    },

    examensView (s) {
      return s.examens.map(r => {
        const c = this.coursById[r.coursId]
        return {
          ...r,
          cours: c?.matiere || '',
          classe: c ? this.classeLabel(c.classeId) : '',
        }
      })
    },

    devoirsView (s) {
      return s.devoirs.map(d => {
        const c = this.coursById[d.coursId]
        return {
          ...d,
          cours: c?.matiere || '',
          classe: c ? this.classeLabel(c.classeId) : '',
          periode: d.periodeId ? this.getPeriodeLabel(d.periodeId) : (c ? this.getPeriodeLabel(c.periodeId) : ''),
        }
      })
    },
    classesView (s) {
        return s.classes.map(c => ({
            id: c.id,
            code: c.code ?? '',
            libelle: c.libelle ?? c.label ?? '',
            niveau: c.niveau ?? '',
            filiere: c.filiere ?? '',
            effectif: Number(c.effectif ?? 0),
            titulaire: c.titulaire ?? '',
        }))
    },

    // ======== Options uniques pour filtres (basées sur vues) ========
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

    uniqueStudentClasses (s) {
        const byId = Object.fromEntries(s.classes.map(c => [c.id, c.label]))
        return Array.from(
            new Set(
            s.students
                .map(st => byId[st.classeId])
                .filter(Boolean)
            )
        ).sort()
    },

  },

  actions: {
    // ========= Étudiants (alias) =========
    addEtudiant (payload) {
      const maxId = this.students.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
      const id = payload.id ?? (maxId + 1)
      this.students.push({
        id, matricule: '', nom: '', prenom: '', classeId: null, tuteur: '', telephone: '', statut: 'Actif', ...payload,
      })
      return id
    },
    updateEtudiant (payload) {
      const i = this.students.findIndex(r => r.id === payload.id)
      if (i >= 0) this.students[i] = { ...this.students[i], ...payload }
    },
    removeEtudiant (id) {
      this.students = this.students.filter(r => r.id !== id)
    },
    addStudent (p){ return this.addEtudiant(p) }, updateStudent (p){ return this.updateEtudiant(p) }, removeStudent (id){ return this.removeEtudiant(id) },

    // ========= Bulletin =========
    upsertEvaluation (payload) {
      const idx = this.evaluations.findIndex(e =>
        e.eleveId === payload.eleveId &&
        e.periodeId === payload.periodeId &&
        e.matiere   === payload.matiere &&
        e.type      === payload.type &&
        e.coef      === payload.coef
      )
      if (idx >= 0) this.evaluations[idx] = { ...this.evaluations[idx], ...payload }
      else this.evaluations.push(payload)
    },
    setBulletinMeta (eleveId, periodeId, meta) {
      const i = this.bulletinsMeta.findIndex(b => b.eleveId === eleveId && b.periodeId === periodeId)
      if (i >= 0) this.bulletinsMeta[i] = { ...this.bulletinsMeta[i], ...meta }
      else this.bulletinsMeta.push({ eleveId, periodeId, ...meta })
    },

    // ========= Profs =========
    addTeacher (payload) {
      const maxId = this.teachers.reduce((m, t) => Math.max(m, Number(t.id) || 0), 0)
      const id = payload.id ?? (maxId + 1)
      this.teachers.push({ id, nom:'', prenom:'', email:'', matiere:'', statut:'Actif', ...payload })
      return id
    },
    updateTeacher (payload) {
      const i = this.teachers.findIndex(t => t.id === payload.id)
      if (i >= 0) this.teachers[i] = { ...this.teachers[i], ...payload }
    },
    removeTeacher (id) {
      // Orphelins : on met teacherId=null sur les cours liés
      this.cours = this.cours.map(c => c.teacherId === id ? { ...c, teacherId: null } : c)
      this.teachers = this.teachers.filter(t => t.id !== id)
    },

    // ========= Cours =========
    addCours (payload) {
      const maxId = this.cours.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
      const id = payload.id ?? (maxId + 1)
      this.cours.push({
        id, code:'', matiere:'', intitule:'', classeId:null, teacherId:null, volume:0, periodeId:null, ...payload,
      })
      return id
    },
    updateCours (payload) {
      const i = this.cours.findIndex(r => r.id === payload.id)
      if (i >= 0) this.cours[i] = { ...this.cours[i], ...payload }
    },
    removeCours (id) {
      // Cascade simple : supprimer/filtrer les éléments dépendants
      this.interros = this.interros.filter(r => r.coursId !== id)
      this.examens  = this.examens.filter(r => r.coursId !== id)
      this.devoirs  = this.devoirs.filter(d => d.coursId !== id)
      this.cours    = this.cours.filter(r => r.id !== id)
    },

    // ========= Interros / Examens / Devoirs (CRUD) =========
    addInterro (payload) {
      const maxId = this.interros.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
      const id = payload.id ?? (maxId + 1)
      const coursId = this.resolveCoursId(payload)
      this.interros.push({ id, titre:'', type:'Programmée', date:'', coursId, bareme:10, ...payload, coursId })
      return id
    },
    updateInterro (payload) {
      const i = this.interros.findIndex(r => r.id === payload.id)
      if (i >= 0) {
        const coursId = this.resolveCoursId({ ...this.interros[i], ...payload })
        this.interros[i] = { ...this.interros[i], ...payload, coursId }
      }
    },
    removeInterro (id) {
      this.interros = this.interros.filter(r => r.id !== id)
    },

    addExamen (payload) {
      const maxId = this.examens.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
      const id = payload.id ?? (maxId + 1)
      const coursId = this.resolveCoursId(payload)
      this.examens.push({ id, titre:'', type:'Final', session:'Normale', date:'', coursId, bareme:20, ...payload, coursId })
      return id
    },
    updateExamen (payload) {
      const i = this.examens.findIndex(r => r.id === payload.id)
      if (i >= 0) {
        const coursId = this.resolveCoursId({ ...this.examens[i], ...payload })
        this.examens[i] = { ...this.examens[i], ...payload, coursId }
      }
    },
    removeExamen (id) {
      this.examens = this.examens.filter(r => r.id !== id)
    },

    addDevoir (payload) {
      const maxId = this.devoirs.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
      const id = payload.id ?? (maxId + 1)
      const coursId = this.resolveCoursId(payload)
      const periodeId = payload.periodeId ?? (this.coursById[coursId]?.periodeId ?? null)
      this.devoirs.push({ id, titre:'', dateRemise:'', coursId, bareme:20, statut:'Publié', periodeId, ...payload, coursId, periodeId })
      return id
    },
    updateDevoir (payload) {
      const i = this.devoirs.findIndex(r => r.id === payload.id)
      if (i >= 0) {
        const coursId = this.resolveCoursId({ ...this.devoirs[i], ...payload })
        const periodeId = payload.periodeId ?? (this.coursById[coursId]?.periodeId ?? this.devoirs[i].periodeId ?? null)
        this.devoirs[i] = { ...this.devoirs[i], ...payload, coursId, periodeId }
      }
    },
    removeDevoir (id) {
      this.devoirs = this.devoirs.filter(r => r.id !== id)
    },

    // ========= Résolveur utilitaire =========
    /**
     * Accepte soit payload.coursId, soit un “hint” (cours, classeId, periodeId, teacherId)
     * et renvoie le premier coursId correspondant.
     */
    resolveCoursId (payload) {
      if (payload.coursId) return Number(payload.coursId)
      const wantedMatiere  = payload.cours || payload.matiere
      const wantedClasseId = payload.classeId
      const wantedPeriodeId= payload.periodeId
      const wantedTeacherId= payload.teacherId

      const candidates = this.cours.filter(c =>
        (!wantedMatiere   || c.matiere   === wantedMatiere)   &&
        (!wantedClasseId  || c.classeId  === wantedClasseId)  &&
        (!wantedPeriodeId || c.periodeId === wantedPeriodeId) &&
        (!wantedTeacherId || c.teacherId === wantedTeacherId)
      )
      return candidates[0]?.id ?? null
    },

    addClasse(payload) {
        const maxId = this.classes.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
        const id = payload.id ?? (maxId + 1)
        const row = {
            id,
            code: '', libelle: '', niveau: '', filiere: '',
            effectif: 0, titulaire: '',
            ...payload,
        }
        // compat éventuelle avec getClasse/classeLabel
        row.label = row.libelle || row.label || row.code || `Classe ${id}`
        this.classes.push(row)
        return id
    },
    updateClasse(payload) {
        const i = this.classes.findIndex(r => r.id === payload.id)
        if (i >= 0) {
            const next = { ...this.classes[i], ...payload }
            next.label = next.libelle || next.label || next.code || `Classe ${next.id}`
            this.classes[i] = next
        }
    },
    removeClasse(id) {
        // 1) Détacher les élèves
        this.students = this.students.map(e => e.classeId === id ? { ...e, classeId: null } : e)

        // 2) Supprimer les cours de cette classe (et leurs dépendances)
        const coursIds = this.cours.filter(c => c.classeId === id).map(c => c.id)
        this.interros = this.interros.filter(r => !coursIds.includes(r.coursId))
        this.examens  = this.examens.filter(r => !coursIds.includes(r.coursId))
        this.devoirs  = this.devoirs.filter(d => !coursIds.includes(d.coursId))
        this.cours    = this.cours.filter(c => c.classeId !== id)

        // 3) Supprimer la classe
        this.classes = this.classes.filter(r => r.id !== id)
    },
  }
})
