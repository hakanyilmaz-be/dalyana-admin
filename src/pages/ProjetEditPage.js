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
doc.setFillColor(242, 242, 242); // Açık gri renk ayarla (RGB)
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

    currentY += 10;
  
    // Kategori Başlıkları ve Tablolar
    const categories = [
      { title: "MEUBLES", data: projectData.articles },
      { title: "ACCESSOIRES", data: projectData.itemsAccessoires },
      { title: "ÉLECTROMÉNAGERS", data: projectData.itemsElectromenagers },
      { title: "SANITAIRES", data: projectData.itemsSanitaires },
      { title: "PDT SOLID SURFACE", data: projectData.itemsSurfaces },
      { title: "DIVERS", data: projectData.itemsDivers },
    ];
  
    categories.forEach(category => {
      if (doc.internal.pageSize.height - currentY < 20) {
        doc.addPage();
        currentY = 10; // Yeni sayfanın başına geri dön
      }
      doc.setFontSize(15);
      currentY += 7; // Başlık için boşluk
      doc.text(category.title, 18, currentY);
      doc.setFontSize(9);
      currentY += 3; // Tablo öncesi boşluk
      doc.autoTable({
        startY: currentY,
        margin: { left: 18 },
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
