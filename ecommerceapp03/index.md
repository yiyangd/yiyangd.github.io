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
  - modify <password> and /test => /eshop
- Databases => Connect => Connect your application (Node.js)
  - copy the connection string into Node.js Code
  - paste to `.env` with prefix `MONGO_URI = `
    - modify <passowrd> and <dbname> before `?`

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

