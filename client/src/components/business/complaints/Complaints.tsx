import { useEffect, useState } from "react";
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
import { toReadableDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import ReplyComplaintDialog from "./ReplyComplaintDialog";

const Complaints = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [text, setText] = useState("");
  const { toast } = useToast();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [open, setOpen] = useState(false);

  async function getAllComplaints() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/complaint/${user?.businessId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setComplaints(res.data);
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteComplaint = async (id: string) => {
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/complaint/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      getAllComplaints();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const replyToCamplaint = async (id: string) => {
    setDeleting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/complaint/reply/${id}`,
        {
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: "Response sent successfully",
      });
    } catch (error) {
      toast({
        title: "An error occured",
        description: error.response.data,
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getAllComplaints();
  }, []);

  return (
    <>
      <div className="flex w-full flex-row mb-3 justify-between">
        <h1 className="text-2xl font-semibold mb-3">Complaints</h1>
      </div>
      <ReplyComplaintDialog
        open={open}
        text={text}
        setText={setText}
        setOpen={setOpen}
        handleSubmit={() => {
          replyToCamplaint(selectedComplaint);
        }}
      />
      <Table>
        <TableCaption>
          A list of all complaints submitted to your business
        </TableCaption>
        <TableHeader className="hover:bg-secondary bg-secondary">
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[100px]">User name</TableHead>
            <TableHead className="w-[100px]">Message</TableHead>
            <TableHead className="w-[100px]">For item</TableHead>
            <TableHead className="w-[100px]">Created At</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints?.map((item: any) => (
            <TableRow key={item._id} className="">
              <TableCell className="font-medium">{item?._id}</TableCell>
              <TableCell className="font-medium">{item.userId.name}</TableCell>
              <TableCell className="font-medium">{item.message}</TableCell>
              <TableCell className="font-medium">{item.itemId.title}</TableCell>
              <TableCell className="font-medium">
                {toReadableDate(item.createdAt)}
              </TableCell>
              <TableCell className="font-medium">
                <div className="grid grid-2 grid-cols-2 gap-2 justify-start items-start p-1">
                  <Button
                    disabled={deleting}
                    onClick={() => deleteComplaint(item._id)}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {" "}
                <div className="grid grid-2 grid-cols-2 gap-2 justify-start items-start p-1">
                  <Button
                    disabled={deleting}
                    onClick={() => {
                      setSelectedComplaint(item._id);
                      setOpen(true);
                    }}
                    className="bg-[#FF5A5F] text-white hover:bg-yellow-600"
                  >
                    Reply
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Complaints;
