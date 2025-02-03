"use client"; // Required for Next.js App Router

import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrReader = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false // Verbose mode off
    );

    scanner.render(
      (decodedText) => {
        alert(`QR Code scanned: ${decodedText}`);
      },
      (errorMessage) => {
        console.log("QR Code scanning error:", errorMessage);
      }
    );

    return () => {
      scanner.clear(); // Correct method to clean up the scanner
    };
  }, []);

  return <div id="qr-reader" style={{ width: "500px",border: "none"}} />;
};

export default QrReader;
