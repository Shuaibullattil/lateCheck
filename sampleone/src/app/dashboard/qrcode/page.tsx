"use client"
import { QRCodeCanvas } from "qrcode.react";

const QrGenerator = () => {
  const formUrl = "https://192.168.146.209:3000/late-entry-form"; // Change to your actual URL

  return <QRCodeCanvas value={formUrl} size={200} />;
};

export default QrGenerator;
