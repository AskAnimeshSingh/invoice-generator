const { generateInvoicePdf } = require('../server/generatePdf');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pdfBuffer = await generateInvoicePdf(req.body);
    const invoiceNumber = req.body.invoiceNumber || 'draft';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${invoiceNumber}.pdf"`
    );
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    const status = err.status || 500;
    return res.status(status).json({
      error: err.status === 400 ? err.message : 'Failed to generate invoice PDF.',
    });
  }
};
