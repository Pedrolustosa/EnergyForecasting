# Energy Forecasting - Solar Energy Prediction System

Complete system for solar energy forecasting composed of a Python API and a React web application.

## 📋 Overview

This project offers a complete solution for solar energy generation analysis and forecasting, using different machine learning models and a modern, intuitive web interface.

## 🏗️ Project Architecture

### 📁 EnergyForecasting.API
REST API developed in Python with FastAPI that provides the prediction models.

### 📁 EnergyForecasting.APP
Frontend web application developed in React with TypeScript.

---

## 🔧 API - EnergyForecasting.API

### Available Machine Learning Models

- **ARIMA**: Autoregressive Integrated Moving Average
- **ARIMAX**: ARIMA with exogenous variables
- **SVR**: Support Vector Regression
- **MLP**: Multi-Layer Perceptron (Neural Network)

### Technologies Used

- **Python 3.9**
- **FastAPI** - Modern and fast web framework
- **R** (via rpy2) - For ARIMA/ARIMAX models
- **scikit-learn** - SVR and MLP models
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **uvicorn** - ASGI server

### Installation and Setup

```bash
cd EnergyForecasting.API

# Install dependencies
pip install -r requirements.txt

# Or install specific versions
pip install fastapi==0.110.2 pydantic==2.7.3 uvicorn==0.29.0
pip install rpy2==3.5.0 pandas numpy scikit-learn python-multipart
```

### Running

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

- `POST /upload` - Upload CSV file with energy data
- `POST /predict/{model}` - Perform prediction with specified model
- `GET /results/{model}` - Get prediction results
- `GET /` - API home page

### Docker

```bash
cd EnergyForecasting.API
docker build -t energy-forecasting-api .
docker run -p 8000:8000 energy-forecasting-api
```

---

## 🌐 Frontend - EnergyForecasting.APP

### Technologies Used

- **React 19** - JavaScript library for interfaces
- **TypeScript** - Typed superset of JavaScript
- **Bootstrap 5** - Responsive CSS framework
- **Chart.js** - Interactive charts library
- **Axios** - HTTP client for API communication
- **Toastr** - Elegant notifications
- **Bootstrap Icons** - Modern icons

### Features

- ✅ Upload CSV files with energy data
- ✅ Selection of prediction models (ARIMA, ARIMAX, SVR, MLP)
- ✅ Interactive chart visualization of results
- ✅ Responsive and modern interface
- ✅ Real-time status notifications
- ✅ Comparison between different models

### Installation and Setup

```bash
cd EnergyForecasting.APP

# Install dependencies
npm install

# Or use yarn
yarn install
```

### Running

```bash
# Development
npm start
# or
yarn start

# Production build
npm run build
# or
yarn build
```

The application will be available at `http://localhost:3000`

### Deployment

The project is configured for automatic deployment on **Vercel**.

---

## 🚀 How to Use the Complete System

### 1. Start the API
```bash
cd EnergyForecasting.API
uvicorn main:app --reload
```

### 2. Start the Frontend
```bash
cd EnergyForecasting.APP
npm start
```

### 3. Access the Application
- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- Documentation: `http://localhost:8000/docs`

### 4. Using the Interface
1. Upload a CSV file with solar energy data
2. Select the desired prediction model
3. Visualize results in interactive charts
4. Compare different models

## 📊 Data Format

The CSV file should contain:
- **Date/time** - Data timestamps
- **Energy generation values** - Historical generation data
- **Meteorological variables** (optional for ARIMAX) - Temperature, irradiation, etc.

## 🔧 Environment Configuration

### Environment Variables

**Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:8000
```

**API**:
- Configure CORS origins in `main.py` file
- Adjust R settings if necessary

## 📈 Machine Learning Models

### ARIMA/ARIMAX
- Uses R's `forecast` library
- Ideal for time series with trends and seasonality
- ARIMAX allows including exogenous variables

### SVR (Support Vector Regression)
- Implemented with scikit-learn
- Effective for non-linear relationships
- Robust to outliers

### MLP (Multi-Layer Perceptron)
- Feedforward neural network
- Capable of capturing complex patterns
- Good performance with large data volumes

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the LICENSE file for more details.

## 👥 Authors

- Developed for solar energy analysis and forecasting
- Academic/professional project

---

**🌟 Complete solar energy forecasting system with modern interface and multiple ML models!**