import React from 'react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import ClientsEditPage from './ClientsEditPage';
import ProjetEdit from '../components/projet/projet-edit';
import Sav from '../components/projet/sav';
import clientsData from "../assets/data/clients.json";
import projectData from "../components/projet/formInitialValues.json";
import terms from "../assets/data/terms.json";
import logo from "../assets/img/logo-invoice.png";
import { Button } from 'react-bootstrap';

const ProjetEditPage = () => {
  const clientData = clientsData[0];

  const downloadPdf = () => {
    const doc = new jsPDF();
  
    // Logo ve firma bilgileri
    doc.addImage(logo, 'PNG', 18, 17, 66, 18);
    doc.setFontSize(9);

  // Bold başlıklar ve detayların yazılması için metinlerin koordinatları ayarlanmalıdır
  doc.setFont("helvetica", "bold"); // Bold font ayarı
  doc.text("Tél:", 18, 46);
  doc.setFont("helvetica", "normal"); // Detaylar için normal fonta dönülür
  doc.text("065946565", 33, 46);

  doc.setFont("helvetica", "bold");
  doc.text("E-Mail:", 18, 50);
  doc.setFont("helvetica", "normal");
  doc.text("dalyana.mons@gmail.com", 33, 50);

  doc.setFont("helvetica", "bold");
  doc.text("Website:", 18, 54);
  doc.setFont("helvetica", "normal");
  doc.text("www.dalyana.com", 33, 54);

  doc.setFont("helvetica", "bold");
  doc.text("TVA:", 18, 58);
  doc.setFont("helvetica", "normal");
  doc.text("BE0755397594", 33, 58);

  doc.setFont("helvetica", "bold");
  doc.text("Coordonnées Bancaires:", 18, 62);
  doc.setFont("helvetica", "normal");
  doc.text("CBC BE78732056758286", 18, 66);
  doc.text("BIC CREGBEBB", 18, 70);

// Proje Statusu
// Projenin durumunu gösteren bir metin kutusu çizin
doc.setFontSize(24);  // Metin boyutunu ayarla
const statusText = `${projectData.status}`;
const textWidth = doc.getTextWidth(statusText);

// Kutu için padding
const paddingX = 2; // Yatay padding
const boxWidth = textWidth + 2 * paddingX;  // Kutunun genişliğini hesapla
const boxHeight = 14; // Kutunun yüksekliğini azalt

// Çerçeve çiz
doc.rect(150, 16, boxWidth, boxHeight);  // Çerçevenin üst çizgisini yukarı çek

// Metni çerçevenin içine yerleştir
doc.text(statusText, 150 + paddingX, 26); // Metni dikey olarak kutunun içine ortala



// Müşteri bilgileri - Başlıklar bold ve detaylar normal fontta yazılacak
doc.setFontSize(9);
doc.setFont("helvetica", "bold"); // Fontu ve stili ayarla

// Arka plan dikdörtgenini çiz
doc.setFillColor(230, 230, 230); // Açık gri renk ayarla (RGB)
doc.rect(128, 36, 60, 6, 'F'); // (x, y, genişlik, yükseklik) dikdörtgen çiz

// Üzerine metni yaz
doc.setTextColor(139, 0, 0); // Koyu kırmızı metin rengi
doc.text("Votre Coordonnées:", 130, 40);


doc.setTextColor(0, 0, 0); // Siyah metin rengi
doc.setFont("helvetica", "bold"); // Başlık için bold font
doc.text("N° Client:", 130, 46);
doc.setFont("helvetica", "normal"); // Detay için normal font
doc.text(clientData.id, 152, 46);

doc.setFont("helvetica", "bold");
doc.text("Nom:", 130, 50);
doc.setFont("helvetica", "normal");
doc.text(clientData.name, 152, 50);

doc.setFont("helvetica", "bold");
doc.text("Tél:", 130, 54);
doc.setFont("helvetica", "normal");
doc.text(clientData.phoneNumber, 152, 54);

doc.setFont("helvetica", "bold");
doc.text("E-mail:", 130, 58);
doc.setFont("helvetica", "normal");
doc.text(clientData.email, 152, 58);

doc.setFont("helvetica", "bold");
doc.text("Adresse:", 130, 62);
doc.setFont("helvetica", "normal");
doc.text(clientData.address, 152, 62);

doc.setFont("helvetica", "bold");
doc.text("Code Postal:", 130, 66);
doc.setFont("helvetica", "normal");
doc.text(clientData.zipCode, 152, 66);

doc.setFont("helvetica", "bold");
doc.text("Ville:", 130, 70);
doc.setFont("helvetica", "normal");
doc.text(clientData.city, 152, 70);

doc.setFont("helvetica", "bold");
doc.text("TVA:", 130, 74);
doc.setFont("helvetica", "normal");
doc.text(clientData.tva, 152, 74);

    let currentY = 70; // Yeni Y konumunu belirle
  
    // Proje Bilgileri Üst Bilgileri
    doc.setFontSize(9);

    currentY += 30;
  
    // Kategori Başlıkları ve Tablolar
    // MEUBLES kategorisi için özel değişken
    const meublesData = projectData.articles;

    // MEUBLES kategorisi için özel işlem
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.setTextColor(139, 0, 0);  // Koyu kırmızı
    doc.setFillColor(230, 230, 230);  // Gri arka plan
    const title = "Meubles";
    const fontSize = 15;
    doc.setFontSize(fontSize);
    
    // Margin değerlerini ayarla
    const leftMargin = 18;
    const rightMargin = 18;
    const titleWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);  // Genişlik, marginlar çıkarılarak hesaplanıyor
    
    // Yüksekliği font boyutuna göre daha uygun bir şekilde ayarla
    const titleHeight = fontSize * 0.5;  // Font boyutunun yaklaşık %75'i kadar
    // Başlangıç X koordinatı
    const titleX = leftMargin;
    // Dikdörtgeni çiz, marginler ile ayarlanmış genişlik ve yükseklik
    doc.rect(titleX, currentY, titleWidth, titleHeight, 'F');
    // Başlığı tam ortada yerleştir
    const calculatedTextWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
    const textX = titleX + (titleWidth - calculatedTextWidth) / 2;
    doc.text(title, textX, currentY + titleHeight * 0.8);  // Metni dikdörtgen içinde daha ortalanmış konumda yazdır
    
    // Başlık ve alt metin için yeterli boşluk ayarla
    currentY += titleHeight + 10;  // Alt metin için boşluk artışını ayarla
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11); // Metin boyutunu 11 olarak ayarladık, bu yüzden fontSize değeri 11 olarak kullanılmalıdır.
    doc.setTextColor(0, 0, 0); // Siyah
    const subText = "- selon détail des éléments meubles en annexe -";
    
    // fontSize yerine direkt olarak kullanılan font boyutunu kullanarak genişliği hesaplayalım.
    const subTextWidth = doc.getStringUnitWidth(subText) * 11 / doc.internal.scaleFactor; // fontSize yerine 11 kullandık.
    const subTextX = (doc.internal.pageSize.width - subTextWidth) / 2; // Tam ortalanması için hesaplama
    doc.text(subText, subTextX, currentY);
    currentY += 10;
    
    

    const preDiscountInfo = "Prix mobilier (TTC):";
    doc.setFontSize(11);
    // "articles" içinden gelen değerleri al
    const furnitureListPrice = projectData.articles[0].furnitureListPrice;
    const taxRate = projectData.articles[0].taxRate;

    // Indirim öncesi fiyatı hesapla
    const preDiscountPrice = furnitureListPrice + (furnitureListPrice * (taxRate / 100));
    const preDiscountText = `${preDiscountInfo} ${preDiscountPrice.toFixed(2)} €`; // Metni ve hesaplanan değeri birleştir

    // Metin genişliğini hesaplamak için tam metni kullan
    const preDiscountTextWidth = doc.getStringUnitWidth(preDiscountText) * 11;
    // Sağa yaslanacak şekilde konum hesaplama, sağ tarafta 25 piksel boşluk bırakarak
    const preDiscountTextX = doc.internal.pageSize.width - preDiscountTextWidth + 75; // Sağ margin olarak 25 piksel kullanıldı
    doc.text(preDiscountText, preDiscountTextX, currentY); // Birleştirilmiş metni yazdır
    currentY += 5; // Sonraki içerik için boşluk

    
    const priceInfo = "Prix mobilier après remise (TTC) :";
    doc.setFontSize(11);
    // "Meubles" kategorisinden "vatIncludedPrice" almak ve metinle birleştirmek
    const vatIncludedPrice = projectData.articles[0].vatIncludedPrice;
    const fullText = `${priceInfo} ${vatIncludedPrice.toFixed(2)} €`; // Metni ve değeri birleştir
    // Metin genişliğini hesaplamak için tam metni kullan
    const fullTextWidth = doc.getStringUnitWidth(fullText) * 11;
    // Sağa yaslanacak şekilde konum hesaplama, sağ tarafta 25 piksel boşluk bırakarak
    // Daha önce tanımlanmış textX varsa, yeni bir ad kullanmamız gerekir. Örneğin, newTextX:
    const newTextX = doc.internal.pageSize.width - fullTextWidth + 120; // Sağ margin olarak 25 piksel kullanıldı
    doc.text(fullText, newTextX, currentY); // Birleştirilmiş metni yazdır
    currentY += 10; // Sonraki içerik için boşluk
    
    const subTotalInfo = "Sous-total prix Mobilier (TTC) :";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(139, 0, 0); // Koyu kırmızı rengi ayarla

    // "totalFeeArticles" değerini almak
    const totalFeeArticles = projectData.totalFeeArticles;
    const subTotalText = `${subTotalInfo} ${parseFloat(totalFeeArticles).toFixed(2)} €`; // Metni ve değeri birleştir

    // Metin genişliğini hesaplamak için tam metni kullan
    const subTotalTextWidth = doc.getStringUnitWidth(subTotalText) * 11;
    // Sağa yaslanacak şekilde konum hesaplama, sağ tarafta 25 piksel boşluk bırakarak
    const subTotalTextX = doc.internal.pageSize.width - subTotalTextWidth + 118; // Sağ margin olarak 25 piksel kullanıldı
    doc.text(subTotalText, subTotalTextX, currentY); // Birleştirilmiş metni yazdır
    currentY += 15; // Sonraki içerik için boşluk

    
   // Diğer kategoriler için liste
   const categories = [
    { title: "Accessoires", data: projectData.itemsAccessoires, totalKey: "totalFeeAccessoires" },
    { title: "Électroménagers", data: projectData.itemsElectromenagers, totalKey: "totalFeeElectromenagers" },
    { title: "Sanitaires", data: projectData.itemsSanitaires, totalKey: "totalFeeSanitaires" },
    { title: "Pdt Solid Surface", data: projectData.itemsSurfaces, totalKey: "totalFeeSurfaces" },
    { title: "Divers", data: projectData.itemsDivers, totalKey: "totalFeeItemsDivers" },
  ];
  

// Diğer kategorileri işle
categories.forEach(category => {
  if (doc.internal.pageSize.height - currentY < 20) {
    doc.addPage();
    currentY = 10;
  }

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 0, 0);
  const titleMargin = 18;
  const titleWidth = doc.internal.pageSize.width - (2 * titleMargin);
  const titleHeight = 15 * 0.5;
  doc.setFillColor(230, 230, 230);
  doc.rect(titleMargin, currentY, titleWidth, titleHeight, 'F');
  const titleTextWidth = doc.getStringUnitWidth(category.title) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = titleMargin + (titleWidth - titleTextWidth) / 2;
  doc.text(category.title, titleX, currentY + titleHeight * 0.8);
  currentY += titleHeight + 5;

  doc.autoTable({
    startY: currentY,
    margin: { left: titleMargin, right: titleMargin },
    theme: 'striped',
    head: [['Reference', 'Designation', 'PU', 'U', 'Prix de vente']],
    body: category.data.map(item => {
      const discountedPrice = item.discountedPrice || item.price;
      const taxRate = item.taxRate || 0;
      const priceWithTax = discountedPrice + (discountedPrice * (taxRate / 100));
      return [
        item.name || item.productId,
        item.description || '',
        priceWithTax.toFixed(2) + '€',
        item.quantity,
        item.vatIncludedPrice.toFixed(2) + '€'
      ];
    }),
    headStyles: {
      fillColor: [242, 242, 242], // Başlıklar için açık gri arka plan rengi
      textColor: [0, 0, 0], // Veri satırları yazı rengi siyah
      fontStyle: 'bold' // Başlık fontlarını kalın yap
  },
  bodyStyles: {
      fillColor: [255, 255, 255], // Veri satırları için beyaz arka plan rengi
      textColor: [0, 0, 0] // Veri satırları yazı rengi siyah
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255]
  },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 'auto', minCellWidth: 40 }, 2: { cellWidth: 30 }, 3: { cellWidth: 10 }, 4: { cellWidth: 30 } },
    didDrawPage: (data) => { currentY = data.cursor.y + 5; }
  });

  // Toplam değeri doğrudan category nesnesinden al
const totalValue = projectData[category.totalKey];
const text = `Sous-total ${category.title} (TTC): ${totalValue} €`;

doc.setFontSize(11);
doc.setTextColor(139, 0, 0); // Koyu kırmızı rengi ayarla

// Metin genişliğini hesapla
const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;

// Sayfanın genişliğinden metin genişliğini ve sağ margini çıkararak x koordinatını hesapla
const xPosition = doc.internal.pageSize.width - textWidth - 24;

// Metni belirlenen x koordinatında yazdır
doc.text(text, xPosition, currentY);
currentY += 10;
});


// Livraison et Pose kategorisi için özel işlem
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.setTextColor(139, 0, 0);  // Koyu kırmızı
doc.setFillColor(230, 230, 230);  // Gri arka plan
const livraisonTitle = "Livraison et Pose";
const livraisonFontSize = 15;
doc.setFontSize(livraisonFontSize);

// Margin değerlerini ayarla
const livraisonLeftMargin = 18;
const livraisonRightMargin = 18;
const livraisonTitleWidth = doc.internal.pageSize.width - (livraisonLeftMargin + livraisonRightMargin);  // Genişlik, marginlar çıkarılarak hesaplanıyor

// Yüksekliği font boyutuna göre daha uygun bir şekilde ayarla
const livraisonTitleHeight = livraisonFontSize * 0.5;  // Font boyutunun yaklaşık %75'i kadar
// Başlangıç X koordinatı
const livraisonTitleX = livraisonLeftMargin;
// Dikdörtgeni çiz, marginler ile ayarlanmış genişlik ve yükseklik
doc.rect(livraisonTitleX, currentY, livraisonTitleWidth, livraisonTitleHeight, 'F');
// Başlığı tam ortada yerleştir
const livraisonTextWidth = doc.getStringUnitWidth(livraisonTitle) * livraisonFontSize / doc.internal.scaleFactor;
const livraisonTextX = livraisonTitleX + (livraisonTitleWidth - livraisonTextWidth) / 2;
doc.text(livraisonTitle, livraisonTextX, currentY + livraisonTitleHeight * 0.8);  // Metni dikdörtgen içinde daha ortalanmış konumda yazdır

// Başlık ve alt metin için yeterli boşluk ayarla
currentY += livraisonTitleHeight + 10;  // Alt metin için boşluk artışını ayarla


// Livraison için yazdırma
const deliveryFee = projectData.deliveryFee;  // JSON dosyasından deliveryFee değeri
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(0, 0, 0);
doc.text("LIVRAISON", livraisonLeftMargin, currentY);  // Sol tarafta yazdır
const deliveryFeeText = `${deliveryFee.toFixed(2)} €`;
const deliveryFeeWidth = doc.getStringUnitWidth(deliveryFeeText) * doc.getFontSize() / doc.internal.scaleFactor;
const deliveryFeeX = doc.internal.pageSize.width - deliveryFeeWidth - 31; // Sağdan 18 margin
doc.text(deliveryFeeText, deliveryFeeX, currentY);
currentY += 7;  // Bir sonraki satır için yüksekliği arttır

// Pose için yazdırma
const montageFee = projectData.montageFee;  // JSON dosyasından montageFee değeri
doc.text("POSE", livraisonLeftMargin, currentY);  // Sol tarafta yazdır
const montageFeeText = `${montageFee.toFixed(2)} €`;
const montageFeeWidth = doc.getStringUnitWidth(montageFeeText) * doc.getFontSize() / doc.internal.scaleFactor;
const montageFeeX = doc.internal.pageSize.width - montageFeeWidth - 31; // Sağdan 18 margin
doc.text(montageFeeText, montageFeeX, currentY);
currentY += 10;  // Bir sonraki satır için yüksekliği arttır

// Toplam ücretleri hesapla ve yazdır
const totalLivraisonPose = deliveryFee + montageFee;
const totalText = `Sous-total Livraison et Pose (TTC): ${totalLivraisonPose.toFixed(2)} €`;
doc.setFont("helvetica", "bold");
doc.setTextColor(139, 0, 0);  // Koyu kırmızı
const totalTextWidth = doc.getStringUnitWidth(totalText) * doc.getFontSize() / doc.internal.scaleFactor;
const totalTextX = doc.internal.pageSize.width - totalTextWidth - 24; // Sağdan 18 margin
doc.text(totalText, totalTextX, currentY);
currentY += 10;  // Bir sonraki içerik için boşluk

doc.setFont("helvetica", "normal");
doc.setFontSize(8); // Metin boyutunu 9 olarak ayarladık
doc.setTextColor(0, 0, 0); // Siyah
const livraisonDetails = "- La prestation de pose ne comprend pas les travaux de plomberie et d'électricité. Seuls sont réalisés les branchements et installation des appareils que nous fournissons sur raccords électriques et arrivées et départs d'eau en place au niveau des meubles concernés -";  // Yeni açıklama metni

const livraisonMargin = 25;  // Hem soldan hem de sağdan margin değeri 25 olarak ayarlanmıştır
const livraisonPageWidth = doc.internal.pageSize.width;  // Sayfanın tam genişliği
const livraisonetposeTextWidth = livraisonPageWidth - (2 * livraisonMargin);  // Metin için kullanılabilir genişlik

// Metni belirtilen genişlik içinde ve belirtilen x, y koordinatlarında yazdır
doc.text(livraisonDetails, livraisonMargin-2, currentY, { maxWidth: livraisonetposeTextWidth, align: "justify" });
currentY += doc.getTextDimensions(livraisonDetails, { maxWidth: livraisonetposeTextWidth }).h + 10;  // Metin yüksekliğini hesapla ve sonraki içerik için yükseklik artışı yap


// Résumé de Projet kategorisi için özel işlem
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.setTextColor(139, 0, 0);  // Koyu kırmızı
doc.setFillColor(230, 230, 230);  // Gri arka plan
const resumeTitle = "Résumé de Projet (TTC)";
const resumeFontSize = 15;
doc.setFontSize(resumeFontSize);

// Margin değerlerini ayarla
const resumeLeftMargin = 18;
const resumeRightMargin = 18;
const resumeTitleWidth = doc.internal.pageSize.width - (resumeLeftMargin + resumeRightMargin);  // Genişlik, marginlar çıkarılarak hesaplanıyor

// Yüksekliği font boyutuna göre daha uygun bir şekilde ayarla
const resumeTitleHeight = resumeFontSize * 0.5;  // Font boyutunun yaklaşık %75'i kadar
// Başlangıç X koordinatı
const resumeTitleX = resumeLeftMargin;
// Dikdörtgeni çiz, marginler ile ayarlanmış genişlik ve yükseklik
doc.rect(resumeTitleX, currentY, resumeTitleWidth, resumeTitleHeight, 'F');
// Başlığı tam ortada yerleştir
const resumeTextWidth = doc.getStringUnitWidth(resumeTitle) * resumeFontSize / doc.internal.scaleFactor;
const resumeTextX = resumeTitleX + (resumeTitleWidth - resumeTextWidth) / 2;
doc.text(resumeTitle, resumeTextX, currentY + resumeTitleHeight * 0.8);  // Metni dikdörtgen içinde daha ortalanmış konumda yazdır

// Başlık ve alt metin için yeterli boşluk ayarla
currentY += resumeTitleHeight + 10;  // Alt metin için boşluk artışını ayarla

doc.setFont("helvetica", "bold");
doc.setTextColor(0, 0, 0);
doc.setFontSize(12);


// "Mobilier:" metnini soldan 100 piksel margin ile belirtilen konumda yazdır
const leftMarginMobilier = 120;
doc.text("Mobilier:", leftMarginMobilier, currentY);

// Fiyatı sağa yaslayıp sağdan 18 piksel margin ile yazdır
const rightMarginMobilier = 18;
const priceText = `${preDiscountPrice.toFixed(2)} €`;
const priceTextWidth = doc.getStringUnitWidth(priceText) * doc.getFontSize() / doc.internal.scaleFactor; // Fiyat metninin genişliği

// Sayfanın genişliğinden sağ margine ve fiyat metni genişliğine göre x koordinatını hesapla
const priceX = doc.internal.pageSize.width - priceTextWidth - rightMarginMobilier;
doc.text(priceText, priceX, currentY);


currentY += 6;  // Bir sonraki içerik için boşluk

// Kategori için toplam liste fiyatını hesaplayan yardımcı fonksiyon
function calculateTotalListPrice(items, categoryTitle) {
  return items.reduce((total, item) => {
    // Divers kategorisi için farklı bir fiyat alanını kullan
    const price = categoryTitle === "Divers" ? parseFloat(item.diversListPrice) : parseFloat(item.price);
    const taxRate = parseFloat(item.taxRate) / 100;
    const quantity = parseInt(item.quantity, 10);
    return total + price * (1 + taxRate) * quantity;
  }, 0);
}

// Her kategori için toplam liste fiyatını hesaplayıp gösteren kısım
const categoriesResume = [
  { title: "Accessoires", data: projectData.itemsAccessoires },
  { title: "Électroménagers", data: projectData.itemsElectromenagers },
  { title: "Sanitaires", data: projectData.itemsSanitaires },
  { title: "Pdt Solid Surface", data: projectData.itemsSurfaces },
  { title: "Divers", data: projectData.itemsDivers },
];

categoriesResume.forEach(category => {
  const totalPrice = calculateTotalListPrice(category.data, category.title);
  doc.setFontSize(12);

  // Yeni Y koordinatı belirle
  if (doc.internal.pageSize.height - currentY < 20) {
    doc.addPage();
    currentY = 10;
  }

  // Kategori adını soldan 100 margin ile yazdır
  const categoryTitle = `${category.title}:`;
  const leftMargin = 120;
  doc.text(categoryTitle, leftMargin, currentY);

  // Fiyatı sağa yaslayıp sağdan 18 margin ile yazdır
  const priceText = `${totalPrice.toFixed(2)} €`;
  const rightMargin = 18;
  const priceTextWidth = doc.getStringUnitWidth(priceText) * doc.getFontSize() / doc.internal.scaleFactor; // Fiyat metninin genişliği
  const priceX = doc.internal.pageSize.width - priceTextWidth - rightMargin; // Fiyatın x koordinatını hesapla

  doc.text(priceText, priceX, currentY); // Fiyatı belirlenen x koordinatında yazdır
  currentY += 6; // Sonraki kategori için y koordinatını artır
});

const serviceTitle = "Livraison et Pose:";
const leftMarginService = 120; // Sol taraftan başlangıç noktası
doc.text(serviceTitle, leftMarginService, currentY); // Servis başlığını yazdır

const servicePrice = `${totalLivraisonPose.toFixed(2)} €`;
const rightMarginService = 18; // Sağ taraftan boşluk
const servicePriceWidth = doc.getStringUnitWidth(servicePrice) * doc.getFontSize() / doc.internal.scaleFactor; // Fiyat metninin genişliği
const servicePriceX = doc.internal.pageSize.width - servicePriceWidth - rightMarginService; // Fiyatın x koordinatını hesapla

doc.text(servicePrice, servicePriceX, currentY); // Fiyatı belirlenen x koordinatında yazdır
currentY += 6; // Y koordinatını sonraki satır için artır

// Her kategorinin toplamını hesaplayan ve toplamı döndüren fonksiyon
function calculateTotalProjectPrice(categories) {
  // "Mobilier" ve "Livraison et Pose" kategorilerinin toplamını da ekleyerek hesapla
  let totalMobilier = preDiscountPrice;
  let totalLivraisonPose = deliveryFee + montageFee;

  return categories.reduce((total, category) => {
    const categoryTotal = calculateTotalListPrice(category.data, category.title);
    return total + categoryTotal;
  }, totalMobilier + totalLivraisonPose);
}

// Proje için toplam fiyatı hesapla
const totalProjectPrice = calculateTotalProjectPrice(categoriesResume);
doc.setTextColor(139, 0, 0);  // Koyu kırmızı

// "Sous-total projet avant remise (TTC):" metnini ve hesaplanan toplam fiyatı yazdır
const projectSummaryTitle = "Sous-total projet avant remise (TTC):";
const leftMarginSummary = 82; // Soldan başlangıç noktası
doc.text(projectSummaryTitle, leftMarginSummary, currentY);

// Toplam fiyatı sağa yaslayarak yazdır, sağdan 18 piksel boşluk bırak
const totalPriceText = `${totalProjectPrice.toFixed(2)} €`;
const rightMarginSummary = 18; // Sağ taraftan boşluk
const totalPriceTextWidth = doc.getStringUnitWidth(totalPriceText) * doc.getFontSize() / doc.internal.scaleFactor; // Toplam fiyat metninin genişliği
const totalPriceX = doc.internal.pageSize.width - totalPriceTextWidth - rightMarginSummary; // Toplam fiyatın x koordinatını hesapla

doc.text(totalPriceText, totalPriceX, currentY);
currentY += 10; // Y koordinatını sonraki içerik için artır
















    
    
    doc.setTextColor(0, 0, 0);
    // Diğer Ücretler ve Genel Sözleşme Şartları için yeterli alan kontrolü
    if (doc.internal.pageSize.height - currentY < 40) {
      doc.addPage();
      currentY = 10; // Yeni sayfanın başına geri dön
    }
  
    // Diğer Ücretler
    doc.setFontSize(9);
    const feesStartY = currentY + 10; // Diğer ücretler için biraz boşluk bırak
    doc.text(`Grand Total: ${projectData.grandTotal}\nGlobal Discount: ${projectData.globaldiscount}`, 10, feesStartY);
    currentY = feesStartY + 20; // Diğer ücretlerden sonra boşluk bırak
  
    // Genel Sözleşme Şartları
    doc.setFontSize(8);
    terms.terms.forEach((term, index) => {
      if (doc.internal.pageSize.height - currentY < 20) {
        doc.addPage();
        currentY = 10; // Yeni sayfanın başına geri dön
      }
      doc.text(`${index + 1}. ${term}`, 10, currentY);
      currentY += 5; // Sonraki terim için boşluk ekleyin
    });
  
    // Sayfa numaralarını ekleyen fonksiyon
    const addPageNumbers = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, null, null, 'center');
      }
    };
  
    addPageNumbers(); // Sayfa numaralarını fonksiyonu çağırarak ekleyin
  
    doc.save("Projet.pdf");
  };
  
   

  return (
    <>
    <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <Button onClick={downloadPdf}>Télécharger le PDF</Button>
      </div>
      <ClientsEditPage showProjectList={false} />
      <ProjetEdit />
      <div className='mt-5'>
        <h3 className='my-5' style={{ textAlign: 'center' }}>Le service après-vente (SAV)</h3>
        <Sav />
      </div>
      
    </>
  );
};

export default ProjetEditPage;
