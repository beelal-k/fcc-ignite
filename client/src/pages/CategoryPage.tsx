import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import HomeItem from "@/components/HomeItem";

const CategoryPage = () => {
  const { category } = useParams();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchItems();
  }, [category]);

  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/item?category=${category}`
      );
      setItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10 flex px-4 md:px-10 lg:px-16 xl:justify-normal lg:justify-normal md:justify-center justify-center min-h-screen">
      <div className="flex md:flex-row flex-wrap xl:justify-normal lg:justify-normal md:justify-normal justify-center  flex-col gap-6">
        {loading && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3 ">
                <Skeleton className="h-[200px] bg-primary/20 dark:bg-primary/20 w-2/3 rounded-xl" />
                <Skeleton className="h-[50px] bg-primary/20 dark:bg-primary/20 w-[400px] rounded-xl" />
              </div>
            ))}
          </>
        )}
        {!loading && items.length === 0 && <p>No items found.</p>}
        {!loading &&
          items.map((item) => <HomeItem key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default CategoryPage;
