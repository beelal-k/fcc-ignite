import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ReplyComplaintDialog({
  handleSubmit,
  open,
  setOpen,
  text,
  setText,
}: {
  handleSubmit: any;
  open: boolean;
  setOpen: any;
  text: string;
  setText: any;
}) {
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    setLoading(false);
    await handleSubmit();
    setLoading(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reply to the complaint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Text
            </Label>
            <Input
              onChange={(e)=>{
                setText(e.target.value);
              }}
              id="name"
              value={text}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleReply}>
            {loading ? "replying..." : "Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
