import React from "react";

const Warranty = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">CHÍNH SÁCH BẢO HÀNH</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">1. Thông tin bảo hành sản phẩm của Routine</h2>
        <p className="mt-2 text-gray-700">
          Sản phẩm bảo hành là sản phẩm chính hãng của Routine, phân phối tại hệ thống cửa hàng trên toàn quốc, bị lỗi do nhà sản xuất hoặc không đạt tiêu chuẩn, bao gồm:
        </p>
        
        <h3 className="text-xl font-semibold mt-4">Nhóm giày, ví, bóp, dây lưng da thật</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Nổ da, bong tróc da do lỗi sản xuất (không có sự can thiệp từ chất tẩy rửa).</li>
          <li>Bong keo.</li>
          <li>Đứt, bong đường kim mũi chỉ.</li>
          <li>Chốt cài (đối với dây lưng).</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-4">Nhóm balo các loại</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Hỏng khóa kéo, đứt đường may.</li>
          <li>Bong keo hoặc da.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">2. Thời gian và địa điểm nhận bảo hành</h2>
        <p className="text-gray-700">Thời gian áp dụng bảo hành các sản phẩm đủ điều kiện là <span className="font-semibold">180 ngày</span>.</p>
        <p className="text-gray-700">Địa điểm bảo hành: toàn bộ hệ thống cửa hàng Routine trên toàn quốc.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Lưu ý</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Sản phẩm trước khi mang đến bảo hành phải được vệ sinh sạch sẽ.</li>
          <li>Thời gian bảo hành phụ thuộc vào mức độ lỗi và quy trình của Routine.</li>
          <li>Routine miễn phí 100% chi phí bảo hành.</li>
        </ul>
      </section>
    </div>
  );
};

export default Warranty;
