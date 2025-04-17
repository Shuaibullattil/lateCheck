"use client";

import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QrReader = () => {
    const router = useRouter();

    useEffect(() => {
        const scannerContainer = document.getElementById("qr-reader");

        
        if (scannerContainer) {
            scannerContainer.innerHTML = "";
        }

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: 250 },
            false
        );

        scanner.render(
            (decodedText) => {
                if (decodedText === "sahara") {
                    router.push("/late-entry-form");
                } else {
                    alert(decodedText);
                }
            },
            (errorMessage) => {
                console.log("QR Code scanning error:", errorMessage);
            }
        );

        return () => {
            scanner.clear().catch((error) =>
                console.error("Failed to clear scanner on unmount", error)
            );
        };
    }, []);

    return <div id="qr-reader" style={{ width: "500px", border: "none" }} />;
};

export default QrReader;
