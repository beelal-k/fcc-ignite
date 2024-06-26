import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Calendar as ShadCalendar } from '@/components/ui/calendar'
import PlaceGallery from "@/components/Item/PlaceGallery";
import loadinganimation from "@/assets/loading.gif";
import Booking from "@/components/Item/Booking";
import Content from "@/components/Item/Content";
import { useParams } from "react-router-dom";
import { DayModifiers } from 'react-day-picker';
import ItemMap from "@/components/maps/itemMap";

const Item = () => {
  const [item, setItem] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const today = new Date();
  const modifiers = {
    beforeStart: { before: startDate },
  };

  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/item/${id}`);
      setItem(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-8 pt-5 md:px-44  mb-24">
      {loading ? (
        <div className="flex justify-center items-center mt-32">
          <img src={loadinganimation} alt="loading" />
        </div>
      ) : item ? (
        <div className="min-h-[60px]">
          <div>
            <div className="flex flex-col w-full">
              <div>
                {/* <div className="text-sm md:block hidden text-gray-500 mb-2">
                  <Link
                    to={{
                      pathname: "/",
                    }}
                  >
                    Home
                  </Link>{" "}
                  /{" "}
                  <Link
                    to={{
                      pathname: `/items/${item.category}`,
                    }}
                  >
                    {item.category}
                  </Link>{" "}
                  <Link
                    to={{
                      pathname: `/items/${item.category}/${item.subcategory}`,
                    }}
                  >
                    / {item.subcategory}
                  </Link>{" "}
                  <Link
                    to={{
                      pathname: `/item/${item._id}`,
                    }}
                  >
                    / {item.title}
                  </Link>
                </div> */}

                <h1 className="text-2xl md:text-3xl text-black mb-5 font-medium w-fit">
                  {item.title}
                </h1>
                <div className="">
                  <PlaceGallery itemId={item._id} photos={item.images} />
                </div>
              </div>
              <div className="mt-10 gap-10 relative flex md:flex-row flex-col">
                <div className="md:w-2/3 w-full">
                  <Content content={item.content} item={item} />
                  <div className="flex md:flex-row mt-10 flex-col gap-5 justify-around items-center ">
                    {/* <ShadCalendar mode="single" className="" selected={startDate} onSelect={setStartDate} /> */}
                    {/* <ShadCalendar mode="single" selected={endDate} onSelect={setEndDate} /> */}
                    <ShadCalendar
                      mode="single"
                      className=""
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={{ before: new Date() }} // Disable dates before today
                    />
                    <ShadCalendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={startDate ? modifiers.beforeStart : { before: today }} // Disable dates before the selected start date
                    />
                  </div>
                </div>
                <div className="h-fit sticky top-44 md:w-1/3 w-full">
                  <Booking startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} item={item} />
                </div>
              </div>

            </div>
            <div className="w-full mt-10">
              <p className="text-2xl font-semibold">Where you'll be</p>
              <ItemMap
                lat={item.location.lat}
                lng={item.location.lng}
              />
            </div>
            {/* <hr className="my-6 md:block" />
            <Recommendations
              title={
                <>
                  <h2 className="text-2xl font-medium text-yellow-600">
                    <span className="bg-[#FF5A5F] text-white px-2 italic">
                      Find more
                    </span>{" "}
                    like this!
                  </h2>
                </>
              }
              description="Find more experiences like this one, that promise to delight, surprise, and inspire."
            /> */}
          </div>
        </div>
      ) : (
        <>
          <p>Item not found</p>
        </>
      )}
    </div>
  );
};

export default Item;