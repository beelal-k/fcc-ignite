import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useAuthStore from "@/store/authStore";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { BiRefresh } from "react-icons/bi";

const formSchema = z.object({
    budget: z.string()
});

type FormValues = z.infer<typeof formSchema>;

const SurpriseMe = () => {
    const { toast } = useToast();
    const { appendToWishlist, removeFromWishlist } = useAuthStore();
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useAuthStore();
    const [items, setItems] = useState<any>(null);
    const [empty, setEmpty] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number>(0);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            setLoading(true);
            await axios.get(`${import.meta.env.VITE_BASE_URI}/item/surprise/${values.budget}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ).then((res) => {
                if (res.data.length == 0) {
                    setEmpty(true);
                    return;
                }
                setItems(res.data);
                // get random from the array
                const random = Math.abs(Math.floor(Math.random() * res.data.length - 1));
                setSelectedItem(random);
                let arr = items;
                // remove the current selected one from the array
                arr.splice(selectedItem, 1);
                setItems(arr);
                setLoading(false);
            })
        } catch (error: any) {
            if (error) {
                console.log(error);
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    const checkIfInWishlist = (id: string) => {
        if (!user) return false;
        //@ts-ignore
        const isWishlisted = user.wishlist.includes(id);
        return isWishlisted;
    };

    const handleWishlist = async (id: string) => {
        setUpdating(true);
        if (!user?._id) return;
        try {
            if (checkIfInWishlist(id)) {
                removeFromWishlist(id);
                await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/auth/wishlist/remove/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setUpdating(false);
            } else {
                appendToWishlist(id);
                await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/auth/wishlist/append/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setUpdating(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdating(false);
        }
    };


    return (
        <>
            {
                empty ?
                    <div className="h-screen  text-black text-center justify-center flex flex-col gap-5 items-center">
                        <h1 className="text-4xl font-semibold">Look's like we don't have any recommendations at the moment :(</h1>
                        <Link to={'/'}>
                            <Button>Go back home</Button>
                        </Link>
                    </div>
                    :
                    null
            }


            {
                loading &&
                <>

                    <div key={1} className="flex flex-col justify-center h-screen items-center gap-3 ">
                        <Skeleton className="h-[200px] bg-primary/20 dark:bg-primary/20 w-2/3 rounded-xl" />
                        <Skeleton className="h-[50px] bg-primary/20 dark:bg-primary/20 w-[400px] rounded-xl" />
                    </div>
                </>
            }
            {
                !items && !empty &&
                <>
                    < Form {...form}>
                        <div className="flex flex-col w-full h-screen items-center mt-40  ">
                            <div className="p-10 rounded-lg bg-white shadow-sm ">
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-[700px] space-y-5 max-h-[900px]"
                                >
                                    <div className="mb-6 w-full space-y-2">
                                        <h1 className="text-center font-semibold text-4xl text-black ">
                                            Don't know where to go?
                                        </h1>
                                        <p className="text-center text-gray-500 text-lg">
                                            Let us surprise you with a location that fits your budget!
                                        </p>
                                    </div>
                                    <FormField
                                        disabled={loading}
                                        control={form.control}
                                        name="budget"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Budget</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={loading} className="w-full" type="submit">
                                        {loading ? <div className="dotFlashing"></div> : <p>Surprise me!</p>}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </Form >
                </>
            }


            {
                items && !empty &&
                <div className="mx-auto flex flex-col gap-5 justify-center h-screen items-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold">We think this choice is just right for you!</h1>
                        {/* <p className="text-xl opacity-70">If you want us to try again, feel free to press the button</p> */}
                    </div>
                    <Link
                        to={`/item/${items[selectedItem]?._id}`}
                        key={items[selectedItem]?._id?.toString()}
                        className="bg-gradient-to-br w-full  md:w-[500px] cursor-pointer relative from-gray-50 h-[330px] to-white rounded-xl overflow-hidden border  flex flex-col items-center"
                    >
                        <div className="h-[200px] overflow-hidden w-full">
                            <img
                                src={items[selectedItem]?.images[0]}
                                alt={items[selectedItem]?.title}
                                className="w-full h-full object-cover transition-all duration-200 shadow-sm hover:scale-110"
                            />
                            <div
                                className="absolute right-4 top-4 z-10"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (updating) {
                                        // can add a return here;
                                    }
                                    handleWishlist(items[selectedItem]?._id);
                                }}
                            >
                                <FaRegHeart
                                    className={`${"block"}  text-white/80 text-lg
                            }`}
                                />
                            </div>
                            <div className="absolute right-4 top-4">
                                {items[selectedItem]?._id && (
                                    <FaHeart
                                        className={`${checkIfInWishlist(items[selectedItem]?._id?.toString())
                                            ? "text-red-500"
                                            : "text-black opacity-50"
                                            } text-lg`}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="w-full h-full max-h-[130px] px-4 pt-2">
                            <h3 className="text-lg mb-1 mt-2 font-medium">
                                {items[selectedItem]?.title.length > 18
                                    ? items[selectedItem]?.title.slice(0, 18) + "..."
                                    : items[selectedItem]?.title}
                            </h3>
                            <div className="flex items-center justify-between">
                                <p className="text-yellow-600 font-medium">PKR {items[selectedItem]?.price}</p>
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <FaStar
                                            key={index}
                                            className={`text-[#FF5A5F] text-xs ${index < Math.round(4.5)
                                                ? "text-[#FF5A5F]"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <p className="text-xs text-gray-600 ml-2">
                                        ({items[selectedItem]?.reviews?.length})
                                    </p>
                                </div>
                            </div>
                            <p className="bg-[#FF5A5F] absolute left-4 bottom-4 text-white text-xs w-fit px-2 py-1 rounded-xl">
                                {items[selectedItem]?.category}
                            </p>
                        </div>
                    </Link>
                    <Button onClick={() => window.location.reload()}><BiRefresh size={30} className="text-white" /></Button>
                </div>
            }
        </>
    );
};

export default SurpriseMe;
