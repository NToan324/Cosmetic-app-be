import rankController from '@/controllers/rank.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
const router = Router()

router.get('/', asyncHandler(rankController.getRanks))
router.post('/', asyncHandler(rankController.createRank))

export default router
