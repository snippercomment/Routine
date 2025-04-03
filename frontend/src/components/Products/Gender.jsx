import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";


const Gender = () => {
    return (
        <section className=" py-16 px-4 lg:px-0 text-center">
          <h2 className="text-3xl font-bold mb-2">Bộ Sưu Tập</h2>
          <div className="container mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex gap-4">
            <div className="relative flex-1"> <img src={img1} className="w-full h-[400px] object-cover"/></div>
            <div className="relative flex-1"> <img src={img2} className="w-full h-[400px] object-cover"/></div>
          </div>
           
          </div>
        
        </section>
       
      );
}

export default Gender