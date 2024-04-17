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
    doc.addImage(logo, 'PNG', 16, 17, 66, 18);
    doc.setFontSize(9);

  // Bold başlıklar ve detayların yazılması için metinlerin koordinatları ayarlanmalıdır
  doc.setFont("helvetica", "bold"); // Bold font ayarı
  doc.text("Tél:", 16, 46);
  doc.setFont("helvetica", "normal"); // Detaylar için normal fonta dönülür
  doc.text("065946565", 30, 46);

  doc.setFont("helvetica", "bold");
  doc.text("E-Mail:", 16, 50);
  doc.setFont("helvetica", "normal");
  doc.text("dalyana.mons@gmail.com", 30, 50);

  doc.setFont("helvetica", "bold");
  doc.text("Website:", 16, 54);
  doc.setFont("helvetica", "normal");
  doc.text("www.dalyana.com", 30, 54);

  doc.setFont("helvetica", "bold");
  doc.text("TVA:", 16, 58);
  doc.setFont("helvetica", "normal");
  doc.text("BE0755397594", 30, 58);

  doc.setFont("helvetica", "bold");
  doc.text("Coordonnées Bancaires:", 16, 62);
  doc.setFont("helvetica", "normal");
  doc.text("CBC BE78732056758286", 16, 66);
  doc.text("BIC CREGBEBB", 16, 70);

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
doc.rect(160, 16, boxWidth, boxHeight);  // Çerçevenin üst çizgisini yukarı çek

// Metni çerçevenin içine yerleştir
doc.text(statusText, 160 + paddingX, 26); // Metni dikey olarak kutunun içine ortala



    // Müşteri bilgileri
    doc.setFontSize(9);
    doc.text(`ID: ${clientData.id}\nName: ${clientData.name}\nTVA: ${clientData.tva}\nPhone Number: ${clientData.phoneNumber}\nEmail: ${clientData.email}\nAddress: ${clientData.address}\nZip Code: ${clientData.zipCode}\nCity: ${clientData.city}`, 150, 46);
  
    let currentY = 70; // Yeni Y konumunu belirle
  
    // Proje Bilgileri Üst Bilgileri
    doc.setFontSize(9);

    currentY += 10;
  
    // Kategori Başlıkları ve Tablolar
    const categories = [
      { title: "Articles", data: projectData.articles },
      { title: "Items Accessoires", data: projectData.itemsAccessoires },
      { title: "Items Electromenagers", data: projectData.itemsElectromenagers },
      { title: "Items Sanitaires", data: projectData.itemsSanitaires },
      { title: "Items Divers", data: projectData.itemsDivers },
      { title: "Items Surfaces", data: projectData.itemsSurfaces },
    ];
  
    categories.forEach(category => {
      if (doc.internal.pageSize.height - currentY < 20) {
        doc.addPage();
        currentY = 10; // Yeni sayfanın başına geri dön
      }
      doc.setFontSize(9);
      currentY += 7; // Başlık için boşluk
      doc.text(category.title, 10, currentY);
      currentY += 3; // Tablo öncesi boşluk
      doc.autoTable({
        startY: currentY,
        theme: 'striped',
        head: [['Name', 'List Price', 'Price', 'Quantity', 'Tax Rate', 'VAT Included Price', 'Subtotal', 'Discount Rate']],
        body: category.data.map(item => [
          item.name || item.productId,
          item.furnitureListPrice || '',
          item.price,
          item.quantity,
          item.taxRate,
          item.vatIncludedPrice,
          item.subtotal || '',
          item.discountRate,
        ]),
        didDrawPage: function (data) {
          currentY = data.cursor.y + 5; // Güncel Y konumunu güncelle ve biraz boşluk bırak
        }
      });
    });
  
    // Diğer Ücretler ve Genel Sözleşme Şartları için yeterli alan kontrolü
    if (doc.internal.pageSize.height - currentY < 40) {
      doc.addPage();
      currentY = 10; // Yeni sayfanın başına geri dön
    }
  
    // Diğer Ücretler
    doc.setFontSize(9);
    const feesStartY = currentY + 10; // Diğer ücretler için biraz boşluk bırak
    doc.text(`Delivery Fee: ${projectData.deliveryFee}\nMontage Fee: ${projectData.montageFee}\nGrand Total: ${projectData.grandTotal}\nGlobal Discount: ${projectData.globaldiscount}`, 10, feesStartY);
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
        doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, null, null, 'center');
      }
    };
  
    addPageNumbers(); // Sayfa numaralarını fonksiyonu çağırarak ekleyin
  
    doc.save("projet.pdf");
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
