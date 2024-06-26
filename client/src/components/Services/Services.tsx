/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import bkdrop1 from "@/assets/backdrops/1.png";
import bkdrop2 from "@/assets/backdrops/2.png";
import bkdrop3 from "@/assets/backdrops/3.png";
import bkdrop4 from "@/assets/backdrops/4.png";
import burj from "@/assets/1-burj-al-arab3.webp";
import cruise from "@/assets/cruise.png";
import waterslide from "@/assets/waterslide-398249_1280.jpg";
import sampleimg from "@/assets/desert.png";
import useLanguageStore from "@/store/languageStore";

const Services = () => {
  const language = useLanguageStore((state) => state.language);
  const isEnglish = language === "en";

  const sampleCats = [
    "Historical Sites",
    "Natural Wonders",
    "Cultural Attractions",
    "Adventure Spots",
    "Hajj and Umrah",
  ];

  const navigate = useNavigate();
  const bkdrops = [
    {
      id: 1,
      img: bkdrop3,
      title: "Historical Sites",
      img2: "https://pkvogue.com/wp-content/uploads/2022/09/Pakistan-Historical-Places-With-Information-In-Urdu-Names-And-Images-11.jpg",
    },
    {
      id: 2,
      img: bkdrop2,
      title: "Natural Wonders",
      img2: "https://cdn-v2.theculturetrip.com/1200x630/wp-content/uploads/2017/11/great_nature_landscape_pakistan.webp",
    },
    {
      id: 3,
      img: bkdrop1,
      title: "Cultural Attractions",
      img2: "https://qph.cf2.quoracdn.net/main-qimg-40c5803005b471055974556e221761b6.webp",
    },
    {
      id: 4,
      img: bkdrop4,
      title: "Adventure Spots",
      img2: waterslide,
    },
  ];

  const bkdropsUrdu = [
    {
      id: 1,
      img: bkdrop3,
      title: "تاریخی مقامات", // Historical Sites
      img2: sampleimg,
    },
    {
      id: 2,
      img: bkdrop2,
      title: "قدرتی عجائبات", // Natural Wonders
      img2: burj,
    },
    {
      id: 3,
      img: bkdrop1,
      title: "ثقافتی مقامات", // Cultural Attractions
      img2: cruise,
    },
    {
      id: 4,
      img: bkdrop4,
      title: "مہم جوئی کے مقامات", // Adventure Spots
      img2: waterslide,
    },
  ];

  const [drops, setDrops] = useState<any>(
    isEnglish ? bkdrops : bkdropsUrdu
  );

  useEffect(() => {
    if (isEnglish) {
      setDrops(bkdrops);
    } else {
      setDrops(bkdropsUrdu);
    }
  }, [isEnglish]);

  const handleMouseEnter = (id: any) => {
    const element = document.getElementById(`img-${id}`);
    if (element) {
      element.classList.add("hover");
    }
  };

  const handleMouseLeave = (id: any) => {
    const element = document.getElementById(`img-${id}`);
    if (element) {
      element.classList.remove("hover");
    }
  };

  return (
    <div className="min-h-[400px] py-10 px-8 md:px-16">
      <h2 className="text-2xl">
        {isEnglish ? <>Our </> : <>ہمارے </>}
        <span className="bg-[#FF5A5F] px-2 italic text-white">
          {isEnglish ? <>Experiences!</> : <>تجربے</>}
        </span>
      </h2>
      <p className="mt-3 text-sm max-w-[500px] text-gray-700">
        {isEnglish ? (
          <>
            Embark on an epic journey with us—award-winning desert safaris and
            iconic global attractions await!
          </>
        ) : (
          <>
            ہمارے ساتھ ایک شاندار سفر پر سفر کریں - ایوارڈ جیتنے والے صحرا
            سفاریاں اور عالمی مقامات کا انتظار ہے!
          </>
        )}
      </p>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 grid-flow-row  mt-6"> */}
      <div className="flex flex-row    justify-evenly items-center flex-wrap gap-4  mt-6">
        {drops.map((item: any) => (
          <div
            onClick={() => {
              navigate(
                `/category/${item.title.toLowerCase().split(" ").join("-")}`
              );
            }}
            key={item.id}
            className="relative cursor-pointer h-[50vh] md:h-[400px] w-[300px]  bg-gray-200 rounded-xl overflow-hidden"
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={() => handleMouseLeave(item.id)}
          >
            <img
              id={`img-${item.id}`}
              src={item.img}
              alt=""
              className="absolute z-10 inset-0 h-full w-full object-cover cursor-pointer transition duration-300 ease-in-out"
            />
            <div className="absolute z-20 w-full h-full flex flex-col items-center justify-center">
              <div className="border border-dotted rounded-xl p-1">
                <img
                  id={`img2-${item.id}`}
                  src={item.img2}
                  alt=""
                  className="w-[150px] h-[150px] rounded-border rounded-xl"
                />
              </div>

              <h2 className="text-3xl mt-4 text-white font-semibold uppercase text-center max-w-[200px] underline cursor-pointer transition duration-300 ease-in-out">
                {item.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
