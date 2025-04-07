import { BadRequestError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import { convertToObjectId } from '@/helpers/convertObjectId'
import brandModel from '@/models/brand.model'
import { Brand } from '@/models/brand.model'

class BrandService {
  async createBrand(payload: Brand) {
    const newBrand = await brandModel.create(payload)
    return new CreatedResponse('Brand created successfully', newBrand)
  }

  async getBrands() {
    const brands = await brandModel.find()
    return new OkResponse('Get all brands successfully', brands)
  }

  async getBrandById(id: string) {
    const brand = await brandModel.findById(convertToObjectId(id))
    if (!brand) throw new BadRequestError('Brand not found')
    return new OkResponse('Get brand successfully', brand)
  }

  async updateBrand({ id, payload }: { id: string; payload: Partial<Brand> }) {
    const brand = await brandModel.findByIdAndUpdate(convertToObjectId(id), payload, { new: true })
    if (!brand) throw new BadRequestError('Brand not found')
    return new OkResponse('Brand updated successfully', brand)
  }

  async deleteBrand(id: string) {
    const brand = await brandModel.findByIdAndDelete(id)
    if (!brand) throw new Error('Brand not found')
    return new OkResponse('Brand deleted successfully', brand)
  }
}

const brandService = new BrandService()
export default brandService
