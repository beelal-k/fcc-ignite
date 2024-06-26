import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import useAuthStore from '@/store/authStore'

const Customers = () => {

    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    let count = 0;

    async function getAllOrders() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/order/business/${user?.businessId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllOrders();
    }, [])

    return (
        <>
            <h1 className='text-2xl font-semibold mb-3'>Orders</h1>
            <Table>
                <TableCaption>A list of your orders</TableCaption>
                <TableHeader className='hover:bg-secondary bg-secondary'>
                    <TableRow className='bg-secondary hover:bg-secondary'>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        orders?.map((order) =>
                            <TableRow className=''>
                                <TableCell className="font-medium">{++count}</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}

export default Customers