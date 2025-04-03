import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Giới thiệu</h1>
      <p>
        <strong>Thương hiệu ROUTINE Fashion</strong> (thuộc Công ty TNHH ROUTINE) mang đến phong cách thời trang năng động, cá tính dành cho giới trẻ.
      </p>
     
      <p className="mt-3">
        Các dòng sản phẩm nổi bật: Áo polo, Jeans Denim, Kaki cotton, T-shirt, Sơ mi, Đầm, Váy...
      </p>
      <p className="mt-3">
        <strong>ROUTINE Fashion</strong> mong muốn xây dựng một thương hiệu thời trang lớn mạnh phục vụ mọi lứa tuổi tại Việt Nam.
      </p>
      <h2 className="text-xl font-semibold mt-6">Liên hệ chăm sóc khách hàng</h2>
      <p className="italic mt-2">
        Hotline: <span className="text-red-600 font-bold">0123456789</span>
      </p>
      <p className="italic">Email: cskh-r@fashion.com</p>
      <p className="italic">Website: www.rfashion.vn</p>
      <p className="italic">Fanpage: R Fashion</p>
    </div>
  );
};

export default AboutUs;
