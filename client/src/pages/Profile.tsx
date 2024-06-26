import { Button } from "@/components/ui/button";
import PhotosUploader from "@/components/Uploaders/PhotoUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { sampleCats } from "@/constants";

import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState<string>(user?.name ? user?.name : "");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.picture) {
      setImages([user?.picture]);
    }
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/auth`,
        {
          name: name,
          picture: images[0],
          preferences: preferences,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex min-h-screen items-center flex-col md:pt-28 pt-24 md:px-0 px-7">
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
        <div className="flex flex-col gap-3 w-full">
          <span className="text-gray-500 font-medium">Preferences</span>
          <div className="flex gap-3 flex-wrap">
            {sampleCats.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  if (preferences.includes(cat)) {
                    setPreferences(preferences.filter((p) => p !== cat));
                  } else {
                    setPreferences([...preferences, cat]);
                  }
                }}
                className={`p-2 whitespace-nowrap md:border-2 border border-gray-300 md:text-md text-sm rounded-md cursor-pointer ${preferences.includes(cat) ? "bg-gray-100 border-black" : ""
                  }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
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
