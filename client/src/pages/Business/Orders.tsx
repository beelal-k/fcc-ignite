import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "@/lib/utils";

const Orders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [deleting, setDeleting] = useState(false);

  async function getAllOrders() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/order/business/${user?.businessId}`
      );
      console.log(res.data)
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteOrder = async (id: string) => {
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      getAllOrders();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllOrders();
  }, []);

  return (
    <>
      <div className="flex w-full flex-row mb-3 justify-between">
        <h1 className="text-2xl font-semibold mb-3">Orders</h1>
        {/* <Link to={`/panel/create-item`}>
          <Button className="">Create item</Button>
        </Link> */}
      </div>
      <Table>
        <TableCaption>A list of your orders</TableCaption>
        <TableHeader className="hover:bg-secondary bg-secondary">
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">Payment Method</TableHead>
            <TableHead className="w-[100px]">Payment Status</TableHead>
            <TableHead className="w-[100px]">Total Items</TableHead>
            <TableHead className="w-[100px]">Total Price</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((item: any) => (
            <TableRow key={item._id} className="">
              <TableCell className="font-medium">{item._id}</TableCell>
              <TableCell className="font-medium">{item.booker_details.name}</TableCell>
              <TableCell className="font-medium">{capitalizeFirstLetter(item.payment_method)}</TableCell>
              <TableCell className="font-medium">{capitalizeFirstLetter(item.payment_status)}</TableCell>
              <TableCell className="font-medium">{item.items.length}</TableCell>
              <TableCell className="font-medium">{item.total_price}</TableCell>
              <div className="p-1">
                <Button
                  disabled={deleting}
                  onClick={() => deleteOrder(item._id)}
                  className="bg-red-500 text-white"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Orders;
