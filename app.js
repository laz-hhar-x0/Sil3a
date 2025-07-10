const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 3007;


const Product = require("./models/Product");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // تأكد أنك عندك مجلد views




// MongoDB Connection

mongoose
  .connect(
    // "mongodb://principia480:principia480123@ac-vboffrf-shard-00-00.9rnjzv2.mongodb.net:27017,ac-vboffrf-shard-00-01.9rnjzv2.mongodb.net:27017,ac-vboffrf-shard-00-02.9rnjzv2.mongodb.net:27017/?replicaSet=atlas-149led-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=walid-moh"
  'mongodb://hakker58293:school123@ac-2ym0qvm-shard-00-00.28rnauf.mongodb.net:27017,ac-2ym0qvm-shard-00-01.28rnauf.mongodb.net:27017,ac-2ym0qvm-shard-00-02.28rnauf.mongodb.net:27017/?replicaSet=atlas-jjsoqj-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=school'  
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


  
// Routes
app.get("/", (req, res) => {res.render("welcom");});
app.get("/add", (req, res) =>{res.render("add");});


// عرض السلع
app.get("/show", async (req, res) => {
  try {
    const products = await Product.find().sort({ addedAt: -1 });
    res.render("show", { products }); // <== هنا تمرير المتغير
  } catch (err) {
    console.error(err);
    res.status(500).send("خطأ في جلب السلع.");
  }
});


app.get("/mabi3at", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("mabi3at", { products }); // ⬅️ مهم بزاف!
  } catch (err) {
    res.status(500).send("خطأ في جلب المبيعات");
  }
});

app.get("/fasiliti", (req, res) => res.render("fasiliti"));
app.get("/not-supported", (req, res) => res.render("not-supported"));




app.post("/add", async (req, res) => {
  const { name, quantity, price } = req.body; // ✅ أضف السعر هنا

  try {
    const newProduct = new Product({
      name,
      quantity,
      price  // ✅ أضف السعر هنا أيضاً
    });

    await newProduct.save();
    res.redirect("/show");
  } catch (err) {
    console.error(err);
    res.status(500).send("خطأ في إضافة السلعة.");
  }
});


// 🟢 راوت البيع
app.post("/sell/:id", async (req, res) => {
  const productId = req.params.id;
  const soldQuantity = parseInt(req.body.soldQuantity);

  try {
    const product = await Product.findById(productId);

    if (!product) return res.status(404).send("السلعة غير موجودة");
    if (soldQuantity > product.quantity) return res.status(400).send("الكمية غير كافية");

    product.quantity -= soldQuantity;
    await product.save();

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("خطأ في البيع");
  }
});









// حذف سلعة
app.post("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("خطأ في الحذف.");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { name, quantity, price } = req.body; // ⬅️ ضيف السعر هنا
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      quantity,
      price  // ⬅️ وحدث السعر هنا
    });
    res.redirect("/show");
  } catch (err) {
    res.status(500).send("فشل التعديل");
  }
});



// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/`);
});
