import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">CHÍNH SÁCH BẢO MẬT</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">I. Chính sách bảo mật và chia sẻ thông tin</h2>
        <h3 className="text-xl font-semibold mt-4">1. Mục đích</h3>
        <p className="mt-2 text-gray-700">
        ROUTINE tôn trọng sự riêng tư và bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật này nhằm đảm bảo quyền lợi của khách hàng.
        </p>
      </section>
      
      <section className="mb-6">
        <h3 className="text-xl font-semibold">2. Quy định cụ thể</h3>
        <h4 className="font-semibold mt-4">2.1 Thu thập thông tin</h4>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Khách hàng phải cung cấp thông tin khi thực hiện giao dịch hoặc đăng ký tài khoản.</li>
          <li>Khách hàng có trách nhiệm đảm bảo thông tin chính xác và cập nhật.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-semibold">2.2 Lưu trữ và bảo mật thông tin</h4>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Thông tin khách hàng được bảo mật bởi hệ thống của ROUTINE.</li>
          <li>Áp dụng biện pháp kỹ thuật ngăn chặn truy cập trái phép.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-semibold">2.3 Sử dụng thông tin khách hàng</h4>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Giao hàng theo địa chỉ cung cấp.</li>
          <li>Gửi thông tin sản phẩm, ưu đãi.</li>
          <li>Xử lý đơn hàng và dịch vụ theo yêu cầu.</li>
          <li>Sử dụng cookie để cải thiện trải nghiệm.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-semibold">4. Chia sẻ thông tin khách hàng</h4>
        <p className="text-gray-700">ROUTINE cam kết không chia sẻ thông tin khách hàng trừ các trường hợp:</p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Yêu cầu từ cơ quan pháp luật.</li>
          <li>Đối tác quảng cáo như Google.</li>
          <li>Nghiên cứu thị trường.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-semibold">5. Sử dụng Cookie</h4>
        <p className="text-gray-700">Chúng tôi thu thập thông tin như:</p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Cách khách hàng sử dụng dịch vụ.</li>
          <li>Địa chỉ IP.</li>
          <li>Thông tin trình duyệt, thiết bị.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">II. Chính sách bảo mật thanh toán</h2>
        <p className="text-gray-700">
          Hệ thống thanh toán tuân thủ các tiêu chuẩn bảo mật của đối tác thanh toán tại Việt Nam.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Liên hệ</h2>
        <p className="text-gray-700">Hotline: <span className="font-semibold">0123456789</span></p>
        <p className="text-gray-700">Email: <span className="font-semibold">cskh-r@minhgiaphu.com</span></p>
        <p className="text-gray-700">Website: <span className="font-semibold">www.r.vn</span></p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
