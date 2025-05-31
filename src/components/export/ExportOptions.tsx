import React, { useRef } from 'react';
import { BingoBoard } from '../../types';
import { FileDown, Share2, Printer, QrCode } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import { toast } from 'react-toastify';

interface ExportOptionsProps {
  board: BingoBoard;
  boardRef: React.RefObject<HTMLDivElement>;
  shareUrl: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ board, boardRef, shareUrl }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => boardRef.current,
    documentTitle: `${board.title} Bingo Board`,
    onAfterPrint: () => toast.success('Print initiated successfully!'),
  });
  
  const handleExportImage = async () => {
    if (!boardRef.current) return;
    
    try {
      const dataUrl = await toPng(boardRef.current, { quality: 0.95 });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${board.title.replace(/\s+/g, '-').toLowerCase()}-bingo-board.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('Board exported as image successfully!');
    } catch (error) {
      console.error('Error exporting image:', error);
      toast.error('Failed to export board as image');
    }
  };
  
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Share link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy share link'));
  };
  
  const handlePrintQRCode = useReactToPrint({
    content: () => qrCodeRef.current,
    documentTitle: `${board.title} Bingo Board QR Code`,
    onAfterPrint: () => toast.success('QR code print initiated!'),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Export Options</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Printer className="h-5 w-5" />
          Print Board
        </button>
        
        <button
          onClick={handleExportImage}
          className="flex items-center justify-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <FileDown className="h-5 w-5" />
          Export as Image
        </button>
        
        <button
          onClick={handleCopyShareLink}
          className="flex items-center justify-center gap-2 p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Share2 className="h-5 w-5" />
          Copy Share Link
        </button>
        
        <button
          onClick={handlePrintQRCode}
          className="flex items-center justify-center gap-2 p-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
        >
          <QrCode className="h-5 w-5" />
          Print QR Code
        </button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">QR Code</h3>
        <div className="flex justify-center bg-white p-4 rounded-lg shadow-sm" ref={qrCodeRef}>
          <div className="text-center">
            <QRCode value={shareUrl} size={180} />
            <p className="mt-2 text-sm text-gray-600">Scan to view board</p>
            <p className="text-xs text-gray-500">{shareUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;