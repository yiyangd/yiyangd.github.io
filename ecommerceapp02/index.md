# eCommerce Platform 02 - Backend, Node.js, Fetch Data from React


{{< figure src="/images/eShop/front-back-end-workflow.png">}}

### Backend Setup

Create eShop/package.json

- backend setup for ES Module: `"type": "module",`

```bash
eshop % npm init
```

```json
{
  "name": "eshop",
  "version": "1.0.0",
  "description": "MERN eCommerce Platform",
  "main": "server.js",
  "type": "module",
  "author": "Yiyang Dong",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

### Nodemon & Concurrently

```Bash
eshop % npm i -D nodemon concurrently
```

In eshop/package.json

```json
{
  "type": "module",
  "scripts": {
    "start": "node backend/server",
    "server": "nodemon backend/server",
    "client": "npm start --prefix frontend",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },
  "devDependencies": {
    "concurrently": "^6.2.1",
    "nodemon": "^2.0.12"
  }
}
```

#### Environment Variables

Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

- https://www.npmjs.com/package/dotenv

```Bash
eshop % npm i dotenv
```

Create `eshop/.env`

- store sensitive information like Token or API keys
- in the `.gitignore` so will not be public

```.env
NODE_ENV = development
PORT = 5000
```

Create eShop/backend/server.js

- copy src/products.js to /backend/data folder
- create some routes to serve the products from the backend
  - react may make a request to the backend to get those products

```js
import express from "express";
import dotenv from "dotenv";
import products from "./data/products.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running.....");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
```

### React Frontend Fetching Products from Backend

Install Axios: a HTTP library to make request to backend

```Bash
front % npm i axios
```

In HomeScreen.js, to request products from backend rather ~~src/products.js~~

- add products as **component level state**
  - state: component leve, global/application level
  - products will be global state via Redux
- `useState` in functional components, no need constructors like class-based components
  - `setProducts` is function to change the state
- `useEffect` React Hook to make a request to backend
  - use `sync` and `await`: returns a `promise`
  - pass an array of denpendencies
- add a `"proxy": "http://127.0.0.1:5000"` in `package.json` we can look localhost:5000 rather than 3000

```js
import React, { useState, useEffect } from "react";
import axios from "axios";
//import products from "../products";
const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");

      setProducts(data);
    };
    fetchProducts();
  }, []);

  //return(...);
};
```

Doing the same things in ProductScreen.js

- `backticks` can contain variables `id`
- `match.params` is denpendency in useEffect Hook

```js
import React, { useState, useEffect } from "react";
import axios from "axios";
//import products from "../products";
const ProductScreen = ({ match }) => {
  //const product = products.find((p) => p._id === match.params.id);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${match.params.id}`);

      setProduct(data);
    };
    fetchProduct();
  }, [match.params]);
  //return(...);
};
```

