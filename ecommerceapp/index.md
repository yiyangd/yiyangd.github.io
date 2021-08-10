# eShopApp 01 - FrontEnd, React, UI Design


### Header and Footer

Create a folder /eshop and set up React

```
eShop % npx create-react-app frontend
eShop % cd frontend
frontend % npm start
frontend % rm -rf .git
```

Move .gitignore from /frontend to /eshop

Create frontend/src/components/Header.js and Footer.js

```js
// Header.js
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">Yiyang's Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/cart">
                <i className="fas fa-shopping-cart"></i> Cart
              </Nav.Link>
              <Nav.Link href="/login">
                <i className="fas fa-user"></i> Sign In
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
```

```js
// Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; eShop</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
```

**Styling**  
Bootswatch: https://bootswatch.com/

- Lux: download bootstrap.min.css to frontend/src/
- `import './bootstrap.min.css'` in index.js

React Bootstrap: https://react-bootstrap.github.io/

```
frontend % npm i react-bootstrap
```

Font-Awesome: https://cdnjs.com/libraries/font-awesome

- copy all.min.css
- paste in `index.html`, link part
- add icon in front of cart and login in `Header.js`

### Product HomePage and Rating

Create src/products.js and add public/images/ to save products' images

```js
const products = [
  {
    _id: "1",
    name: "Airpods Wireless Bluetooth Headphones",
    image: "/images/airpods.jpg",
    description:
      "Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
    brand: "Apple",
    category: "Electronics",
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    /// other products with their properties
  },
];

export default products;
```

Create src/components/Rating.js

- props: `{value, text}`
- font-awseome: star, empty star, half star
- set default color property
- set Prop Type

```js

```

Create src/components/Product.js

- bootstrap card
- use `{props}`
- <a href={`/product/${product._id}`}>

```js

```

Create src/screens/HomeScreen.js

- loop through all products
- components can take in `props`
- Each child in a list should have a unique "key" prop.

```js

```

Overall, In App.js

### React Router

```
npm i reac
```

