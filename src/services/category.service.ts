import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import { convertToObjectId } from '@/helpers/convertObjectId'
import categoryModel, { Category } from '@/models/category.model'

class CategoryService {
  async createCategory(payload: Category) {
    const newCategory = await categoryModel.create(payload)
    return new CreatedResponse('Category created successfully', newCategory)
  }

  async getCategories() {
    const categories = await categoryModel.find()
    return new OkResponse('Get all categories successfully', categories)
  }

  async getCategoryById(id: string) {
    const category = await categoryModel.findById(id)
    if (!category) throw new Error('Category not found')
    return new OkResponse('Get category successfully', category)
  }

  async updateCategory({ id, payload }: { id: string; payload: Partial<Category> }) {
    const category = await categoryModel.findByIdAndUpdate(convertToObjectId(id), payload, { new: true })
    if (!category) throw new Error('Category not found')
    return new OkResponse('Category updated successfully', category)
  }

  async deleteCategory(id: string) {
    const category = await categoryModel.findByIdAndDelete(id)
    if (!category) throw new Error('Category not found')
    return new OkResponse('Category deleted successfully', category)
  }
}

const categoryService = new CategoryService()
export default categoryService
