import { createContext, useEffect, useState } from "react";
import { products } from "../frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
    const currency = '$';
    const deliveryFee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    const addToCart = async (itemId, productSize) => {
        if (!localStorage.getItem('token')) {
            toast.info('You need to Login');
            navigate('/login');
        }
        if (!productSize) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][productSize]) {
                cartData[itemId][productSize] += 1;
            } else {
                cartData[itemId][productSize] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][productSize] = 1;
        }

        // console.log(cartData);
        setCartItems(cartData);
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                // console.log('cartItems[items]', cartItems[items]);
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                        // console.log('cartItems[items][item]', cartItems[items][item]);
                    }
                } catch (error) {
                    console.error("Error counting cart items:", error);
                }
            }
        }

        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;

        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }
        }

        // console.log(totalAmount);
        return totalAmount;
    }

    // add product to DB
    const addProduct = async (productInfo) => {
        try {
            const response = await axios.post('http://localhost:5000/api/product/addproduct', productInfo, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // console.log('Product added successfully:', response.data);
            toast.success('Product added successfully.');

        } catch (error) {
            const errorMessage = error.response
                ? error.response.data.message || 'An error occurred while adding the product.'
                : 'Network error. Please try again later.';
            console.error('Error adding product:', errorMessage);
            toast.error(errorMessage);
        }
    };


    const value = {
        products,
        currency,
        deliveryFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        addProduct,
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
