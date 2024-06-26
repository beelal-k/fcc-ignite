import { useEffect } from "react";
import MarkdownDisplay from "./MarkdownDisplay";
import { useState } from "react";
import ReviewInput from "@/components/Review/ReviewInput";
import axios from "axios";
import Review from "@/components/Review/Review";
import { ReviewType } from "@/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { BiUser } from "react-icons/bi";
import moment from "moment";

interface Props {
  content: {
    title: string;
    markdown: string;
  }[];
  item: any
}

const Content = ({ content, item }: Props) => {
  const [open, setOpen] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState(item.reviews);

  async function getReview() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/item/review/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(res.data);
      setReviews(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getReview();
    console.log(reviews);
  }, [])


  return (
    <div className="mt-10 md:mr-12 text-[16px] w-full flex flex-col gap-6">
      {content.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-1 border-b pb-6 cursor-pointer"
          onClick={() => {
            if (open.includes(index)) {
              setOpen(open.filter((i) => i !== index));
            } else {
              setOpen([...open, index]);
            }
          }}
        >
          <span className="flex flex-col items-start">
            <h2 className="md:text-2xl italic text-black w-fit font-semibold mb-2">
              {capitalizeFirstLetter(item.title)}
            </h2>
            <div className="flex flex-row gap-1 items-center">
              <StarFilledIcon className="size-[18px] text-gray-800" />
              <p>{reviews.length > 0 ? `${reviews.length} reviews` : "No reviews yet"}</p>
            </div>
          </span>
          {open.includes(index) && <MarkdownDisplay markdown={item.markdown} />}
        </div>
      ))}
      <div className="border-b pb-6">
        <div className="flex flex-row items-center gap-3 ">
          <div className="rounded-full p-2 w-fit bg-gray-300">
            <BiUser size={25} className="text-gray-700 " />
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Hosted by {item.seller.name}</p>
            <p className="text-sm">{moment(item.seller.createdAt, "YYYYMMDD").fromNow()} hosting</p>
          </div>
        </div>
      </div>
      <div className="">
        {
          reviews.length == 0 &&
          <p className="text-xl font-semibold">No reviews(yet)</p>
        }
        <h3 className="text-2xl text-black mt-5 font-semibold">Leave a review</h3>
        <ReviewInput getReview={getReview} item={item} />
        <div>

        </div>
        <div className="flex flex-col gap-3 mt-5">
          {
            reviews?.map((review: ReviewType) =>
              <Review review={review} />
            )
          }
        </div>

      </div>
    </div>
  );
};

export default Content;
