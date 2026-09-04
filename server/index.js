const express = require('express');
const cors = require('cors');
const { generateInvoicePdf, COMPANY } = require('./generatePdf');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/api/generate-invoice', async (req, res) => {
  try {
    const pdfBuffer = await generateInvoicePdf(req.body);
    const invoiceNumber = req.body.invoiceNumber || 'draft';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${invoiceNumber}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    const status = err.status || 500;
    res.status(status).json({
      error: err.status === 400 ? err.message : 'Failed to generate invoice PDF.',
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, company: COMPANY.name });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Invoice server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
