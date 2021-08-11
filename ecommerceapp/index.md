# eCommerce Platform 01 - FrontEnd, React, UI Design


### React Setup, Header and Footer

Create a folder /eshop and set up React,

```Bash
eShop % npx create-react-app frontend
eShop % cd frontend
frontend % npm start
frontend % rm -rf .git
```

React Bootstrap and ReactRouter

```Bash
frontend % npm i react-bootstrap
frontend % npm i react-router-dom react-router-bootstrap
```

Move .gitignore from eshop/frontend to /eshop

Create frontend/src/components/Header.js and Footer.js

- use `<LinkContainer to>` rather than `<href>` could avoid reload
  - faster

```js
// Header.js
import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container } from "react-bootstrap";
const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Yiyang's Shop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i> Sign In
                </Nav.Link>
              </LinkContainer>
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
import React from "react";
import PropTypes from "prop-types";

const Rating = ({ value, text, color }) => {
  return (
    <div className="rating">
      <span>
        <i
          style={{ color }}
          className={
            value >= 1
              ? "fas fa-star"
              : value >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 2
              ? "fas fa-star"
              : value >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 3
              ? "fas fa-star"
              : value >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 4
              ? "fas fa-star"
              : value >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 5
              ? "fas fa-star"
              : value >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>{text && text}</span>
    </div>
  );
};

Rating.defaultProps = {
  color: "#f8e825", // yellow stars
};
Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
};
export default Rating;
```

Create src/components/Product.js

- use Link to rather than a href could avoid reload
  - faster
- bootstrap card
- use `{props}`
- <a href={`/product/${product._id}`}>

```js
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
```

Create src/screens/HomeScreen.js

- loop through all products
- components can take in `props`
- Each child in a list should have a unique "key" prop.

```js
import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import products from "../products";
const HomeScreen = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
```

Create /src/screen/ProductScreen.js

- `:id` - placeholder in App.js Router
- fluid to make image inside its container
- Button disabled if out of stock

```js
import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import products from "../products";

const ProductScreen = ({ match }) => {
  const product = products.find((p) => p._id === match.params.id);
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
```

Overall, in App.js

- import BrowserRouter, which uses the HTML5 History API
  - push state, replace state
- `exact`: match exactly

```js
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/" component={HomeScreen} exact />
          <Route path="/product/:id" component={ProductScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
```

