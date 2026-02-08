import type { SmokingLog } from '../../types';
import { formatDate } from '../../utils/dateHelpers';

interface DataExportProps {
    logs: SmokingLog[];
}

export function DataExport({ logs }: DataExportProps) {
    const handleExport = () => {
        if (logs.length === 0) {
            alert('No data to export');
            return;
        }

        // Create CSV content
        const headers = ['Date', 'Time', 'Trigger'];
        const rows = logs.map(log => {
            const date = new Date(log.timestamp);
            return [
                formatDate(date),
                date.toLocaleTimeString(),
                log.trigger
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smoking-tracker-${formatDate(new Date())}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Data</h3>

            <button
                onClick={handleExport}
                disabled={logs.length === 0}
                className="w-full flex items-center justify-between bg-[#2a2a2a] hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-4 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="text-white font-medium">Export Data (CSV)</p>
                        <p className="text-gray-400 text-sm">Download your smoking history</p>
                    </div>
                </div>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <p className="text-xs text-gray-500 mt-3">
                Exporting will create a CSV file of your entire smoking history.
            </p>
        </div>
    );
}
