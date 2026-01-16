'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import CertificateGallery from '@/components/CertificateGallery';

export default function StudentCertificatesPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2 font-display flex items-center gap-3">
                    <span className="text-5xl">🏆</span>
                    My Certificates
                </h1>
                <p className="text-gray-400">View and download your earned certificates</p>
            </div>

            {/* Certificate Gallery */}
            <CertificateGallery />
        </div>
    );
}
