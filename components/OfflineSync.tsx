'use client';

import { useEffect, useRef } from 'react';

export default function OfflineSync() {
    const isSyncing = useRef(false);

    useEffect(() => {
        const syncData = async () => {
            if (isSyncing.current) return;

            const pendingSyncsStr = localStorage.getItem('offlinePendingSyncs');
            if (!pendingSyncsStr) return;

            let pendingSyncs = [];
            try {
                pendingSyncs = JSON.parse(pendingSyncsStr);
            } catch (e) {
                console.error("Error parsing offline syncs:", e);
                return;
            }

            if (pendingSyncs.length === 0) return;

            isSyncing.current = true;
            console.log(`Attempting to sync ${pendingSyncs.length} pending requests...`);
            const updatedSyncs = [];

            for (const syncData of pendingSyncs) {
                try {
                    const { patientId, patientInfo, symptomAnswers, activeEye, imageSrc } = syncData;
                    const formData = new FormData();

                    formData.append("Patient_ID", patientId);
                    formData.append("Patient_Name", patientInfo?.name || "");
                    formData.append("Age", patientInfo?.age || "0");
                    formData.append("Gender", patientInfo?.gender === "male" ? "0" : "1");
                    formData.append("Eye_Side", activeEye === "left" ? "0" : "1");

                    // Symptom mapping
                    formData.append("Vision_Blurred_Gradual", symptomAnswers[1] === "Yes" ? "1" : "0");
                    formData.append("Vision_Halos_Night", symptomAnswers[2] === "Yes" ? "1" : "0");
                    formData.append("Vision_Sudden_Loss", symptomAnswers[4] === "Yes" ? "1" : "0");
                    formData.append("Vision_Colors_Faded", symptomAnswers[5] === "Yes" ? "1" : "0");
                    formData.append("Vision_Night_Blindness", symptomAnswers[16] === "Yes" ? "1" : "0");

                    formData.append("Symptom_Eye_Dryness", symptomAnswers[17] === "Yes" ? "1" : "0");
                    formData.append("Symptom_Gritty_Sensation", symptomAnswers[6] === "Yes" ? "1" : "0");
                    formData.append("Symptom_Deep_Eye_Pain", symptomAnswers[7] === "Yes" ? "1" : "0");
                    formData.append("Symptom_Photophobia", symptomAnswers[8] === "Yes" ? "1" : "0");
                    formData.append("Symptom_Surface_Pain", symptomAnswers[9] === "Yes" ? "1" : "0");

                    formData.append("Sign_Redness", symptomAnswers[10] === "Yes" ? "1" : "0");
                    formData.append("Sign_Fleshy_Growth", symptomAnswers[11] === "Yes" ? "1" : "0");
                    formData.append("Sign_Eye_Discharge", symptomAnswers[12] === "Yes" ? "1" : "0");
                    formData.append("Sign_Cornea_White_Spot", symptomAnswers[13] === "Yes" ? "1" : "0");
                    formData.append("Sign_Drooping_Eyelid", symptomAnswers[3] === "Yes" ? "1" : "0");

                    formData.append("History_Diabetes", patientInfo?.diabetes ? "1" : "0");
                    formData.append("History_Hypertension", patientInfo?.hypertension ? "1" : "0");
                    formData.append("History_Autoimmune_Disease", symptomAnswers[15] === "Yes" ? "1" : "0");
                    formData.append("History_Contact_Lens", symptomAnswers[14] === "Yes" ? "1" : "0");
                    formData.append("History_Family_Eye_Disease", patientInfo?.familyHistory ? "1" : "0");

                    formData.append("Symptom_Duration_Days", patientInfo?.durationDays?.toString() || "0");

                    let diagnosisLabel = patientInfo?.diseaseName || "Normal";
                    if (diagnosisLabel && diagnosisLabel !== "Normal") {
                        diagnosisLabel = diagnosisLabel.charAt(0).toUpperCase() + diagnosisLabel.slice(1);
                    }
                    formData.append("Diagnosis_Label", diagnosisLabel);

                    let severityNum = "0";
                    if (patientInfo?.severity === 'mild') severityNum = "1";
                    if (patientInfo?.severity === 'moderate') severityNum = "2";
                    if (patientInfo?.severity === 'severe') severityNum = "3";
                    formData.append("Severity_Level", severityNum);

                    if (imageSrc && imageSrc.startsWith('data:image')) {
                        const res = await fetch(imageSrc);
                        const blob = await res.blob();
                        const imgFilename = `${patientId}_${diagnosisLabel.toUpperCase()}.jpg`;
                        formData.append("Image_Path", blob, imgFilename);
                    }

                    const response = await fetch("https://n8n.vps.safone.dev/webhook/eyevlm-data", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("HTTP Status " + response.status);
                    }
                    console.log(`Successfully synced patient ${patientId}`);
                } catch (error) {
                    console.error("Failed to sync entry:", error);
                    updatedSyncs.push(syncData); // Keep the failed sync
                }
            }

            if (updatedSyncs.length === 0) {
                localStorage.removeItem('offlinePendingSyncs');
            } else {
                localStorage.setItem('offlinePendingSyncs', JSON.stringify(updatedSyncs));
            }

            isSyncing.current = false;
        };

        const handleOnline = () => {
            console.log("Device went online. Triggering sync...");
            syncData();
        };

        window.addEventListener('online', handleOnline);

        // Initial check in case it's online on mount
        if (navigator.onLine) {
            syncData();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    // Invisible component, only handles logic
    return null;
}
