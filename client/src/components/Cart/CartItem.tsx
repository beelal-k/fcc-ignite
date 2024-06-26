import { MdDeleteOutline } from "react-icons/md";
import { useToast } from "../ui/use-toast";

const CartItem = ({
  cartItem,
  handleRemoveFromPage,
}: {
  cartItem: any;
  handleRemoveFromPage: (id: string) => void;
}) => {
  const { toast } = useToast();
  // const { removeFromCart } = useAuthStore();

  const handleDelete = async () => {
    if (cartItem._id === undefined) {
      return;
    }
    try {
      // await deleteCartItem(cartItem._id);
      // removeFromCart(cartItem._id);
      handleRemoveFromPage(cartItem._id);
      toast({
        title: "Item removed from the Cart",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex w-full relative overflow-hidden border border-gray-200 rounded-md max-w-[600px]">
      <div
        className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-white rounded-br-md cursor-pointer"
        onClick={handleDelete}
      >
        <MdDeleteOutline className="w-5 h-5 text-gray-500" />
      </div>
      <img
        src={cartItem.itemId.images[0]}
        alt={cartItem.itemId.title}
        className="w-32 h-32 object-cover"
      />
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg font-medium text-gray-800">
          {cartItem.itemId.title}
        </h3>
        <p className="text-sm font-medium text-gray-500">
          PKR {cartItem.itemId.price}
        </p>
        <p className="text-sm text-gray-500">
          {cartItem.persons.adults} Adults, {cartItem.persons.children}{" "}
          Children, {cartItem.persons.infants} Infants
        </p>
        <p className="text-sm text-gray-500"></p>
      </div>
    </div>
  );
};

export default CartItem;
