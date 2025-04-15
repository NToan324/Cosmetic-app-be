import rankService from '@/services/rank.service'
import type { Request, Response } from 'express'

class RankController {
  async getRanks(req: Request, res: Response) {
    res.send(await rankService.getAllRanks())
  }
  async createRank(req: Request, res: Response) {
    const payload = req.body
    res.send(await rankService.createRank(payload))
  }
}

const rankController = new RankController()
export default rankController
