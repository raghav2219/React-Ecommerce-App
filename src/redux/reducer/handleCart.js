// Retrieve initial state from localStorage if available
const getInitialCart = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

// Get user ID from localStorage or use a default
const getUserId = () => {
    return localStorage.getItem('userId') || 'user123';
};

const syncWithMongoDB = async (state) => {
    try {
        const userId = getUserId();
        // Send the entire cart state to MongoDB
        await fetch(`http://localhost:5000/api/cart/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: state })
        });
        console.log('Successfully synced cart with MongoDB');
    } catch (error) {
        console.error('Error syncing with MongoDB:', error);
    }
};

const handleCart = (state = getInitialCart(), action) => {
    switch (action.type) {
        case "ADDITEM":
            try {
                const product = action.payload;
                // Check if product already in cart
                const exist = state.find((x) => x.id === product.id);
                let updatedCart;
                
                if (exist) {
                    // Increase the quantity
                    updatedCart = state.map((x) =>
                        x.id === product.id ? { ...x, qty: x.qty + 1 } : x
                    );
                } else {
                    updatedCart = [...state, { ...product, qty: 1 }];
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
                const exist2 = state.find((x) => x.id === product.id);
                let updatedCart;
                
                if (exist2.qty === 1) {
                    updatedCart = state.filter((x) => x.id !== exist2.id);
                } else {
                    updatedCart = state.map((x) =>
                        x.id === product.id ? { ...x, qty: x.qty - 1 } : x
                    );
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

        default:
            return state;
    }
};

export default handleCart;