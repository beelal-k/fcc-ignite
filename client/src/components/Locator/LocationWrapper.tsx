import Locator from "./Locator";
import axios from "axios";
import { useEffect, useState } from "react";

const AddBaseForm = ({
  setRegion,
  Location,
  setLocation,
  handleSubmit,
  text,
  missiles,
  setMissiles,
}: {
  region: string;
  setRegion: (region: string) => void;
  Location: { lat: number; lng: number };
  setLocation: (location: { lat: number; lng: number }) => void;
  setBaseName: any;
  baseName: string;
  loading: boolean;
  handleSubmit: any;
  text?: string;
  setLoading: (loading: boolean) => void;
  missiles: string[];
  setMissiles: any;
}) => {
  // const [availableMissiles, setAvailableMissiles] = useState<MissileType[]>([]);
  // const [loadingMissiles, setLoadingMissiles] = useState(false);

  useEffect(() => {
    // fetchMissiles();
  }, []);

  const fetchMissiles = async () => {
    // try {
    //   setLoadingMissiles(true);
    //   const res = await axios.get(
    //     `${import.meta.env.VITE_BASE_URI}/missile/available`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   setAvailableMissiles(res.data);
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoadingMissiles(false);
    // }
  };

  // const handleMissileChange = (id: string, checked: boolean) => {
  //   if (checked) {
  //     setMissiles([...missiles, id]); // Add the missile ID
  //   } else {
  //     setMissiles(missiles.filter((missileId) => missileId !== id)); // Remove the missile ID
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="mb-6">
        <label
          htmlFor="baseName"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Base Name
        </label>
        <input
          type="text"
          id="baseName"
          // value={baseName}
          // onChange={(e) => setBaseName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
          required
        />
      </div>

      <Locator
        setLocation={setLocation}
        Location={Location}
        selectRegion={setRegion}
      />

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-900 mt-3 text-xl">
          Select Missiles
        </label>
        {/* {loadingMissiles ? (
          <p>Loading missiles...</p>
        ) : (
          availableMissiles.map((missile) => (
            <div key={missile._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`missile-${missile._id}`}
                //@ts-ignore
                checked={missiles.includes(missile._id)}
                onChange={(e) =>
                  //@ts-ignore
                  handleMissileChange(missile._id, e.target.checked)
                }
                className="mr-2"
              />
              <label
                htmlFor={`missile-${missile._id}`}
                className="text-gray-900 text-sm"
              >
                {missile.name}
              </label>
            </div>
          ))
        )} */}
      </div>

      <button
        type="submit"
        className="text-white mt-3 bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        {/* {loading ? "Loading..." : text ? text : "Add Base"} */}
      </button>
    </form>
  );
};

export default AddBaseForm;
