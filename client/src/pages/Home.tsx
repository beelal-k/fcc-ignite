import { useEffect, useState } from "react";
import desert from "@/assets/desert.png";
import img2 from "@/assets/cruise.png";
import img3 from "@/assets/waterslide-398249_1280.jpg";
import img4 from "@/assets/burj.jpg";
import locator from "@/assets/locator.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import Services from "@/components/Services/Services";
import Recommendations from "@/components/Item/Recommendations";
import Gallery from "@/components/Gallery/Gallery";
import useLanguageStore from "@/store/languageStore";

const Home = () => {
  const language = useLanguageStore((state) => state.language);
  const isEnglish = language === "en";

  const slidesUrdu = [
    {
      id: 0,
      title: "پاکستان میں ایک شاندار شمالی سفر کا آغاز کریں",
      description:
        "پاکستان کے شاندار شمالی علاقہ جات کے پار ایک دلچسپ سفر کا آغاز کریں۔ ہماری شمالی سیاحت آپ کو ہمالیہ کے دل میں لے جاتی ہے، جہاں مہم جوئی سکون سے ملتی ہے۔",
      link: "/northern-areas-safari-pakistan",
      location: "پاکستان",
      image: desert,
      ctaText: "شمالی جادو دریافت کریں",
    },
    {
      id: 1,
      title: "کراچی کے ساحل پر ایک شاندار سفر کا آغاز کریں",
      description:
        "ہماری پرکشش کشتیوں پر بحیرہ عرب کے ساتھ ساتھ چلیں۔ کراچی کے ساحل کے چمکتے پانیوں کے ذریعے سفر کرتے ہوئے، کراچی کی شاندار اسٹائل میں ڈوب جائیں۔",
      link: "/karachi-beach-cruise",
      location: "کراچی، پاکستان",
      image: img2,
      ctaText: "شائستگی میں کروزر",
    },
    {
      id: 2,
      title: "پاکستان کے دلچسپ تفریحی مقامات کا دورہ",
      description:
        "پاکستان کے شہر کے سب سے مشہور پرکشش مقامات کے ہمارے منصوبہ بند دورے کے ساتھ پاکستان کی عظمت کا مشاہدہ کریں۔ شاندار شاہی قلعہ دیکھیں اور لاہور کے تاریخی محلوں کی سیر کریں۔",
      link: "/pakistan-landmarks-tour",
      location: "پاکستان",
      image: img4,
      ctaText: "پاکستان کے عجائبات دریافت کریں",
    },
    {
      id: 99,
      title: "حج اور عمرہ",
      description:
        "ہمارے حج اور عمرہ پیکیجز کے ساتھ زندگی کے سفر کا تجربہ کریں۔ ہمارے ماہر ہدایت گار عمرہ اور حج کے مقدس شہروں کا بے درد سفر یقینی بنائیں گے۔",
      link: "/pakistan-landmarks-tour",
      location: "KSA",
      image:
        "https://www.islamic-relief.org.uk/wp-content/uploads/2022/11/hajj-umrah-hero.jpg",
      ctaText: "مزید دریافت کریں",
    },
  ];

  const slides = [
    {
      id: 0,
      title: "Embark on a Dazzling Northern Odyssey in Pakistan",
      description:
        "Embark on an exhilarating journey across the magnificent northern areas of Pakistan. Our Northern Safari invites you into the heart of the Himalayas, where adventure meets serenity.",
      link: "/northern-areas-safari-pakistan",
      location: "Pakistan",
      image:
        "https://hunzaguidespakistan.com/wp-content/uploads/2023/12/Derawar-Fort-Bahawalpur.jpg",
      ctaText: "Discover the Northern Magic",
    },
    {
      id: 1,
      title: "Set Sail on a Luxurious Karachi Beach Cruise",
      description:
        "Drift along the Arabian Sea on our elegant cruise boats. Immerse yourself in the opulence of Karachi's skyline as you navigate through the glistening waters of the Karachi coast.",
      link: "/karachi-beach-cruise",
      location: "Karachi, Pakistan",
      image: img2,
      ctaText: "Cruise into Elegance",
    },
    {
      id: 2,
      title: "Pakistan's Thrilling Landmarks Tour",
      description:
        "Witness the grandeur of Pakistan with our curated tour of the city's most iconic attractions. Marvel at the architectural splendor of the Shahi Qila and explore the historic quarters of Lahore.",
      link: "/pakistan-landmarks-tour",
      location: "Pakistan",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Blue_Hour_at_Pakistan_Monument.jpg/1200px-Blue_Hour_at_Pakistan_Monument.jpg",
      ctaText: "Discover Pakistan's Wonders",
    },
    {
      id: 99,
      title: "Hajj and Umrah",
      description:
        "Experience the spiritual journey of a lifetime with our Hajj and Umrah packages. Our expert guides will ensure a seamless pilgrimage to the holy cities of Mecca and Medina.",
      link: "/pakistan-landmarks-tour",
      location: "KSA",
      image:
        "https://www.islamic-relief.org.uk/wp-content/uploads/2022/11/hajj-umrah-hero.jpg",
      ctaText: "Discover more",
    },
  ];

  const [selectedSlides, setSelectedSlides] = useState(
    isEnglish ? slides : slidesUrdu
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setSelectedSlides(isEnglish ? slides : slidesUrdu);
  }, [isEnglish]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSlide == selectedSlides.length - 1) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">
      <div className="px-8 md:px-16">
        <Recommendations
          title={
            <>
              <h2 className="text-2xl font-medium text-yellow-600">
                <span className="bg-[#FF5A5F] text-white px-2 italic">
                  {isEnglish ? <>Recommended</> : <>تجویز کردہ</>}
                </span>{" "}
                {isEnglish ? <>for you!</> : <>آپ کے لئے</>}
              </h2>
            </>
          }
          description={
            isEnglish
              ? `Dive into a world of discovery, with handpicked experiences that promise
            to delight, surprise, and inspire`
              : "ایک دنیا کی دریافت میں ڈوبیں، ہاتھ سے منتخب تجربات کے ساتھ جو وعدہ کرتے ہیں کہ خوشی، حیرت اور توجہ پیدا کریں گے۔"
          }
        />
      </div>
    </div>
  );
};

export default Home;
