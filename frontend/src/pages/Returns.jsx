import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">CHÍNH SÁCH ĐỔI TRẢ</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">1. Quy định chung</h2>
        <p className="mt-2 text-gray-700">
          Sản phẩm đổi trả chưa qua sử dụng, chưa giặt tẩy, không bị vấy bẩn, ám mùi lạ, còn nguyên tem tag và hóa đơn mua hàng.
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Áp dụng đổi 1 lần cho 1 sản phẩm.</li>
          <li>Sản phẩm sau khi đổi không được đổi lại (trừ lỗi sản xuất).</li>
          <li>Không hoàn lại tiền nếu sản phẩm đổi có giá trị thấp hơn.</li>
          <li>Miễn phí đổi hàng nếu lỗi từ nhà sản xuất.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">2. Chính sách đổi trả sản phẩm</h2>
        
        <h3 className="text-xl font-semibold mt-4">2.1. Chính sách đổi hàng</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Sản phẩm nguyên giá, không khuyến mãi: Đổi trong <span className="font-semibold">30 ngày</span>.</li>
          <li>Sản phẩm giảm giá dưới 30%: Đổi trong <span className="font-semibold">30 ngày</span>.</li>
          <li>Sản phẩm giảm giá từ 30% trở lên: Không áp dụng đổi hàng.</li>
          <li>Không áp dụng đổi với phụ kiện (trừ giày, dép).</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-4">2.2. Chính sách trả hàng</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Sản phẩm mua trực tiếp tại cửa hàng: Không áp dụng hoàn tiền.</li>
          <li>Sản phẩm mua online: Hoàn tiền qua chuyển khoản (không áp dụng với phụ kiện và sản phẩm giảm giá từ 30%).</li>
        </ul>
      </section>
    </div>
  );
};

export default ReturnPolicy;
