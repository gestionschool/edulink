// src/stores/useBulletinsMeta.js
import { makeCrudStore } from './_crudFactory'
import { BulletinsMetaService } from '@/services/bulletinsMeta'
export const useBulletinsMeta = makeCrudStore('bulletinsMeta', BulletinsMetaService)
