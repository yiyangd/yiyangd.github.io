# eCommerce Platform 03 - Database, MongoDB, Postman


### Mongo DB Atlas & Compass Setup

Download Compass

- https://www.mongodb.com/try/download/compass

Create Database(Cluster) in mongodb.com

- Security => Database Access => Add new database user
- Network Access => Add IP Address => Allow Access From Anywhere => Confirm
- Databases => Browse Collections => Add my Own Data
  - db name: eshop
  - collection name: products
- Databases => Connect => Connect using MongoDB Compass => I have MongoDB Compass
  - Copy the connection string, and paste in MongoDB Compass App
  - modify `<password>` and /test => /eshop
- Databases => Connect => Connect your application (Node.js)
  - copy the connection string into Node.js Code
  - paste to `.env` with prefix `MONGO_URI = `
    - modify `<passowrd>` and `<dbname>` before `?`

### Connecting to the Database

mongoose: elegant mongodb object modeling for node.js

- https://mongoosejs.com/

```Bash
eshop % npm install mongoose --save
```

Create backend/config/db.js

- async: since `.connect`, `.find` or `.create` will return a promise
- await: since mongoose.connect() returns a promise
- host: cluster0-shard-00-01.qvmrm.mongodb.net

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // exit with failure
    process.exit(1);
  }
};

export default connectDB;
```

Connect DB in server.js

```js
import connectDB from "./config/db.js";
connectDB();
```

### Create Data Models

Create backend/models/userModel.js, productModel.js, orderModel.js

```js
// userModel.js
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestampes: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
```

```js
// productModel.js
import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestampes: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestampes: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
```

```js
// orderModel.js
import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestampes: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
```

### Sample Data for users and products

Create backend/data/users.js

- Use hashSync method to hash the password synchronously

```Bash
eShop % npm i bcryptjs
```

```js
import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdimin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
```

When data is entered into MongoDB, it automatically creates an `_id`

- delete `_id`s in products.js

### Data Seeder Script

Create backend/seeder.js

- easily import some sample data
- deleteMany before import data because we don't want to import anything with stuff already in the database

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    // ...:speread operator which will spread across all of the data
    // that's already there
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });
    // take product into model
    await Product.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
```

In package.json

```json
{
  "scripts": {
    "start": "node backend/server",
    "server": "nodemon backend/server",
    "client": "npm start --prefix frontend",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "data:import": "node backend/seeder",
    "data:destroy": "node backend/seeder -d"
  }
}
```

In terminal, run

- check data imported in `eshop.products` and `eshop.users` collections in `MongoDB Compass`

```Bash
eshop % npm run data:import
eshop % npm run data:destroy
```

### Fetch Products from Database

Create backend/routes/productRoutes.js

- move routes from `server.js`
- add `express-async-handler`: Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
  - https://www.npmjs.com/package/express-async-handler

```Bash
npm install --save express-async-handler
```

```js
// productRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
const router = express.Router();
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products);
  })
);

// @desc Fetch single products
// @route GET /api/products
// @access Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  })
);

export default router;
```

In server.js

```js
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use("/api/products", productRoutes);
```

### Postman

Download and create a new collection `eshop`

- Add Environment Variable: `eShop Env`
  - VARIABLE: `URL`
  - INITIAL VALUE: `http://localhost:5000`
  - env var is in `{{}}` in request
- create folder `Products`
  - Add `request`: `GET /api/products`
    - GET: `{{URL}}/api/products`
    - Click Send and get data

### Custom Error Handling

We want to send back an error message in JSON format rather than in HTML format when the `:id` format is wrong

Create backend/middleware/errorMiddleware.js: functions that has access to the request-response cycle

- 500: server error

```js
// errorMiddleware.js
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
```

In server.js

```js
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
app.use(notFound); // 404: url not be found
app.use(errorHandler); // 500: is not required format
```

Now fetch products from component,

- will do: use Redux so that have global state to get products and then pass them down
  - create `reducer` and `action`

