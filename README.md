Etüt Rezervasyon Sistemi

Bu proje, etüt salonlarındaki oda ve masaların yönetilmesi amacıyla geliştirilmiş örnek bir full-stack web uygulamasıdır. Kullanıcılar sisteme kayıt olabilir, giriş yapabilir ve yetkileri doğrultusunda masa kayıtlarını görüntüleyip yönetebilir.

Özellikler

Kullanıcı kayıt ve giriş işlemleri

JWT tabanlı kimlik doğrulama

Öğrenci ve yönetici rolleri

Oda ve masa bilgilerinin listelenmesi

Masa ekleme, düzenleme ve silme

Kullanıcının yalnızca kendi oluşturduğu masa kayıtlarını yönetebilmesi

Yöneticilerin bütün kullanıcıları ve masa kayıtlarını görüntüleyebilmesi

Form doğrulama ve hata bildirimleri

Responsive Material UI arayüzü

Swagger ve Scalar üzerinden API dokümantasyonu

Kullanılan Teknolojiler

Backend

ASP.NET Core 9 Web API

Entity Framework Core

SQLite

ASP.NET Core Identity

JWT Authentication

Swagger / Scalar

Frontend

React 18

TypeScript

Vite

Material UI

Redux Toolkit

Axios

React Router

React Hook Form

React Toastify

Proje Yapısı

Etut_Rezervasyon_Sistemi/
├── API/       # ASP.NET Core Web API
├── Client/    # React ve TypeScript arayüzü
└── Etut_Rezervasyon_Sistemi.sln

Kurulum

Gereksinimler

.NET 9 SDK

Node.js ve npm

Git

Backend'i Çalıştırma

cd API
dotnet restore
dotnet run

API varsayılan olarak aşağıdaki adreste çalışır:

http://localhost:5054

Frontend'i Çalıştırma

Yeni bir terminal açın:

cd Client
npm install
npm run dev

Frontend varsayılan olarak aşağıdaki adreste çalışır:

http://localhost:3000

API Dokümantasyonu

Backend geliştirme modunda çalışırken Swagger ve Scalar arayüzlerinden API uç noktaları incelenebilir.

Örnek Kullanıcı Rolleri

Veritabanı ilk oluşturulduğunda geliştirme amacıyla Student ve Admin rolleri eklenir. Örnek hesaplar yalnızca yerel geliştirme ve test amacıyla kullanılmalıdır.

Geliştirici

Mustafa Kurtulan

Not

Bu proje eğitim ve örnek uygulama amacıyla geliştirilmiştir.
