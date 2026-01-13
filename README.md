
# NutriSaath - Food Label Scanner with Trust Layer

A comprehensive food label scanning application for Indian consumers and producers, featuring AI-powered nutrition analysis, Trust Layer for traceability, and dual-side platform architecture.

## 🌟 Features

### Consumer Portal
- **Barcode Scanner**: Scan product barcodes to get instant nutrition analysis
- **Health Scoring**: Personalized health scores based on user profiles (Adult, Child, Senior)
- **Bill Scanner**: Analyze entire shopping bills for health insights
- **Learn Section**: 8 comprehensive lessons on food literacy
- **Trust & Authenticity**: Verify product batch safety and producer compliance
- **Multi-language Support**: English, Hindi, and Kannada

### Producer Portal
- **Compliance Profile**: Manage business details and FSSAI licensing
- **Label Wizard v2**: 5-step wizard for creating compliant food labels
- **Trust Code QR**: Generate batch-specific QR codes for traceability
- **Batch Recall Management**: Real-time batch status updates and recall handling
- **Market Trends**: AI-powered insights for product planning

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **UI**: Tailwind CSS + Shadcn UI
- **AI**: Google Gemini API
- **Data Source**: Open Food Facts API

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Google Gemini API key

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SanskariXD/Nutri-Saath.git
cd Nutri-Saath
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd label-backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `label-backend` directory:

```bash
cd label-backend
cp .env.example .env
```

Edit `.env` and add your actual values:

```env
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_at_least_32_characters
GEMINI_API_KEY=your_gemini_api_key

# Optional
GOOGLE_CLIENT_ID=your_google_client_id
SENTRY_DSN=your_sentry_dsn
```

**⚠️ IMPORTANT**: Never commit the `.env` file to version control!

## 🏃 Running the Application

### Development Mode

You need to run both frontend and backend servers:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd label-backend
npm run dev
```
Backend will run on `http://localhost:8080`

### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd label-backend
npm run build
npm start
```

## 📁 Project Structure

```
Nutri-Saath/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── layout/              # Layout components
│   │   ├── product/             # Product-related components
│   │   ├── trust/               # Trust Layer components
│   │   └── ui/                  # Shadcn UI components
│   ├── pages/                   # Page components
│   │   ├── consumer/            # Consumer portal pages
│   │   └── producer/            # Producer portal pages
│   ├── services/                # API services
│   ├── lib/                     # Utilities and helpers
│   └── locales/                 # i18n translations
├── label-backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── services/            # Business logic
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   └── config/              # Configuration
│   └── .env.example             # Environment template
└── README.md
```

## 🔒 Security Notes

- All sensitive data (API keys, database credentials) must be stored in `.env` files
- The `.env` file is excluded from version control via `.gitignore`
- Use `.env.example` as a template for required environment variables
- Never hardcode secrets in source code

## 🌐 API Endpoints

### Consumer APIs
- `POST /api/barcode/lookup` - Look up product by barcode
- `POST /api/bill/parse` - Parse shopping bill image
- `GET /api/product/search` - Search products by name

### Producer APIs
- `GET /api/producer/profile` - Get producer profile
- `POST /api/producer/label` - Create label draft
- `POST /api/producer/batch` - Generate Trust Code
- `GET /api/verify/:trustCode` - Public batch verification

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **SanskariXD** - Initial work

## 🙏 Acknowledgments

- Open Food Facts for product data
- Google Gemini for AI capabilities
- FSSAI for compliance guidelines
- Indian consumers and producers for inspiration

---

**Made with ❤️ By Sanskari for healthier India** 🇮🇳

