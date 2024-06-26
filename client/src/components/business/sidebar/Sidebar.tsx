import React from "react";
import { Link } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaBoxOpen,
    FaFileInvoiceDollar,
    FaCog,
} from "react-icons/fa";

const Sidebar = () => {


    const links = [
        {
            id: 0,
            name: "Dashboard",
            path: "/panel",
            icon: <FaTachometerAlt />,
        },
        {
            id: 2,
            name: "Items",
            path: "/panel/items",
            icon: <FaBoxOpen />,
        },
        {
            id: 3,
            name: "Bookings",
            path: "/panel/orders",
            icon: <FaFileInvoiceDollar />,
        }
    ];

    return (
        <div className="w-[300px] transition-all h-screen pt-6 px-4 flex flex-col gap-4 bg-primary/30 dark:bg-dark">
            {links.map((link) => (
                <Link to={link.path} key={link.id}>
                    <p className={`flex items-center px-4 py-2 rounded-xl gap-2 text-gray-700 dark:text-white transition-all hover:bg-primary/10 `}>
                        <span className="text-xl text-white p-2 rounded-lg bg-[#FF5A5F]">{link.icon}</span>
                        <span className="ml-2 font-semibold">{link.name}</span>
                    </p>
                </Link>
            ))}
        </div>
    );
};

export default Sidebar;
