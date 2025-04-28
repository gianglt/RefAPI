// server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Sử dụng fs.promises để làm việc với async/await
const cors = require('cors'); // <--- 1. Require package cors

const app = express();
const port = process.env.PORT || 3333; // Sử dụng cổng môi trường hoặc mặc định 3000

// Đường dẫn tuyệt đối đến thư mục 'data'
// __dirname là thư mục chứa file server.js hiện tại
const dataDir = path.join(__dirname, 'data');

// --- Middlewares ---

// Middleware để log request (tùy chọn)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware để cho phép CORS
// Sử dụng cors() với cấu hình mặc định (cho phép tất cả các origin)
app.use(cors()); // <--- 2. Sử dụng middleware cors()

/*
// --- Cấu hình CORS nâng cao (Ví dụ) ---
// Nếu bạn muốn chỉ cho phép các origin cụ thể:
const corsOptions = {
  origin: 'http://your-frontend-domain.com', // Chỉ cho phép domain này
  // hoặc nhiều domain: origin: ['http://localhost:8080', 'https://your-production-frontend.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
*/


// --- Hàm trợ giúp để đọc và gửi file JSON ---
const sendJsonFile = async (fileName, res) => {
  const filePath = path.join(dataDir, fileName);
  try {
    // Đọc nội dung file
    const data = await fs.readFile(filePath, 'utf8');
    // Parse JSON và gửi đi
    const jsonData = JSON.parse(data);
    res.json(jsonData); // Tự động set Content-Type là application/json
  } catch (error) {
    console.error(`Error reading or parsing file ${fileName}:`, error);
    // Xử lý lỗi: File không tồn tại hoặc không phải JSON hợp lệ
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: `Data file not found: ${fileName}` });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({ error: `Invalid JSON format in file: ${fileName}` });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// --- Định nghĩa các Endpoints ---

// Endpoint cho Customers
app.get('/api/customers', (req, res) => {
  sendJsonFile('customers.json', res);
});

// Endpoint cho Employees
app.get('/api/employees', (req, res) => {
  sendJsonFile('employees.json', res);
});

// Endpoint cho Products
app.get('/api/products', (req, res) => {
  sendJsonFile('products.json', res);
});

// Endpoint cho Orders
app.get('/api/orders', (req, res) => {
  sendJsonFile('orders.json', res);
});

// Endpoint cho Suppliers
app.get('/api/suppliers', (req, res) => {
  sendJsonFile('suppliers.json', res);
});

// Endpoint cho Categories
app.get('/api/categories', (req, res) => {
  sendJsonFile('categories.json', res);
});

// Endpoint cho Shippers
app.get('/api/shippers', (req, res) => {
  sendJsonFile('shippers.json', res);
});

app.get('/api/documenttypes', (req, res) => {  
  sendJsonFile('documenttypes.json', res);
});

// Endpoint để lấy danh sách các API có sẵn (từ listapi.json)
app.get('/api/listapi', (req, res) => {
  // Sử dụng lại hàm sendJsonFile để đọc và gửi nội dung của listapi.json
  sendJsonFile('listapi.json', res);
});

// Endpoint gốc (tùy chọn)
app.get('/', (req, res) => {
  res.send('API server is running. Access data endpoints like /api/customers, /api/products, etc.');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log('Data directory:', dataDir); // In ra đường dẫn data để kiểm tra
});
