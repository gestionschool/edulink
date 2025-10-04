// src/stores/useBulletinsMeta.js
import { makeCrudStore } from './_crudFactory'
import { BulletinsMetaService } from '@/services/bulletinsMeta'
export const useBulletinsMetaStore = makeCrudStore('bulletinsMeta', BulletinsMetaService)
