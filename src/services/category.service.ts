import { OkResponse } from '@/core/success.response'; // Giả sử bạn có class này
import categoryModel from '@/models/category.model';

class CategoryService {
  // Thêm danh mục
  async createCategory(categoryData: any) {
    const newCategory = await categoryModel.create(categoryData);
    return new OkResponse('Category created successfully', newCategory);
  }

  // Lấy tất cả danh mục
  async getCategories() {
    const categories = await categoryModel.find();
    return new OkResponse('Get all categories successfully', categories);
  }

  // Lấy thông tin 1 danh mục theo _id
  async getCategoryById(id: string) {
    const category = await categoryModel.findById(id);
    if (!category) throw new Error('Danh mục không tồn tại');
    return new OkResponse('Get category successfully', category);
  }

  // Sửa thông tin danh mục
  async updateCategory(id: string, updateData: any) {
    const category = await categoryModel.findById(id);
    if (!category) throw new Error('Danh mục không tồn tại');
    category.set(updateData);
    await category.save();
    return new OkResponse('Category updated successfully', category);
  }

  // Xóa danh mục
  async deleteCategory(id: string) {
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) throw new Error('Danh mục không tồn tại');
    return new OkResponse('Category deleted successfully', null);
  }
}

const categoryService = new CategoryService();
export default categoryService;