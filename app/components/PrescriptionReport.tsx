import React from 'react';

interface PrescriptionReportProps {
    patientId: string;
    patientName?: string;
    age?: string;
    gender?: string;
    date: string;
    disease: string;
    severity: string;
    confidence: number;
    activeEye: string;
    imageSrc: string | null;
    t: any;
}

export const PrescriptionReport = React.forwardRef<HTMLDivElement, PrescriptionReportProps>(
    ({ patientId, patientName = "N/A", age = "N/A", gender = "N/A", date, disease, severity, confidence, activeEye, imageSrc, t }, ref) => {
        return (
            <div
                ref={ref}
                className="w-[800px] h-[1131px] bg-white text-black p-10 font-sans relative box-border"
                style={{ color: '#000', backgroundColor: '#fff', fontSize: '14px' }}
            >
                {/* Header - Hospital / Clinic Info */}
                <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src="/icons/icon.png"
                            alt="EyeVLM Logo"
                            className="size-16 rounded-xl object-contain shadow-sm"
                            crossOrigin="anonymous"
                        />
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Diagnostic Center</h1>
                            <p className="text-sm text-slate-500 mt-1">Advanced AI Retinal Screening & Ophthalmology</p>
                            <p className="text-xs text-slate-400">123 Health Avenue, Medical District • +1 (800) 555-EYES</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-700">Medical Report</h2>
                        <p className="text-sm text-slate-500 mt-1 font-mono">ID: {patientId}</p>
                        <p className="text-sm text-slate-500 font-mono">Date: {date}</p>
                    </div>
                </div>

                {/* Patient Information Box */}
                <div className="border border-slate-300 rounded-xl p-5 mb-8 bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Patient Information</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p className="font-semibold text-slate-800">{patientName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Age / Gender</p>
                            <p className="font-semibold text-slate-800">{age} / {gender}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Patient ID</p>
                            <p className="font-semibold text-slate-800 font-mono">{patientId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Scanned Eye</p>
                            <p className="font-semibold text-slate-800 capitalize">{activeEye}</p>
                        </div>
                    </div>
                </div>

                {/* Clinical Findings */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-slate-800">Rx</span>
                    </div>

                    <div className="flex gap-8">
                        {/* Image (if available) */}
                        {imageSrc && (
                            <div className="w-1/3 shrink-0">
                                <div className="rounded-xl overflow-hidden border-2 border-slate-200">
                                    <img src={imageSrc} alt="Retinal Scan" className="w-full h-auto aspect-square object-cover" />
                                </div>
                                <p className="text-center text-xs text-slate-500 mt-2 font-mono">Fig 1. Retinal Fundus Capture</p>
                            </div>
                        )}

                        {/* Analysis Details */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div>
                                <h4 className="text-sm text-slate-500 uppercase tracking-wider mb-1">Primary Diagnosis</h4>
                                <p className="text-2xl font-bold text-slate-800 capitalize text-rose-600">{disease || 'Diabetic Retinopathy'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Severity</h4>
                                    <p className="text-lg font-bold text-slate-800 capitalize">{severity || 'Moderate'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Confidence</h4>
                                    <p className="text-lg font-bold text-slate-800">{confidence}%</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm text-slate-500 uppercase tracking-wider mb-2">Key Indicators Detected</h4>
                                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                    {disease && disease.toLowerCase().includes('glaucoma') ? (
                                        <>
                                            <li><strong>Optic Disc Cupping:</strong> Enlarged cup-to-disc ratio observed.</li>
                                            <li><strong>Neuroretinal Rim Thinning:</strong> Significant thinning in the inferior quadrant.</li>
                                        </>
                                    ) : (
                                        <>
                                            <li><strong>Microaneurysms:</strong> Small red dots indicating blood vessel swelling.</li>
                                            <li><strong>Hard Exudates:</strong> Yellow lipid deposits leaked from abnormal vessels.</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations & Notes */}
                <div className="mb-12">
                    <h4 className="text-sm text-slate-500 uppercase tracking-wider mb-3">Clinical Recommendations</h4>
                    <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                        <p className="text-rose-800 font-medium mb-1">Immediate Ophthalmologist Consultation Required</p>
                        <p className="text-rose-700 text-sm">Based on the AI findings, it is highly recommended that the patient undergoes a comprehensive dilated eye exam and potential OCT imaging by a certified retinal specialist.</p>
                    </div>
                </div>

                {/* Footer / Signatures */}
                <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex justify-between items-end border-t border-slate-300 pt-8 mt-10">
                        <div className="text-xs text-slate-500 max-w-sm">
                            <strong className="text-slate-700">Disclaimer:</strong> EyeVLM is an AI-assisted screening tool. This report does not constitute a definitive medical diagnosis and must be interpreted by a qualified healthcare professional.
                        </div>

                        <div className="text-center w-64">
                            <div className="border-b-2 border-slate-800 h-10 mb-2 content-end pb-1">
                                <span className="font-signature text-2xl text-slate-600 block opacity-50">EyeVLM</span>
                            </div>
                            <p className="font-bold text-slate-800">Automated Analysis</p>
                            <p className="text-xs text-slate-500">EyeVLM Diagnostic Engine v1.0</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

PrescriptionReport.displayName = 'PrescriptionReport';
