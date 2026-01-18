import { AuditData } from "../types";

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------
// To receive these emails, create a free form at https://formspree.io/
// 1. Register and create a new form pointed to "admin@ironcladcas.com"
// 2. Paste the URL they provide below (e.g., "https://formspree.io/f/xvazzpnk")
// ---------------------------------------------------------------------------
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mreepngy"; 

export const sendAuditNotification = async (data: AuditData) => {
  // If the user hasn't set up their endpoint yet, we log a warning and exit to prevent errors.
  if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID_HERE")) {
    console.warn("IronClad System: Email notification skipped. Please configure FORMSPREE_ENDPOINT in services/emailService.ts to receive leads.");
    return;
  }

  try {
    console.log("IronClad System: Sending audit data to admin...");
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _subject: `New Business Audit: ${data.businessName}`, // Formspree special field for subject line
        businessName: data.businessName,
        industry: data.industry,
        email: data.email,
        phone: data.phone,
        revenue: data.revenue,
        employees: data.employees,
        accountingSetup: data.accountingSetup,
        painPoints: data.painPoints.join(", "),
        customPain: data.customPain
      })
    });

    if (response.ok) {
        console.log("IronClad System: Audit submission sent to admin successfully.");
    } else {
        console.error("IronClad System: Failed to send audit submission. Status:", response.status);
    }
  } catch (error) {
    console.error("IronClad System: Network error sending audit submission.", error);
  }
};