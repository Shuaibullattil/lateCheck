"use client"
import { QRCodeCanvas } from "qrcode.react";

const QrGenerator = () => {
  const formUrl = "sahara"; // Change to your actual URL

  return <QRCodeCanvas value={formUrl} size={200} />;
};

export default QrGenerator;
