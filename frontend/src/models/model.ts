export type Address = {
   street: null;
   city: null;
   country: null;
   postalCode: null;
   state: null;
};

export type CartItem = {
   note: string;
   brand: string;
   category: string;
   cost: number;
   countInStock: number;
   description: string;
   id: string;
   image: string;
   name: string;
   price: number;
   quantity: number;
   ratings: number;
   size: number;
   slug: string;
   accountId: string;
   productId: string;
   unit: string;
};

export type ProductTemplate = {
   note: string;
   brand: string;
   category: string;
   cost: number;
   countInStock: number;
   description: string;
   id: string;
   image: string;
   name: string;
   price: number;
   quantity: number;
   ratings: number;
   size: number;
   slug: string;
   unit: string;
   max: number;
   min: number;
};

export type ProductType = {
   note: string;
   brand: string;
   category: string;
   cost: number;
   countInStock: number;
   description: string;
   id: string;
   image: string;
   name: string;
   price: number[];
   quantity: number;
   ratings: number;
   size: number;
   slug: string;
   unit: string;
   max: number;
   min: number;
   accountId: string;
   productId: string;
};

export type StoreState = {
   order: { orderCreatedId: string | null };
   cart: {
      cartItems: CartItem[];
      shippingAddress: Address;
      paymentMethod: string | null;
   };
   userInfo: User;
};

export type User = {
   id: string | null;
   address: Address;
   paymentMethod: string | null;
   email: string | null;
   displayName: string | null;
   role: string | null;
   account: {
      accountId: string | null;
      accountType: string | null;
      defaultSupplier: string | null;
   };
};

export type Account = {
   id: string | null;
   accountType: string | null;
   businessName: string | null;
   businessAddress: Address;
};

export type userAccount = {
   account: {
      accountId: string | null;
      accountType: string | null;
      defaultSupplier: {
         id: string | null;
         name: string | null;
      };
   };

   address: Address;
   displayName: string | null;
   email: string | null;
   role: string | null;
};
