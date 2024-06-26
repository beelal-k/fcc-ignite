
type User = {
    _id: number;
    name: string;
    email: string;
    approved: boolean;
    businessId: string;
    cart: [],
    wishlist: [],
    notifications: [],
    isVerified: boolean;
    picture: string,
    createdAt: string;
    updatedAt: string;
};


interface SubcategoryType {
    _id?: any;
    title: string;
    image: string;
}

interface CategoryType {
    _id?: any;
    title: string;
    value: string;
    image: string;
    subcategories: SubcategoryType[];
}

interface AvailableDates {
    all_available: boolean;
    dates: Date[];
}

interface ReviewType {
    userId: string;
    review: string;
    rating: number;
    createdAt: string;
    itemId: string;
}

interface ServiceType {
    title: string;
    options: [
        {
            title: string;
            price: number;
            description?: string;
        }
    ];
}

interface ItemType {
    _id?: any;
    title: string;
    category: string;
    subcategory: string;
    businessId: string;
    city: string;
    images: string[];
    content: [
        {
            title: string;
            markdown: string;
        }
    ];
    price: number;
    reviews?: ReviewType[];
    services: ServiceType[];
    available_dates: AvailableDates;
}

type BigCartItemType = cartItemType & {
    item: ItemType;
};

type cartItemType = {
    _id?: string;
    itemId: any;
    selectedDate: Date;
    selectedServices: {
        title: string;
        selectedOption: {
            title: string;
            price: number | undefined;
            description?: string;
        };
    }[];
    persons: {
        adults: number;
        children: number;
        infants: number;
    };
    totalPrice: number;
};

type userType = {
    _id?: any;
    email: string;
    password: string;
    name: string;
    cart: any[];
    orders: any[];
    isAdmin: boolean;
    wishlist: any[];
    city?: string;
    country?: string;
};

type OrderType = {
    _id?: any;
    items: {
        itemId: any;
        selectedDate: Date;
        personsCount: number;
        itemPrice: number;
        // personsDetails: {
        //   title: string;
        //   name: string;
        //   dob: Date;
        // }[];
        selectedServices: {
            title: string;
            selectedOption: {
                title: string;
                price: number | undefined;
                description?: string;
            };
        }[];
    }[];
    userId: any;
    booker_details: {
        name: string;
        email: string;
        phone: string;
        city: string;
        country: string;
        address: string;
    };
    total_price: number;
    payment_status?: string;
    payment_method?: string;
    order_status?: string;
};

type ForumType = {
    _id?: string;
    title: string;
    content: string;
    likes: [];
    dislikes: [];
    replyCount: number;
    userId: User
    replies: ReplyType[];
    createdAt: string;

}

type ReplyType = {
    content: string;
    likes: Array<any>;
    dislikes: Array<any>;
    userId: User;
    createdAt: string;
    forumId: ForumType;
    _id: string;
}


export type {
    CategoryType,
    userType,
    SubcategoryType,
    ItemType,
    ReviewType,
    ServiceType,
    AvailableDates,
    cartItemType,
    BigCartItemType,
    OrderType,
    User,
    ForumType,
    ReplyType,
};
