# Bey Logistics - Lojistik Yönetim Sistemi

Modern ve kullanıcı dostu lojistik firması admin paneli. Node.js/Express backend ve Next.js/React/TypeScript frontend ile geliştirilmiştir.

## 🚀 Özellikler

### Backend API
- **Güvenlik**: JWT tabanlı kimlik doğrulama ve yetkilendirme
- **Kullanıcı Yönetimi**: Admin, Manager ve Operator rolleri
- **Konteyner Takip**: Gerçek zamanlı konum ve durum takibi
- **Fatura Yönetimi**: Otomatik fatura numarası, ödeme takibi
- **Yükleyici Yönetimi**: Sürücü bilgileri, araç takibi, belge yönetimi
- **Dashboard**: Kapsamlı istatistikler ve performans metrikleri
- **Alertler**: Geciken faturalar, süresi dolan belgeler, atanmamış konteynerler

### Frontend (Yakında)
- Modern ve responsive tasarım
- Sidebar navigasyon
- Dashboard ile istatistikler
- Konteyner takip haritası
- Fatura yönetimi
- Yükleyici ve konteyner sorumlusu yönetimi

## 🛠️ Teknolojiler

### Backend
- **Node.js & Express**: Server framework
- **MongoDB & Mongoose**: Veritabanı
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing

### Frontend (Yakında)
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: UI components

## 📦 Kurulum

### Backend Kurulumu

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **MongoDB'yi başlatın:**
```bash
# MongoDB'nin sisteminizde kurulu olduğundan emin olun
mongod
```

3. **Ortam değişkenlerini ayarlayın:**
```bash
# config.js dosyasında gerekli ayarları yapın
# PORT, MONGODB_URI, JWT_SECRET değerlerini güncelleyin
```

4. **Sunucuyu başlatın:**
```bash
# Geliştirme modu
npm run dev

# Production modu
npm start
```

Server http://localhost:5000 adresinde çalışacaktır.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profili
- `PUT /api/auth/profile` - Profil güncelleme
- `PUT /api/auth/change-password` - Şifre değiştirme

### Containers
- `GET /api/containers` - Konteyner listesi (filtreleme ve sayfalama)
- `GET /api/containers/:id` - Tekil konteyner
- `POST /api/containers` - Yeni konteyner (Manager+)
- `PUT /api/containers/:id` - Konteyner güncelleme (Manager+)
- `POST /api/containers/:id/tracking` - Takip girişi ekleme
- `DELETE /api/containers/:id` - Konteyner silme (Manager+)
- `GET /api/containers/stats/overview` - Konteyner istatistikleri

### Invoices
- `GET /api/invoices` - Fatura listesi
- `GET /api/invoices/:id` - Tekil fatura
- `POST /api/invoices` - Yeni fatura (Manager+)
- `PUT /api/invoices/:id` - Fatura güncelleme (Manager+)
- `DELETE /api/invoices/:id` - Fatura silme (Manager+)
- `PATCH /api/invoices/:id/pay` - Faturayı ödenmiş olarak işaretle
- `GET /api/invoices/stats/overview` - Fatura istatistikleri

### Loaders
- `GET /api/loaders` - Yükleyici listesi
- `GET /api/loaders/:id` - Tekil yükleyici
- `POST /api/loaders` - Yeni yükleyici (Manager+)
- `PUT /api/loaders/:id` - Yükleyici güncelleme (Manager+)
- `PATCH /api/loaders/:id/location` - Konum güncelleme
- `POST /api/loaders/:id/documents` - Belge ekleme (Manager+)
- `POST /api/loaders/:id/rate` - Yükleyici değerlendirme
- `DELETE /api/loaders/:id` - Yükleyici silme (Manager+)
- `GET /api/loaders/stats/overview` - Yükleyici istatistikleri

### Container Managers
- `GET /api/container-managers` - Konteyner sorumluları
- `GET /api/container-managers/:id` - Tekil sorumlu
- `POST /api/container-managers/:managerId/assign-container` - Konteyner atama
- `DELETE /api/container-managers/:managerId/unassign-container/:containerId` - Atama kaldırma
- `GET /api/container-managers/:id/stats` - Sorumlu istatistikleri
- `POST /api/container-managers/:managerId/bulk-assign` - Toplu atama
- `POST /api/container-managers` - Yeni sorumlu (Admin)
- `DELETE /api/container-managers/:id` - Sorumlu deaktivasyonu (Admin)

### Dashboard
- `GET /api/dashboard/overview` - Genel istatistikler
- `GET /api/dashboard/activities` - Son aktiviteler
- `GET /api/dashboard/metrics` - Performans metrikleri
- `GET /api/dashboard/alerts` - Uyarılar ve bildirimler

## 🔐 Güvenlik

- **JWT Token**: 24 saat geçerlilik süresi
- **Password Hashing**: bcryptjs ile güvenli hash
- **Rate Limiting**: IP başına 15 dakikada 100 istek
- **CORS**: Sadece izin verilen domainler
- **Helmet**: Güvenlik başlıkları
- **Input Validation**: express-validator ile doğrulama

## 👥 Kullanıcı Rolleri

- **Admin**: Tüm yetkiler, kullanıcı yönetimi
- **Manager**: Operasyonel yönetim, CRUD işlemleri
- **Operator**: Sadece okuma ve temel işlemler

## 📱 Özellik Detayları

### Konteyner Takip
- Gerçek zamanlı konum güncelleme
- Durum geçmişi (tracking history)
- Tahmini ve gerçek varış süreleri
- Belge yönetimi

### Fatura Sistemi
- Otomatik fatura numarası (INV-YYYYMM0001)
- Çoklu hizmet kalemleri
- Vergi hesaplama (%18 KDV)
- Ödeme takibi ve gecikme uyarıları

### Yükleyici Yönetimi
- Sürücü ve araç bilgileri
- Belge takibi ve son kullanma tarihi uyarıları
- Konum takibi
- Değerlendirme sistemi
- Acil durum iletişim bilgileri

## 🚧 Gelecek Özellikler

- [ ] Frontend geliştirme
- [ ] Gerçek zamanlı bildirimler (WebSocket)
- [ ] Harita entegrasyonu
- [ ] Mobil uygulama
- [ ] Rapor ve analitik modülü
- [ ] Email bildirimleri
- [ ] Dosya yükleme sistemi

## 🤝 Katkıda Bulunma

1. Bu repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya doğrudan iletişime geçebilirsiniz.

---

**Bey Logistics** - Modern Lojistik Yönetimi 🚛📦
