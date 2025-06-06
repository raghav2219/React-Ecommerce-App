// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const DELETE_CART_ITEM = 'DELETE_CART_ITEM';
const SET_CART = 'SET_CART';
const SET_CART_FROM_LOGIN = 'SET_CART_FROM_LOGIN';
const RESET_CART = 'RESET_CART';

// Action creator for resetting cart
export const resetCart = () => ({
    type: RESET_CART
});

// Retrieve initial state from localStorage if available
const getInitialCart = () => {
    try {
        const storedCart = localStorage.getItem("cart");
        if (!storedCart) return [];
        
        const parsed = JSON.parse(storedCart);
        
        // Ensure we have an array of items
        if (Array.isArray(parsed.items)) {
            return parsed.items;
        } else if (Array.isArray(parsed)) {
            return parsed;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        return [];
    }
};

// Action creator for setting cart from login
export const setCartFromLogin = (cartData) => {
    // Ensure we always have a consistent structure
    const payload = Array.isArray(cartData) 
        ? { items: cartData, total: 0 } 
        : cartData || { items: [], total: 0 };
        
    return {
        type: SET_CART_FROM_LOGIN,
        payload: payload
    };
};

// Get user ID from the authenticated user's data
const getUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        const user = JSON.parse(userStr);
        if (!user) return null;
        
        return user._id || user.id;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

// Sync cart with MongoDB
const syncWithMongoDB = async (state) => {
    try {
        const token = localStorage.getItem('token');
        const userId = getUserId();
        
        if (!token || !userId) return;

        const cartData = {
            items: state.map(item => ({
                productId: item.id,
                productName: item.title || 'Product',
                quantity: item.qty || 1,
                price: item.price || 0
            }))
        };
        
        const response = await fetch(`http://localhost:5000/api/cart/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('Cart synced successfully:', data);
    } catch (error) {
        console.error('Error syncing cart:', error);
    }
};

// Cart reducer
const handleCart = (state = getInitialCart(), action) => {
    // Ensure state is always an array
    const currentState = Array.isArray(state) ? state : [];

    switch (action.type) {
        case "ADDITEM":
            try {
                const product = action.payload;
                // Check if product already in cart
                const exist = currentState.find((x) => x && x.id === product.id);
                let updatedCart;
                
                if (exist) {
                    // Increase the quantity
                    updatedCart = currentState.map((x) =>
                        x.id === product.id ? { ...x, qty: (x.qty || 1) + 1 } : x
                    );
                } else {
                    updatedCart = [...currentState, { ...product, qty: 1 }];
                }
                
                // Update localStorage
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                
                // Sync with MongoDB (in background)
                syncWithMongoDB(updatedCart);
                
                return updatedCart;
            } catch (error) {
                console.error('Error updating cart:', error);
                return state;
            }

        case "DELITEM":
            try {
                const product = action.payload;
                const exist2 = currentState.find((x) => x && x.id === product.id);
                let updatedCart;
                
                if (exist2.qty === 1) {
updatedCart = currentState.filter((x) => x && x.id !== exist2.id);
                } else {
                    updatedCart = currentState.map((x) =>
                        x && x.id === product.id ? { ...x, qty: Math.max(0, (x.qty || 1) - 1) } : x
                    ).filter(x => x); // Remove any null/undefined items
                }
                
                // Update localStorage
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                
                // Sync with MongoDB (in background)
                syncWithMongoDB(updatedCart);
                
                return updatedCart;
            } catch (error) {
                console.error('Error removing from cart:', error);
                return state;
            }

        case "SET_CART":
            try {
                localStorage.setItem("cart", JSON.stringify(action.payload));
                return action.payload;
            } catch (error) {
                console.error('Error setting cart:', error);
                return state;
            }

        case "SET_CART_FROM_LOGIN":
            try {
                // Handle both direct cart items and nested items in payload
                const cartItems = Array.isArray(action.payload) 
                    ? action.payload 
                    : (action.payload?.items || []);
                
                // Transform cart items to match frontend format if needed
                const transformedItems = cartItems.map(item => ({
                    id: item.productId || item.id,
                    title: item.productName || item.title || 'Product',
                    price: item.price || 0,
                    qty: item.quantity || item.qty || 1,
                    // Include any additional fields that might be needed
                    ...(item.image && { image: item.image })
                }));
                
                localStorage.setItem("cart", JSON.stringify(transformedItems));
                return transformedItems;
            } catch (error) {
                console.error('Error setting cart from login:', error);
                return state;
            }

        case "RESET_CART":
            try {
                localStorage.removeItem("cart");
                return [];
            } catch (error) {
                console.error('Error resetting cart:', error);
                return [];
            }

        default:
            return state;
    }
};

export default handleCart;