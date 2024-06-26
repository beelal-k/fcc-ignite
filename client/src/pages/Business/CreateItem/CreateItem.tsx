import { zodResolver } from "@hookform/resolvers/zod";
import PhotosUploader from "@/components/Uploaders/PhotoUploader";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cats } from "@/components/Header/Menu/Menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Locator from "@/components/Locator/Locator";
import { DatePickerWithRange } from "@/components/DatePicker/DatePicker";
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(6),
  category: z.string(),
  content: z.array(z.object({ title: z.string(), markdown: z.string() })),
  images: z.array(z.string()).nonempty(),
  videos: z.array(z.string()).optional(),
  personsCapacity: z.number().min(1),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    region: z.string(),
  }),
  price: z.string(),
  availableDates: z.object({
    dates: z.array(z.string()),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateItem = () => {
  const [images, setImages] = useState<any>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<any>();
  const [region, setRegion] = useState();
  let count = 0;
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      content: [{ title: "", markdown: "" }],
      images: [],
      personsCapacity: 1,
      videos: [],
      location: { lat: 0, lng: 0, region: "" },
      price: "",
      availableDates: { dates: [] },
    },
  });

  useEffect(() => {
    if (images.length > 0) {
      form.setValue("images", images);
    }
  }, [images]);

  useEffect(() => {
    if (location) {
      form.setValue("location.lat", location.lat);
      form.setValue("location.lng", location.lng);
    }
    if (region) {
      form.setValue("location.region", region);
    }

    if (date) {
      if (date.from && date.to) {
        // form.setValue("availableDates.allAvailable", false);
        form.setValue("availableDates.dates", [
          date.from.toISOString(),
          date.to.toISOString(),
        ]);
      }
    }
  }, [location, region, date]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BASE_URI}/item`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast({
        title: "Item created successfully",
        description: "You have successfully created a new item",
      });
      //   navigate("/");
    } catch (error: any) {
      if (error.response.data) {
        return toast({
          title: "An error occurred",
          // description: error.response.data,
          variant: "destructive",
        });
      }
      toast({
        title: "An error occurred",
        description: "An error occurred while creating the item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  form.watch("content");

  return (
    <Form {...form}>
      <div className="flex flex-col w-full min-h-screen items-center pb-[700px]">
        <div className="rounded-lg bg-white shadow-sm">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[800px] space-y-2 max-h-[900px]"
          >
            <div className="mb-6 w-full space-y-2">
              <h1 className="text-center font-semibold text-3xl text-black ">
                Create a new item
              </h1>
              <p className="text-center text-gray-500 text-sm">
                Enter your item details below
              </p>
            </div>
            <FormField
              disabled={loading}
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => {
                form.setValue("content", [
                  ...form.getValues("content"),
                  { title: "", markdown: "" },
                ]);
              }}
            >
              Add Content
            </Button>
            {form.getValues("content")?.map((content: any, index: number) => (
              <div key={index}>
                <FormField
                  control={form.control}
                  name={`content.${index}.title`}
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Content Title</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`content.${index}.markdown`}
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Content Markdown</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const newContent = form.getValues("content");
                    newContent.splice(index, 1);
                    form.setValue("content", newContent);
                  }}
                >
                  Remove Content
                </Button>
              </div>
            ))}

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <select
                    value={field.value}
                    onChange={(e)=>{
                      form.setValue("category", e.target.value)
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {cats.map((category: any) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personsCapacity"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Persons Capacity</FormLabel>
                  <FormControl>
                    <Input placeholder="" 
                    type="number"
                    value={field.value}
                    onChange={(e) => form.setValue("personsCapacity", parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={loading}
              control={form.control}
              name="price"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DatePickerWithRange date={date} setDate={setDate} />
            <h2>
              Photos Uploader
            </h2>
            {/* @ts-ignore */}
            <PhotosUploader
              addedPhotos={images}
              maxPhotos={10}
              onChange={setImages}
              key={++count}
            />
            {/* <h2>
              Video Uploader
            </h2> */}
            {/* <VideoUploader
            //@ts-ignore
              addedVideos={form.getValues("videos")}
              onChange={(videos: any) => form.setValue("videos", videos)}
            /> */}
            <div>
              <Locator
                Location={location}
                setLocation={setLocation}
                region={region}
                //@ts-ignore
                selectRegion={setRegion}
              />
            </div>
            <Button disabled={loading} className="w-full" type="submit">
              {loading ? <div className="dotFlashing"></div> : <p>Submit</p>}
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default CreateItem;
