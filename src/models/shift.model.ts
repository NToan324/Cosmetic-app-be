import mongoose, { Schema, InferSchemaType } from 'mongoose'

const shiftSchema = new Schema(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
      // 👉 ID nhân viên mở ca (thu ngân / tư vấn), liên kết với bảng `users`
    },
    opening_cash: {
      type: Number,
      required: true
      // 💵 Số tiền mặt có sẵn trong két khi mở ca (do nhân viên nhập)
    },
    current_cash: {
      type: Number,
      default: 0
      // 💰 Số tiền mặt hiện tại trong két, được hệ thống tự động cập nhật sau mỗi đơn hàng tiền mặt
    },
    actual_cash: {
      type: Number
      // 🧾 Số tiền thực tế nhân viên kiểm kê sau ca làm (để so sánh với `current_cash`)
    },
    cash_revenue: {
      type: Number,
      default: 0
      // 💸 Tổng doanh thu từ thanh toán tiền mặt trong ca này
    },
    transfer_revenue: {
      type: Number,
      default: 0
      // 🏦 Tổng doanh thu từ thanh toán chuyển khoản trong ca này
    },
    order_count: {
      type: Number,
      default: 0
      // 📦 Số lượng đơn hàng đã xử lý trong ca
    },
    start_time: {
      type: Date,
      default: Date.now
      // ⏱️ Thời gian bắt đầu ca làm (ghi nhận khi nhân viên mở ca)
    },
    end_time: {
      type: Date
      // ⌛ Thời gian kết thúc ca làm (ghi nhận khi nhân viên đóng ca)
    },
    is_closed: {
      type: Boolean,
      default: false
      // ✅ Trạng thái ca làm: đã đóng ca hay chưa
    },
    is_approved: {
      type: Boolean,
      default: false
      // 🔒 Quản lý đã xác nhận và duyệt ca làm hay chưa
    },
    note: {
      type: String
      // 📝 Ghi chú nếu có sự chênh lệch, sự cố trong ca làm, hoặc lý do nhân viên/QL ghi nhận
    }
  },
  {
    timestamps: true
  }
)

const shiftModel = mongoose.model('shifts', shiftSchema)
type Shift = InferSchemaType<typeof shiftSchema>
export default shiftModel
export type { Shift }
