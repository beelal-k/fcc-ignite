import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import PhotosUploader from "@/components/Uploaders/PhotoUploader";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
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

const EditItemModal = ({
  item,
  isOpen,
  onClose,
  refresh,
}: {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  refresh: any;
}) => {
  const [images, setImages] = useState<string[]>(item.images || []);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<any>(item.location);
  const [region, setRegion] = useState<string>(item.location?.region || "");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(item.availableDates?.dates[0]),
    to: new Date(item.availableDates?.dates[1]),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item,
  });

  useEffect(() => {
    if (images.length > 0) {
      //@ts-ignore
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
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/item/${item._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: "Item updated successfully",
        description: "You have successfully updated the item",
      });
      onClose();
      refresh();
    } catch (error: any) {
      if (error.response.data) {
        return toast({
          title: "An error occurred",
          variant: "destructive",
        });
      }
      toast({
        title: "An error occurred",
        description: "An error occurred while updating the item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
        <div className="relative bg-white rounded-lg w-full max-w-2xl mx-auto p-4 max-h-[500px] overflow-y-auto">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <h1 className="text-center font-semibold text-3xl text-black">
                Edit Item
              </h1>
              <FormField
                disabled={loading}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() =>
                  form.setValue("content", [
                    ...form.getValues("content"),
                    { title: "", markdown: "" },
                  ])
                }
              >
                Add Content
              </Button>
              {form.getValues("content")?.map((content, index) => (
                <div key={index}>
                  <FormField
                    control={form.control}
                    name={`content.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`content.${index}.markdown`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Markdown</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Markdown" {...field} />
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
                      onChange={(e) =>
                        form.setValue("category", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {cats.map((category) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persons Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="Persons Capacity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DatePickerWithRange date={date} setDate={setDate} />
              <h2>Photos Uploader</h2>
              <PhotosUploader
                addedPhotos={images}
                maxPhotos={10}
                onChange={setImages}
              />
              <Locator
                Location={location}
                setLocation={setLocation}
                region={region}
                selectRegion={setRegion}
              />
              <Button disabled={loading} className="w-full" type="submit">
                {loading ? <div className="dotFlashing"></div> : <p>Submit</p>}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    )
  );
};

export default EditItemModal;
