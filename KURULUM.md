# GreenLog Kurulum Rehberi

Bu rehber, GreenLog Lojistik Yönetim Sistemi'ni yerel ortamınızda çalıştırmanız için gereken adımları içermektedir.

## Gereksinimler

- **Node.js** v18.0.0 veya üzeri
- **MongoDB** v5.0 veya üzeri
- **npm** v8.0.0 veya üzeri

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd greenlog_bb
```

### 2. Backend Kurulumu

#### Bağımlılıkları yükleyin:
```bash
npm install
```

#### MongoDB'yi başlatın:
```bash
# Windows
mongod

# macOS/Linux (Homebrew)
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Ortam değişkenlerini ayarlayın:
`config.js` dosyasını düzenleyin:
```javascript
module.exports = {
  PORT: 5000,
  MONGODB_URI: 'mongodb://localhost:27017/greenlog_db',
  JWT_SECRET: 'your_super_secret_jwt_key_here',
  NODE_ENV: 'development'
};
```

#### Backend sunucusunu başlatın:
```bash
# Geliştirme modu (otomatik yeniden başlatma)
npm run dev

# Veya normal mod
npm start
```

✅ Backend sunucu http://localhost:5000 adresinde çalışacak

### 3. Frontend Kurulumu

#### Frontend klasörüne geçin:
```bash
cd frontend
```

#### Bağımlılıkları yükleyin:
```bash
npm install
```

#### Frontend sunucusunu başlatın:
```bash
npm run dev
```

✅ Frontend http://localhost:3000 adresinde çalışacak

## 📊 Demo Veriler

İlk kez çalıştırdığınızda, demo kullanıcıları oluşturabilirsiniz:

### Demo Kullanıcıları (API ile oluşturun)

#### Admin Kullanıcı:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@greenlog.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

#### Manager Kullanıcı:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager",
    "email": "manager@greenlog.com",
    "password": "manager123",
    "firstName": "Manager",
    "lastName": "User",
    "role": "manager"
  }'
```

#### Operator Kullanıcı:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "operator",
    "email": "operator@greenlog.com",
    "password": "operator123",
    "firstName": "Operator",
    "lastName": "User",
    "role": "operator"
  }'
```

## 🔐 Giriş Bilgileri

Login sayfasında şu bilgilerle giriş yapabilirsiniz:

- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Operator**: `operator` / `operator123`

## 🛠️ Geliştirme

### Backend Geliştirme
```bash
# Nodemon ile otomatik yeniden başlatma
npm run dev

# Linting
npm run lint
```

### Frontend Geliştirme
```bash
cd frontend

# Geliştirme sunucusu
npm run dev

# Build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint
```

## 📁 Proje Yapısı

```
greenlog_bb/
├── config.js              # Backend konfigürasyonu
├── server.js              # Ana sunucu dosyası
├── package.json           # Backend bağımlılıkları
├── models/                # MongoDB modelleri
│   ├── User.js
│   ├── Container.js
│   ├── Invoice.js
│   └── Loader.js
├── routes/                # API route'ları
│   ├── auth.js
│   ├── containers.js
│   ├── invoices.js
│   ├── loaders.js
│   ├── containerManagers.js
│   └── dashboard.js
├── middleware/            # Express middleware'leri
│   └── auth.js
└── frontend/              # Next.js frontend
    ├── app/               # App Router sayfaları
    ├── components/        # React bileşenleri
    ├── hooks/            # Custom hooks
    ├── lib/              # Utility fonksiyonları
    ├── types/            # TypeScript tipleri
    └── package.json      # Frontend bağımlılıkları
```

## 🔧 Yapılandırma

### Backend Yapılandırması
`config.js` dosyasında aşağıdaki ayarları yapabilirsiniz:

- `PORT`: Sunucu portu (varsayılan: 5000)
- `MONGODB_URI`: MongoDB bağlantı adresi
- `JWT_SECRET`: JWT token şifreleme anahtarı
- `NODE_ENV`: Çalışma ortamı (development/production)

### Frontend Yapılandırması
`frontend/next.config.js` dosyasında:

- `NEXT_PUBLIC_API_URL`: Backend API URL'i

## 🚨 Sorun Giderme

### MongoDB Bağlantı Sorunu
```bash
# MongoDB durumunu kontrol edin
mongo --eval "db.adminCommand('ismaster')"

# MongoDB loglarını kontrol edin
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Port Çakışması
```bash
# Portu kullanan işlemi bulun
lsof -i :5000
lsof -i :3000

# İşlemi sonlandırın
kill -9 <PID>
```

### Node Modülleri Sorunu
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Dokümantasyonu

Backend başlatıldıktan sonra API endpoint'lerine şu adreslerden erişebilirsiniz:

- **Health Check**: http://localhost:5000/api/health
- **Auth**: http://localhost:5000/api/auth/*
- **Containers**: http://localhost:5000/api/containers/*
- **Invoices**: http://localhost:5000/api/invoices/*
- **Loaders**: http://localhost:5000/api/loaders/*
- **Dashboard**: http://localhost:5000/api/dashboard/*

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. README.md dosyasını kontrol edin
2. GitHub Issues'da sorun bildirin
3. Dokümantasyonu inceleyin

---

**GreenLog Lojistik Yönetim Sistemi** - Modern ve güvenilir lojistik çözümü 🚛📦
