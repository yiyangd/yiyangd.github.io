# eCommerce Platform 05 - Shopping Cart


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
Create frontend/src/screens/CartScreen.js

- import to App.js and add routes

```js

```

