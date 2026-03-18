import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import StyledDocument from './StyledDocument';

export const ProPdfGenerator = ({ data }) => {
    return (
        <div>
            <PDFDownloadLink
                document={<StyledDocument data={data} />}
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
                <StyledDocument data={data} />
            </PDFViewer>
        </div>
    );
};