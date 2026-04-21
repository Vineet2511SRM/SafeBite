const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
const frontendIndexPath = path.join(frontendBuildPath, 'index.html');

app.use(cors());
app.use(express.json());

// Routes
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const productRoutes = require('./routes/productRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
    if (!fs.existsSync(frontendIndexPath)) {
        return res.status(500).send(
            'Frontend build is missing. Run "npm run build" inside the frontend folder, then restart the backend.'
        );
    }

    res.sendFile(frontendIndexPath);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other server or set a different PORT in backend/.env.`);
        process.exit(1);
    }

    throw error;
});
