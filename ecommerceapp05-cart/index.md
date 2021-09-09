# eCommerce Platform 05 - Shopping Cart Implementation


### 1. Qty Select & Add to Cart Button

In `ProductScreen.js`

- import `useState`
- add `qty`, `history`, `addToCartHandler`

```javascript
import React, { useState, useEffect } from "react";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(0)
  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };
  return (
  <>
    {product.countInStock > 0 && (
      <ListGroup.Item>
        <Row>
          <Col>Qty</Col>
          <Col>
            <Form.Control
              as="select"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            >
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </ListGroup.Item>
    )}

    <ListGroup.Item>
      <Button
        onClick={addToCartHandler}
        className="btn-block"
        type="button"
        disabled={product.countInStock === 0}
      >
        Add To Cart
      </Button>
    </ListGroup.Item>
  </ListGroup>

  )}
  </>
);
}
```

### 2. Cart Reducer & Add-to-Cart Action

Create frontend/src/constants/cartConstants.js

```js
export const CART_ADD_ITEM = "CART_ADD_ITEM";
export const CART_REMOVE_ITEM = "CART_REMOVE_ITEM";
```

Create frontend/src/reducers/cartReducers.js

```js
import { CART_ADD_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    default:
      return state;
  }
};
```

Create frontend/src/actions/cartActions.js

- `axios`: when we add an item to the cart, we want to make a request to API products and then the id to get the data for that particular product to add to our cart

```js
import axios from "axios";
import { CART_ADD_ITEM } from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
```

Add `cartReducer` in frontend/src/store.js

- get item by `cartItemsFromStorage`

```js
import {
  productListReducer,
  productDetailsReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cart: { cartItems: cartItemsFromStorage },
};
```

Create frontend/src/screens/CartScreen.js

- import to App.js and add routes

```js

```

