import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },

    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10,
        color: 'grey',
    },

    mainRow: {
        flexDirection: 'row',
    },

    hed: {
        flexDirection: 'row',

    },
    cell_color: {
        backgroundColor: '#E37878',
        fontWeight: 'bold',
    }
    ,
    cell_lt: {
        borderLeft: "1px solid black",
        borderTop: "1px solid black",
    },
    cell_t: {
        borderTop: "1px solid black",
    },
    cell_l: {
        borderLeft: "1px solid black",
    },
    cell: {
        padding: 5,
        borderBottom: "1px solid black",
        borderRight: "1px solid black",
    }

});

const StyledDocument = ({ data }) => {
    const today = new Date().toISOString().split('T')[0];
    const changes = data.changes || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={{ marginBottom: 20, flexDirection: 'row', gap: 10 }}>
                    <View style={{ backgroundColor: '#E37878', width: 10 }} />
                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontWeight: 'semibold' }}>Unit Test Document</Text>
                        <Text>FSW-{data.mantis}</Text>
                        <Text style={{ color: '#CF0E0E' }}>TCA Software Solutions</Text>
                    </View>
                </View>

                {/* Info table */}
                <View style={{ marginBottom: 20 }}>
                    <View style={styles.hed}>
                        <View style={[{ width: '25%' }, styles.cell_lt, styles.cell, styles.cell_color]}>
                            <Text>Mantis</Text>
                        </View>
                        <View style={[{ flex: 1 }, styles.cell_t, styles.cell]}>
                            <Text>{data.mantisUrl}</Text>
                        </View>
                    </View>
                    <View style={styles.hed}>
                        <View style={[{ width: '25%' }, styles.cell_l, styles.cell, styles.cell_color]}>
                            <Text>Título</Text>
                        </View>
                        <View style={[{ flex: 1 }, styles.cell]}>
                            <Text>{data.title}</Text>
                        </View>
                    </View>
                    <View style={styles.hed}>
                        <View style={[{ width: '25%' }, styles.cell_l, styles.cell, styles.cell_color]}>
                            <Text>Descripción</Text>
                        </View>
                        <View style={[{ flex: 1 }, styles.cell]}>
                            <Text>{data.brief}</Text>
                        </View>
                    </View>
                    <View style={styles.hed}>
                        <View style={[{ width: '25%' }, styles.cell_l, styles.cell, styles.cell_color]}>
                            <Text>Tipo</Text>
                        </View>
                        <View style={[{ flex: 1 }, styles.cell]}>
                            <Text>{data.tipo}</Text>
                        </View>
                    </View>
                    {data.sprint && (
                        <View style={styles.hed}>
                            <View style={[{ width: '25%' }, styles.cell_l, styles.cell, styles.cell_color]}>
                                <Text>Sprint</Text>
                            </View>
                            <View style={[{ flex: 1 }, styles.cell]}>
                                <Text>{data.sprint}</Text>
                            </View>
                        </View>
                    )}
                    <View style={styles.hed}>
                        <View style={[{ width: '25%' }, styles.cell_l, styles.cell, styles.cell_color]}>
                            <Text>Fecha</Text>
                        </View>
                        <View style={[{ flex: 1 }, styles.cell]}>
                            <Text>{today}</Text>
                        </View>
                    </View>
                </View>

                {/* Componentes */}
                {data.componentes && data.componentes.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 6, color: '#CF0E0E', fontSize: 11, fontWeight: 'semibold' }}>Componentes modificados:</Text>
                        <View style={styles.hed}>
                            <View style={[{ flex: 2 }, styles.cell_lt, styles.cell, styles.cell_color]}><Text>Componente</Text></View>
                            <View style={[{ flex: 1 }, styles.cell_t, styles.cell, styles.cell_color]}><Text>Versión DLL</Text></View>
                            <View style={[{ flex: 1 }, styles.cell_t, styles.cell, styles.cell_color]}><Text>Versión ASCX</Text></View>
                        </View>
                        {data.componentes.map((c, i) => (
                            <View key={i} style={styles.hed}>
                                <View style={[{ flex: 2 }, styles.cell_l, styles.cell]}><Text>{c.componente}</Text></View>
                                <View style={[{ flex: 1 }, styles.cell]}><Text>{c.version_dll}</Text></View>
                                <View style={[{ flex: 1 }, styles.cell]}><Text>{c.version_ascx}</Text></View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Cambios / pruebas */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ marginBottom: 6, color: '#CF0E0E', fontSize: 11, fontWeight: 'semibold' }}>Cambios realizados:</Text>

                    {changes.filter(c => c.description || (c.images && c.images.length > 0)).map((change, index) => (
                        <View key={index} style={{ marginTop: 10, padding: 10, backgroundColor: '#F0F0F0' }}>
                            {change.description ? <Text style={{ marginBottom: 6 }}>{change.description}</Text> : null}
                            {change.images && change.images.map((src, imgIdx) => (
                                <Image key={imgIdx} src={src} style={{ width: '100%', marginTop: 4 }} />
                            ))}
                        </View>
                    ))}
                </View>

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `Página ${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

export default StyledDocument;