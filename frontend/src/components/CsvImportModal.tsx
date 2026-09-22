import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, FileText, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

interface CsvImportModalProps {
  moduleId: string;
  fields: any[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  moduleId,
  fields,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processCsvFile(selected);
  };

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setError('CSV must have at least a header row and one data row.');
      return;
    }

    // Parse headers
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    setCsvHeaders(headers);

    // Parse rows
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = vals[idx] || '';
      });
      rows.push(rowObj);
    }

    setParsedRows(rows);

    // Auto-map matching field names
    const initialMapping: Record<string, string> = {};
    fields.forEach((f) => {
      const match = headers.find(
        (h) =>
          h.toLowerCase() === f.name.toLowerCase() ||
          h.toLowerCase() === f.label.toLowerCase(),
      );
      if (match) {
        initialMapping[f.name] = match;
      }
    });
    setMapping(initialMapping);
  };

  const processCsvFile = (selectedFile: File) => {
    setError('');
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCsvText(content);
    };
    reader.onerror = () => setError('Failed to read CSV file');
    reader.readAsText(selectedFile);
  };

  const handleSubmit = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setError('');

    try {
      // Transform rows based on user's field mapping
      const items = parsedRows.map((row) => {
        const itemValues: Record<string, any> = {};
        fields.forEach((f) => {
          const csvCol = mapping[f.name];
          if (csvCol && row[csvCol] !== undefined) {
            itemValues[f.name] = row[csvCol];
          }
        });
        return itemValues;
      });

      await api.post(`/compose/modules/${moduleId}/records/bulk`, { items });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import CSV records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Records from CSV</h2>
              <p className="text-xs text-slate-400">Upload a spreadsheet and map columns to module fields</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* File dropzone */}
          {!file ? (
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/15 rounded-2xl hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer group">
              <Upload className="w-10 h-10 text-slate-400 group-hover:text-emerald-400 mb-3 transition-colors" />
              <span className="text-sm font-semibold text-white">Click or drag CSV file to upload</span>
              <span className="text-xs text-slate-500 mt-1">Supports standard comma-separated .csv files</span>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-sm font-semibold text-white">{file.name}</div>
                  <div className="text-xs text-slate-400">{parsedRows.length} records detected</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setParsedRows([]);
                  setCsvHeaders([]);
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Change File
              </button>
            </div>
          )}

          {/* Column Mapping Section */}
          {csvHeaders.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Map CSV Columns to Module Fields
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                {fields.map((field) => (
                  <div key={field.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{field.label}</span>
                      <span className="text-[10px] font-mono text-slate-500">{field.kind}</span>
                    </div>
                    <select
                      value={mapping[field.name] || ''}
                      onChange={(e) =>
                        setMapping({ ...mapping, [field.name]: e.target.value })
                      }
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Do Not Import --</option>
                      {csvHeaders.map((h) => (
                        <option key={h} value={h}>
                          CSV: "{h}"
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || parsedRows.length === 0 || loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importing Records...</span>
              </>
            ) : (
              <>
                <span>Import {parsedRows.length} Records</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
