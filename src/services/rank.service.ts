import { CreatedResponse, OkResponse } from '@/core/success.response'
import rankModel, { Rank } from '@/models/rank.model'

class RankService {
  async getAllRanks() {
    const ranks = await rankModel.find()
    return new OkResponse('Get all ranks successfully', ranks)
  }

  async createRank(payload: Rank) {
    const ranks = await rankModel.insertMany(payload)
    return new CreatedResponse('Create rank successfully', ranks)
  }
}

const rankService = new RankService()
export default rankService
