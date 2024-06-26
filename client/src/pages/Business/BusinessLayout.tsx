import Sidebar from "@/components/business/sidebar/Sidebar";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const BusinessLayout = () => {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (loading || !user) return;
    if (user?.businessId == null) {
      console.log(user);
    }
  }, [loading]);

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <div className="px-10 py-5 w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default BusinessLayout;