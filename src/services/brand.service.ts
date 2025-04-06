import { OkResponse } from '@/core/success.response'; // Giả sử bạn có class này
import brandModel from '@/models/brand.model';

class BrandService {
  // Thêm thương hiệu
  async createBrand(brandData: any) {
    const newBrand = await brandModel.create(brandData);
    return new OkResponse('Brand created successfully', newBrand);
  }

  // Lấy tất cả thương hiệu
  async getBrands() {
    const brands = await brandModel.find();
    return new OkResponse('Get all brands successfully', brands);
  }

  // Lấy thông tin 1 thương hiệu theo _id
  async getBrandById(id: string) {
    const brand = await brandModel.findById(id);
    if (!brand) throw new Error('Thương hiệu không tồn tại');
    return new OkResponse('Get brand successfully', brand);
  }

  // Sửa thông tin thương hiệu
  async updateBrand(id: string, updateData: any) {
    const brand = await brandModel.findById(id);
    if (!brand) throw new Error('Thương hiệu không tồn tại');
    brand.set(updateData);
    await brand.save();
    return new OkResponse('Brand updated successfully', brand);
  }

  // Xóa thương hiệu
  async deleteBrand(id: string) {
    const brand = await brandModel.findByIdAndDelete(id);
    if (!brand) throw new Error('Thương hiệu không tồn tại');
    return new OkResponse('Brand deleted successfully', null);
  }
}

const brandService = new BrandService();
export default brandService;