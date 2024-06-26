import SolidCard from "@/components/Cards/SolidCard";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    {
        count: 0,
        itemName: "Crash at X Mension"
    },
    {
        count: 2,
        itemName: "Sogur House"
    },
];

const BusinessDashboard = () => {

    const { user } = useAuthStore();
    const [complaintCount, setComplaintCount] = useState<number>(0);
    const [itemCount, setItemCount] = useState<number>(0);
    const [items, setItems] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function getItemAnalytics() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/item/analytics/${user?.businessId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            setItemCount(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getItems() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/item/business/${user?.businessId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            setItems(res.data);
            let arr = res.data;
            arr.forEach(element => {
                items?.push({
                    itemName: element.title,
                    count: element.reviews?.length
                })

            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function getOrders() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/complaint/analytics/${user?.businessId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            setComplaintCount(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getItemAnalytics();
        getItems();
        getOrders();

    }, [])

    return (
        <div className="min-h-screen  dark:bg-white bg-opacity-30 pb-16">
            <div className="flex justify-center ">
                <div className="w-full py-10 px-5 flex flex-col gap-8">
                    <div className="w-full flex flex-row justify-between gap-5 border bg-white rounded-lg p-5 shadow-xl">
                        <div>

                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                className="mt-5"
                            >
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="itemName" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#FF385C" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                        <div className="w-1/3 flex flex-col justify-between">
                            <div>
                                <p className="text-2xl font-semibold">Total Items</p>
                               
                                <div className="flex flex-col mt-2 opacity-80 ">
                                </div>
                            </div>
                         </div>
                    </div>

                </div>

                <div className="w-1/2 flex flex-col gap-3 pt-10 pr-5">
                    <SolidCard title="Total Items" data={itemCount} bgStyle="bg-primary" titleStyle="text-white" dataStyle="text-white" />
                    <SolidCard title="Total Bookings" data={complaintCount} bgStyle="bg-white  border-2 border-primary" titleStyle="text-primary" dataStyle="text-primary" />
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
