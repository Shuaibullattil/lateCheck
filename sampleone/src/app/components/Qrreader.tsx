"use client";

import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QrReader = () => {
    const router = useRouter();

    useEffect(() => {
        const scannerContainer = document.getElementById("qr-reader");

        // 🔥 Clear any previously rendered scanner UI
        if (scannerContainer) {
            scannerContainer.innerHTML = ""; // Clear any leftover elements
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

        // Cleanup on unmount
        return () => {
            scanner.clear().catch((error) =>
                console.error("Failed to clear scanner on unmount", error)
            );
        };
    }, []);

    return <div id="qr-reader" style={{ width: "500px", border: "none" }} />;
};

export default QrReader;
