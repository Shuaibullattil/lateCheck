"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QrReader = ({hostel} :{hostel:string}) => {
    const router = useRouter();
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [cameras, setCameras] = useState<any[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch available cameras on mount
        Html5Qrcode.getCameras()
            .then((devices) => {
                setCameras(devices);
                if (devices.length > 0) {
                    setSelectedCameraId(devices[0].id); // Auto-select first camera
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Camera fetch error:", err);
                setLoading(false);
            });

        return () => {
            stopScanner(); // Clean up on unmount
        };
    }, []);

    const startScanner = async () => {
        if (!selectedCameraId) return;

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("qr-reader");
        }

        try {
            await scannerRef.current.start(
                selectedCameraId,
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    if (decodedText === hostel) {
                        router.push("/late-entry-form");
                    } else {
                        alert(decodedText+hostel);
                    }
                },
                (error) => {
                    console.warn("QR scan error:", error);
                }
            );
            setIsScanning(true);
        } catch (err) {
            console.error("Start error:", err);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error("Stop error:", err);
            }
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-semibold mb-4">QR Scanner</h2>

            {loading ? (
                <p>Loading cameras...</p>
            ) : (
                <>
                    <select
                        className="mb-4 p-2 border rounded"
                        value={selectedCameraId || ""}
                        onChange={(e) => setSelectedCameraId(e.target.value)}
                        disabled={isScanning}
                    >
                        {cameras.map((camera) => (
                            <option key={camera.id} value={camera.id}>
                                {camera.label || `Camera ${camera.id}`}
                            </option>
                        ))}
                    </select>

                    <div id="qr-reader" style={{ width: "400px" }} className="mb-4" />

                    {!isScanning ? (
                        <button
                            onClick={startScanner}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Start Scanning
                        </button>
                    ) : (
                        <button
                            onClick={stopScanner}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Stop Scanning
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default QrReader;
