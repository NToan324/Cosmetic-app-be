import { OkResponse } from '@/core/success.response'; // Giả sử bạn có class này
import productModel from '@/models/product.model';
import mongoose from 'mongoose';

class ProductService {
  // Tạo sản phẩm
  async createProduct(productData: any) {
    const newProduct = await productModel.create(productData);
    return new OkResponse('Product created successfully', newProduct);
  }

  //Lấy sản phẩm
  async getProducts() {
    const products = await productModel.find();
    return new OkResponse('Get all products successfully', products);
  }

  //Lấy 1 sản phẩm
  async getProductById(id: string) {
    try {
      const product = await productModel.findById(id);
      if (!product) throw new Error('Sản phẩm không tồn tại');
      return new OkResponse('Get product successfully', product);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Sản phẩm không tồn tại'); // Khi ID không hợp lệ
      }
      throw error; // Các lỗi khác giữ nguyên
    }
  }

  async deleteProduct(id: string) {
    try {
      // Tìm sản phẩm trước khi cập nhật
      const product = await productModel.findById(id);
      if (!product) throw new Error('Sản phẩm không tồn tại');

      // Kiểm tra nếu sản phẩm đã bị xóa
      if (product.deleted) {
        // Lấy ngày xóa từ edit_history (giả sử lần chỉnh sửa cuối cùng là lần xóa)
        const lastEdit = product.edit_history[product.edit_history.length - 1];
        const deleteEmployee = lastEdit?.edited_by
        ? lastEdit.edited_by
        : 'Vô Danh';

        const deleteDate = lastEdit?.edited_at
          ? new Date(lastEdit.edited_at).toLocaleString()
          : 'không xác định';
        throw new Error(`Sản phẩm này đã bị xóa từ ${deleteDate} bởi ${deleteEmployee}`);
      }

      // Cập nhật sản phẩm thành deleted: true và thêm vào edit_history
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          $set: { deleted: true },
          $push: {
            edit_history: {
              edited_at: new Date(),
              edited_by:"Binemidua", //new mongoose.Types.ObjectId('some-user-id'), // Thay bằng user ID thực tế
              reason: 'Xóa sản phẩm',
              changes: { deleted: true },
            },
          },
        },
        { new: true }
      );

      console.log(`Sản phẩm ${id} đã bị xóa, chờ tích hợp hệ thống quản lý.`);
      return new OkResponse('Xóa sản phẩm thành công', updatedProduct);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Sản phẩm không tồn tại');
      }
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService;