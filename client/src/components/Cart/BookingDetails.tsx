import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const BookingDetails = ({ cart }: { cart: any[] }) => {
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 w-full px-6 rounded-md p-4">
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex mb-6 items-center w-full md:min-w-[450px] justify-between"
        >
          <div className="flex  flex-col">
            <div>
              <h1 className="text-lg font-medium">{item.itemId.title}</h1>
              <p className="text-sm text-gray-400">{item.itemId.category}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">Total</h1>
        <h1 className="text-lg font-medium">
          PKR{" "}
          {cart
            .map((item) => item.totalPrice)
            .reduce((prev, curr) => prev + curr, 0)}
        </h1>
      </div>
      <Button
        className="mt-4 w-full"
        onClick={() => {
          navigate("/checkout");
        }}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default BookingDetails;