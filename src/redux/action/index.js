// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// Async action for adding to MongoDB
export const addToCartAPI = (userId, product) => {
    return async (dispatch) => {
        try {
            const response = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, product })
            });
            const data = await response.json();
            dispatch(addCart(product));
            return data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }
}

// Async action for getting cart items from MongoDB
export const getCartItemsAPI = (userId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/items/${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }
}

// Async action for removing from MongoDB
export const removeFromCartAPI = (userId, productId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/remove/${userId}/${productId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            dispatch(delCart(productId));
            return data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }
}