// src/services/presences.js
import { makeCrudService } from './crud'

/**
 * Ressource "presences" (json-server)
 * Schéma conseillé :
 * { id, date: 'YYYY-MM-DD', classeId, coursId, eleveId, statut: 'P'|'A'|'R', teacherId, note? }
 */
export const PresencesService = makeCrudService('presences')
