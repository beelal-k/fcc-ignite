import useLanguageStore from "@/store/languageStore";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useLocation } from "react-router-dom";

const Gallery = () => {
  const language = useLanguageStore((state) => state.language);
  const location = useLocation();
  const images = location.state;
  console.log(images);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="mb-8 mt-24">
      <h2 onClick={goBack} className="pl-5 cursor-pointer text-2xl">
        <ArrowLeftIcon className="size-8 text-black" />
      </h2>
      <div className="mt-6 w-1/2 mx-auto">
        {images.map((image, index) => {
          // For the first image in each set (full width)
          if (index % 3 === 0) {
            return (
              <img
                key={index}
                src={image}
                alt={`image-${index}`}
                className="w-full object-cover transition-all duration-300 mb-4"
              />
            );
          } else {
            // For the two images side by side
            return (
              <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                <img
                  src={image}
                  alt={`image-${index}`}
                  className={`${index % 3 === 2 ? 'mr-2' : 'ml-2'}`}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Gallery;