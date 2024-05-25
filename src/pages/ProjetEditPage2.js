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

const ProjetEditPage2 = () => {
  const clientData = clientsData[0];

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Logo ve firma bilgileri
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);
    doc.setFontSize(10);
    doc.text(`Tél: 065946565\nE-Mail: dalyana.mons@gmail.com\nCoordonnées bancaires: CBC BE78732056758286\nBIC CREGBEBB\nTVA: BE0755397594\nwebsite: https://dalyana.com/`, 150, 10);

    // Müşteri bilgileri
    doc.setFontSize(12);
    doc.text(`ID: ${clientData.id}\nName: ${clientData.name}\nTVA: ${clientData.tva}\nPhone Number: ${clientData.phoneNumber}\nEmail: ${clientData.email}`, 10, 40);
    doc.text(`Address: ${clientData.address}\nZip Code: ${clientData.zipCode}\nCity: ${clientData.city}\nNote: ${clientData.note}`, 100, 40);

    let currentY = 70; // Yeni Y konumunu belirle

    // Proje Bilgileri Üst Bilgileri
    doc.setFontSize(10);
    doc.text(`Floor: ${projectData.floor}\nElevator: ${projectData.elevator}\nStatus: ${projectData.status}`, 10, currentY);
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
      doc.setFontSize(12);
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
        margin: { top: 60 },
        didDrawPage: function (data) {
          currentY = data.cursor.y; // Güncel Y konumunu güncelle
        }
      });
    });

    // Diğer Ücretler için alan kontrolü
    if (doc.internal.pageSize.height - currentY < 20) {
      doc.addPage();
      currentY = 10; // Yeni sayfanın başına geri dön
    }

    // Diğer Ücretler
    currentY += 10; // Boşluk ekle
    doc.text(`Delivery Fee: ${projectData.deliveryFee}\nMontage Fee: ${projectData.montageFee}\nTotal Fee: ${projectData.totalFee}\nGlobal Discount: ${projectData.globaldiscount}`, 10, currentY);

    // Genel Sözleşme Şartları için yeni sayfa
    doc.addPage();
    terms.terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 10, 10 + (index * 10));
    });

    doc.save("fatura.pdf");
  };

  return (
    <>
      <ClientsEditPage showProjectList={false} />
      <ProjetEdit />
      <div className='mt-5'>
        <h3 className='my-5' style={{ textAlign: 'center' }}>Le service après-vente (SAV)</h3>
        <Sav />
      </div>
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <Button onClick={downloadPdf}>PDF İndir</Button>
      </div>
    </>
  );
};

export default ProjetEditPage2;
