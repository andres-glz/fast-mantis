import { memo } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

export const PDFViewerContainer = memo(function PDFViewerContainer({ data }) {
    return (
        <div>
            <PDFDownloadLink
                document={<PDFDocument data={data} />}
                fileName={`FSW-${data.mantis}.pdf`}
                style={{
                    textDecoration: 'none',
                    padding: '10px 20px',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '20px'
                }}
            >
                {({ loading }) => (loading ? 'Generando...' : 'Descargar Documento')}
            </PDFDownloadLink>

            <PDFViewer style={{ width: '100%', height: '80vh', border: 'none' }}>
                <PDFDocument data={data} />
            </PDFViewer>
        </div>
    );
});