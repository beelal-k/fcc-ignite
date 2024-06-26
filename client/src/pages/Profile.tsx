import { Button } from "@/components/ui/button";
import PhotosUploader from "@/components/Uploaders/PhotoUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState<string>(user?.name ? user?.name : "");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.picture) {
      setImages([user?.picture]);
    }
  }, []);

  useEffect(()=>{
    if(user?.name){
      setName(user.name);
    }
  },[user])

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/auth`,
        {
          name: name,
          picture: images[0],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex min-h-screen items-center flex-col mt-10 md:px-0 px-7">
      <h1 className="text-3xl mb-10 font-semibold">Update your profile</h1>
      <div className="flex gap-3 items-center flex-col justify-center max-w-2xl">
        <Input
          type="text"
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Label
          htmlFor="profilePicture"
          className="flex justify-center flex-col"
        >
          <span className="text-gray-500 whitespace-nowrap font-medium my-2">
            Profile Picture
          </span>
          <PhotosUploader
            maxPhotos={1}
            addedPhotos={images}
            onChange={setImages}
          />
        </Label>

        <Button
          variant="default"
          className="w-full"
          onClick={() => {
            handleUpdateProfile();
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
