import PDFDocument from "pdfkit";

export function generateContractPDFBuffer(contract: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.fontSize(18).text("EMPLOYMENT CONTRACT", { align: "center" });
      doc.moveDown();

      doc
        .fontSize(12)
        .text(
          `This Employment Contract is entered into on ${new Date(
            contract.created_at
          ).toDateString()}, by and between:`
        );
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Employer: Employvia`);
      doc.fontSize(12).text(`Employee: ${contract.full_name}`);
      doc.moveDown(2);

      doc.fontSize(14).text("1. Position & Contract Type");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `The Employer agrees to employ the Employee under a ${contract.contract_type} contract.`
        );

      doc.moveDown();

      doc.fontSize(14).text("2. Employment Period");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(`Start Date: ${new Date(contract.start_date).toDateString()}`);
      doc.moveDown(0.2);
      doc
        .fontSize(11)
        .text(`End Date: ${new Date(contract.end_date).toDateString()}`);
      doc.moveDown(0.2);
      doc
        .fontSize(11)
        .text(
          "If no end date is specified, the contract shall remain valid until terminated according to company policy or applicable law."
        );

      doc.moveDown();

      doc.fontSize(14).text("3. Compensation");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `The Employee shall receive a salary of ${contract.salary_amount} per agreed payment period, subject to applicable taxes and deductions.`
        );

      doc.moveDown();

      doc.fontSize(14).text("4. Duties & Responsibilities");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `The Employee agrees to perform all duties assigned by the Employer in a professional and responsible manner, in accordance with company policies and procedures.`
        );

      doc.moveDown();

      doc.fontSize(14).text("5. Working Conditions");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `The Employee agrees to comply with all workplace rules, confidentiality requirements, and applicable laws during the course of employment.`
        );

      doc.moveDown();

      doc.fontSize(14).text("6. Contract Status");
      doc.moveDown(0.3);
      doc.fontSize(11).text(`Current contract status: Sent.`);

      doc.moveDown();

      doc.fontSize(14).text("7. Termination");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `Either party may terminate this Contract in accordance with applicable labor laws and company regulations.`
        );

      doc.moveDown();

      doc.fontSize(14).text("8. Confidentiality");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `The Employee agrees not to disclose any confidential or proprietary information obtained during employment.`
        );

      doc.moveDown();

      doc.fontSize(14).text("9. Governing Law");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .text(
          `This Contract shall be governed by and interpreted in accordance with the laws of the applicable jurisdiction.`
        );

      doc.moveDown();

      doc.fontSize(14).text("10. Signatures");
      doc.moveDown(0.3);
      doc.fontSize(11).text("Employer Representative");
      doc.moveDown(0.3);
      doc.fontSize(11).text("Name: Employvia");
      doc.moveDown(0.2);
      doc.fontSize(11).text("Signature: ________________________");
      doc.moveDown(0.2);
      doc.fontSize(11).text("Date: ________________________");

      doc.moveDown();
      doc.fontSize(11).text("Employee");
      doc.moveDown(0.3);
      doc.fontSize(11).text(`Name: ${contract.full_name}`);
      doc.moveDown(0.2);

      doc.fontSize(11).text("Signature: ________________________");
      doc.moveDown(0.2);

      doc.fontSize(11).text("Date: ________________________");
      doc.moveDown(0.2);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
