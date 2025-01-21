// components/QrScanner.js

'use client'; // Mark this file as a client component

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the QR Reader and disable SSR
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const QrScanner = () => {
  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h2>QR Scanner</h2>
      <QrReader
        delay={300}
        style={{ width: "100%" }}
        onError={handleError}
        onScan={handleScan}
      />
      {scanResult && <p>Scanned Result: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;
