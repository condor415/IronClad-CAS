import { AuditData } from "../types";

// ---------------------------------------------------------------------------
// HUBSPOT CONFIGURATION
// ---------------------------------------------------------------------------
// 1. PORTAL ID (Hub ID): 244903588
// 2. FORM ID: 49b341cc-08f4-418b-ac00-670d74ff60ed
// ---------------------------------------------------------------------------

const PORTAL_ID = "244903588"; 
const FORM_ID = "49b341cc-08f4-418b-ac00-670d74ff60ed";

export const submitToHubSpot = async (data: AuditData) => {
  // If IDs are missing, we skip execution
  if (!PORTAL_ID || !FORM_ID) {
    console.warn("HubSpot Integration: Form ID not configured in services/hubspotService.ts");
    return;
  }

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

  // Split contact name for HubSpot
  const nameParts = data.contactName.split(' ');
  const firstname = nameParts[0] || "";
  const lastname = nameParts.slice(1).join(' ') || "";

  const body = {
    fields: [
      { name: "email", value: data.email },
      { name: "firstname", value: firstname },
      { name: "lastname", value: lastname },
      { name: "company", value: data.businessName },
      { name: "industry", value: data.industry },
      { name: "phone", value: data.phone },
      { name: "annualrevenue", value: data.revenue },
      { name: "numberofemployees", value: data.employees }, // Mapped to standard HubSpot 'numberofemployees'
      // Concatenate extra info into the message/notes field
      { 
        name: "message", 
        value: `Accounting Setup: ${data.accountingSetup}\nPain Points: ${data.painPoints.join(', ')}\nSpecific Issues: ${data.customPain}` 
      }
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
        const err = await response.json();
        console.error("HubSpot Submission Failed:", err);
    } else {
        console.log("HubSpot Submission Successful");
    }
  } catch (error) {
    console.error("HubSpot Network Error:", error);
  }
};