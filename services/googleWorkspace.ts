/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import firebaseConfig from '../firebase-applet-config.json';

const CLIENT_ID = firebaseConfig.oAuthClientId || '46911070890-qhrav8pqedlj0mpi3ql83st1ppo1bjkt.apps.googleusercontent.com';
const API_KEY = firebaseConfig.apiKey || '';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/photoslibrary.readonly'
];

export interface WorkspaceUser {
  email?: string;
  name?: string;
  picture?: string;
}

let cachedAccessToken: string | null = null;
let tokenClient: any = null;

// Initialize Google Identity Services Token Client
export const initTokenClient = (onSuccess: (token: string) => void, onError?: (err: any) => void) => {
  if (typeof window === 'undefined') return;

  const checkGsi = () => {
    if ((window as any).google?.accounts?.oauth2) {
      try {
        tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: WORKSPACE_SCOPES.join(' '),
          callback: (response: any) => {
            if (response.error !== undefined) {
              console.error('OAuth error:', response);
              if (onError) onError(response);
              return;
            }
            cachedAccessToken = response.access_token;
            if (onSuccess) onSuccess(response.access_token);
          },
        });
      } catch (err) {
        console.error('Failed to init token client:', err);
      }
    } else {
      setTimeout(checkGsi, 300);
    }
  };

  checkGsi();
};

export const requestGoogleAccessToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (cachedAccessToken) {
      resolve(cachedAccessToken);
      return;
    }

    if (!tokenClient) {
      initTokenClient(
        (token) => resolve(token),
        (err) => reject(err)
      );
    }

    if (tokenClient) {
      try {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (e) {
        reject(e);
      }
    } else {
      reject(new Error('Google Identity Services client is not initialized yet.'));
    }
  });
};

export const getCachedToken = () => cachedAccessToken;
export const setCachedToken = (token: string | null) => { cachedAccessToken = token; };

// Helper for authenticated Google API requests
async function googleApiFetch(url: string, options: RequestInit = {}) {
  const token = cachedAccessToken || await requestGoogleAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ---------------- Google Drive API ----------------
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  createdTime?: string;
}

export const listDriveFiles = async (queryParam = "trashed = false"): Promise<DriveFileItem[]> => {
  const res = await googleApiFetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryParam)}&fields=files(id,name,mimeType,webViewLink,iconLink,createdTime)&pageSize=15`
  );
  return res.files || [];
};

export const createDriveJobFolder = async (folderName: string): Promise<DriveFileItem> => {
  return await googleApiFetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });
};

export const createDriveTextFile = async (name: string, content: string): Promise<DriveFileItem> => {
  return await googleApiFetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    body: JSON.stringify({
      name,
      mimeType: 'text/plain'
    })
  });
};

// ---------------- Google Sheets API ----------------
export interface SheetExportData {
  title: string;
  rows: (string | number)[][];
}

export const createFenceEstimateSheet = async (data: SheetExportData): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const spreadsheet = await googleApiFetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        title: `208 Fence & Gate - ${data.title}`
      },
      sheets: [
        {
          properties: {
            title: 'Estimate & Materials'
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: data.rows.map(row => ({
                values: row.map(val => ({
                  userEnteredValue: typeof val === 'number' ? { numberValue: val } : { stringValue: String(val) }
                }))
              }))
            }
          ]
        }
      ]
    })
  });

  return {
    spreadsheetId: spreadsheet.spreadsheetId,
    spreadsheetUrl: spreadsheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}/edit`
  };
};

// ---------------- Gmail API ----------------
export interface SendEmailPayload {
  to: string;
  subject: string;
  bodyText: string;
}

export const sendGmailMessage = async ({ to, subject, bodyText }: SendEmailPayload) => {
  // Construct raw RFC 2822 email format
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText
  ];
  const rawMessage = messageParts.join('\r\n');
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return await googleApiFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    body: JSON.stringify({
      raw: encodedMessage
    })
  });
};

export const listRecentGmailThreads = async () => {
  const res = await googleApiFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8');
  return res.messages || [];
};

// ---------------- Google Calendar API ----------------
export interface CalendarEventPayload {
  summary: string;
  description: string;
  location?: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
}

export const listCalendarEvents = async () => {
  const now = new Date().toISOString();
  const res = await googleApiFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=10&singleEvents=true&orderBy=startTime`
  );
  return res.items || [];
};

export const createCalendarJobEvent = async (event: CalendarEventPayload) => {
  return await googleApiFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify({
      summary: event.summary,
      description: event.description,
      location: event.location || 'Boise, ID',
      start: {
        dateTime: event.startDateTime,
        timeZone: 'America/Boise'
      },
      end: {
        dateTime: event.endDateTime,
        timeZone: 'America/Boise'
      }
    })
  });
};

// ---------------- Google Tasks API ----------------
export interface GoogleTaskItem {
  id?: string;
  title: string;
  notes?: string;
  due?: string;
  status?: 'needsAction' | 'completed';
}

export const listGoogleTasks = async (): Promise<GoogleTaskItem[]> => {
  const listsRes = await googleApiFetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists');
  const defaultList = listsRes.items?.[0]?.id || '@default';
  const tasksRes = await googleApiFetch(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList}/tasks?maxResults=15`);
  return tasksRes.items || [];
};

export const createGoogleTask = async (task: { title: string; notes?: string; due?: string }) => {
  return await googleApiFetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: task.title,
      notes: task.notes,
      due: task.due
    })
  });
};

export const completeGoogleTask = async (taskId: string) => {
  return await googleApiFetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'completed'
    })
  });
};

// ---------------- Google Forms API ----------------
export const createClientIntakeForm = async (title: string) => {
  return await googleApiFetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    body: JSON.stringify({
      info: {
        title: `208 Fence & Gate - ${title}`,
        documentTitle: title
      }
    })
  });
};

// ---------------- Google Picker API ----------------
export const loadAndOpenGooglePicker = (onPick: (doc: any) => void) => {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('Please connect your Google Account first to open Google Picker.');
  }

  const gapi = (window as any).gapi;
  if (!gapi) {
    throw new Error('Google API script is not loaded yet.');
  }

  gapi.load('picker', {
    callback: () => {
      const google = (window as any).google;
      if (!google?.picker) {
        throw new Error('Google Picker library failed to initialize.');
      }

      const view = new google.picker.View(google.picker.ViewId.DOCS);
      view.setMimeTypes('image/png,image/jpeg,application/pdf,image/webp');

      const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(CLIENT_ID.split('-')[0])
        .setOAuthToken(token)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setDeveloperKey(API_KEY)
        .setCallback((data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            const documents = data[google.picker.Response.DOCUMENTS];
            if (documents && documents.length > 0) {
              onPick(documents[0]);
            }
          }
        })
        .build();

      picker.setVisible(true);
    }
  });
};

// ---------------- Google Drive Project Photos Query ----------------
export interface DriveImageFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  createdTime?: string;
}

export const listDriveProjectImages = async (): Promise<DriveImageFile[]> => {
  try {
    const q = "mimeType contains 'image/' and trashed = false";
    const res = await googleApiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,createdTime)&pageSize=20`
    );
    return res.files || [];
  } catch (error) {
    console.warn('Google Drive project image fetch notice:', error);
    return [];
  }
};

// ---------------- Google Docs API ----------------
export interface DocEstimateData {
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  projectAddress?: string;
  material: string;
  linearFootage: number;
  postType?: string;
  heightFeet?: number;
  subtotal: number;
  totalCost: number;
  warrantyYears?: number;
  notes?: string;
}

export const createFenceEstimateDoc = async (data: DocEstimateData): Promise<{ documentId: string; documentUrl: string }> => {
  // 1. Create a blank Google Document
  const doc = await googleApiFetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    body: JSON.stringify({
      title: `208 Fence & Gate Proposal - ${data.clientName || 'Client Project'}`
    })
  });

  const documentId = doc.documentId;
  const todayStr = new Date().toLocaleDateString('en-US', { dateStyle: 'long' });

  // 2. Format comprehensive contractor proposal text
  const docBody = `208 FENCE AND GATE LLC
LICENSED IDAHO RESIDENTIAL CONTRACTOR & SOFTWARE LAB
(208) 358-9077 • admin@208fenceandgate.com
Boise, Meridian, Eagle, Nampa, Caldwell, Idaho

============================================================
FORMAL RESIDENTIAL PROJECT ESTIMATE & SPECIFICATIONS
============================================================

Date Generated: ${todayStr}
Document ID: DOC-208-${documentId.slice(0, 8).toUpperCase()}
Client Name: ${data.clientName || 'Valued Idaho Client'}
Client Contact: ${data.clientEmail || 'On file'} | ${data.clientPhone || '(208) Area'}
Project Site Location: ${data.projectAddress || 'Treasure Valley, Idaho'}

------------------------------------------------------------
1. PROJECT SPECIFICATIONS & SCOPE OF WORK
------------------------------------------------------------
• Perimeter Material: ${data.material}
• Total Linear Footage: ${data.linearFootage} Linear Feet
• Height: ${data.heightFeet || 6} Feet Standard Privacy
• Structural Post System: ${data.postType || 'PostMaster Commercial Steel (85+ MPH Wind Rating)'}
• Concrete Footings: 36"+ Idaho frost depth with high-strength PSI mix
• Rot-Board Protection: Included on all ground-contact pickets
• Workmanship Warranty: ${data.warrantyYears || 5}-Year Full Craftsmanship Guarantee

------------------------------------------------------------
2. BILL OF MATERIALS & LAB PRICING SUMMARY
------------------------------------------------------------
Subtotal Materials & Fabrication: $${(data.subtotal || data.totalCost * 0.6).toLocaleString()}
Labor, Post Setting & Framing: $${(data.totalCost * 0.4).toLocaleString()}
Total Estimated Investment: $${data.totalCost.toLocaleString()}
Estimated Monthly Financing (60 Mo @ 7.9%): $${Math.round(data.totalCost * 0.021).toLocaleString()}/mo

------------------------------------------------------------
3. DIGITAL VERIFICATION & WORKFLOW
------------------------------------------------------------
This document is synchronized in real-time with 208 Fence & Gate's cloud CAD and Google Workspace ERP infrastructure.

Notes: ${data.notes || 'Includes full site cleanup, 811 underground utility locates, and old fence haul-away.'}

Approved By:
_____________________________           _____________________________
208 Fence & Gate LLC Estimator          Client Acceptance / Signature
`;

  // 3. Insert content into the document
  await googleApiFetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: docBody
          }
        }
      ]
    })
  });

  return {
    documentId,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`
  };
};

export const listGoogleDocs = async (): Promise<DriveFileItem[]> => {
  try {
    const q = "mimeType = 'application/vnd.google-apps.document' and trashed = false";
    const res = await googleApiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,webViewLink,iconLink,createdTime)&pageSize=25&orderBy=createdTime desc`
    );
    return res.files || [];
  } catch (err) {
    console.warn('Google Docs list query warning:', err);
    return [];
  }
};

export const deleteGoogleDoc = async (documentId: string): Promise<boolean> => {
  try {
    await googleApiFetch(`https://www.googleapis.com/drive/v3/files/${documentId}`, {
      method: 'DELETE'
    });
    return true;
  } catch (err) {
    console.error('Failed to delete Google Doc:', err);
    throw err;
  }
};

export const exportFenceDetailsToGoogleDoc = async (
  estimate: {
    customerName: string;
    email: string;
    phone?: string;
    address: string;
    city?: string;
    zipCode?: string;
    fenceType: string;
    linearFeet: number;
    heightFeet?: number;
    postType?: string;
    materialsCost: number;
    laborCost: number;
    tearOutCost?: number;
    gatesCost?: number;
    addonsCost?: number;
    tax?: number;
    totalCost: number;
    monthlyFinancingPayment?: number;
    bom?: any;
    notes?: string;
  }
): Promise<{ documentId: string; documentUrl: string }> => {
  const todayStr = new Date().toLocaleDateString('en-US', { dateStyle: 'full' });
  const title = `208 Fence & Gate Proposal - ${estimate.customerName || 'Client Project'}`;

  // 1. Create the blank document in Drive via Docs API
  const doc = await googleApiFetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    body: JSON.stringify({ title })
  });

  const documentId = doc.documentId;

  // 2. Build itemized bill of materials lines if available
  let bomSummaryText = '';
  if (estimate.bom) {
    bomSummaryText = `
------------------------------------------------------------
ITEMIZED BILL OF MATERIALS (BOM) & SPECIFICATIONS
------------------------------------------------------------
• Structural Posts: ${estimate.bom.totalPostCount || Math.ceil(estimate.linearFeet / 8) + 1} Posts (Set 36" in 4,000 PSI High-Strength Concrete)
• Framing Rails: ${estimate.bom.railCount || Math.ceil(estimate.linearFeet / 8) * 3} Structural 2x4 Rails
• Privacy Pickets: ${estimate.bom.picketCount || Math.ceil(estimate.linearFeet * 2.2)} Premium Grade Pickets (5.5" Width)
• Fasteners & Hardware: ${estimate.bom.fastenersCountLbs || 25} lbs Corrosion-Resistant Ring-Shank Nails
• Concrete Footings: ${estimate.bom.concreteBagsCount || (estimate.bom.totalPostCount || 20) * 2} Bags (60lb High-PSI Mix)`;
  }

  const docBody = `208 FENCE AND GATE LLC
============================================================
LICENSED IDAHO RESIDENTIAL CONTRACTOR & SOFTWARE LAB
(208) 358-9077 • admin@208fenceandgate.com • Boise, ID
============================================================

FORMAL CONTRACTOR PROJECT BID & CRAFTSMANSHIP AGREEMENT
Date: ${todayStr}
Document Reference: DOC-208-${documentId.slice(0, 8).toUpperCase()}

CLIENT & PROPERTY DETAILS:
Client Name: ${estimate.customerName || 'Valued Client'}
Contact Email: ${estimate.email || 'On file'}
Phone Number: ${estimate.phone || '(208) Area'}
Project Location: ${estimate.address || ''}${estimate.city ? `, ${estimate.city}` : ''}${estimate.zipCode ? ` ${estimate.zipCode}` : ', Idaho'}

------------------------------------------------------------
PROJECT SCOPE OF WORK & ENGINEERING STANDARDS
------------------------------------------------------------
• Perimeter Discipline: ${estimate.fenceType}
• Total Linear Footage: ${estimate.linearFeet} Linear Feet (${estimate.heightFeet || 6}ft Height)
• Post System Standard: ${estimate.postType || 'PostMaster Structural Steel (85+ MPH Wind Tested)'}
• Frost Depth Standard: 36" deep structural concrete piers below Idaho frost line
• Utility Verification: 811 DigLine underground utilities called & located
• Craftsmanship Guarantee: 10-Year Workmanship Warranty on all structural framing & post alignments
${bomSummaryText}

------------------------------------------------------------
INVESTMENT BREAKDOWN & FINANCING SCHEDULE
------------------------------------------------------------
Materials, Posts, Lumber & Fasteners: $${estimate.materialsCost.toLocaleString()}
Labor, Post Setting, Digging & Alignment: $${estimate.laborCost.toLocaleString()}${estimate.tearOutCost ? `\nDemolition & Old Fence Haul-Away: $${estimate.tearOutCost.toLocaleString()}` : ''}${estimate.gatesCost ? `\nCustom Gate Hardware & Operators: $${estimate.gatesCost.toLocaleString()}` : ''}${estimate.addonsCost ? `\nRot-Board Base Protection & Enhancements: $${estimate.addonsCost.toLocaleString()}` : ''}${estimate.tax ? `\nIdaho State Sales Tax (6%): $${estimate.tax.toLocaleString()}` : ''}

TOTAL PROJECT CONTRACT INVESTMENT: $${estimate.totalCost.toLocaleString()}
${estimate.monthlyFinancingPayment ? `Low Monthly Financing Option: $${estimate.monthlyFinancingPayment}/month ($0 Down, 84 Mo @ 7.99% APR)` : ''}

Project Notes:
${estimate.notes || 'All work conforms to local municipal codes, HOA requirements, and manufacturer specifications.'}

------------------------------------------------------------
AUTHORIZATION & CLIENT ACCEPTANCE
------------------------------------------------------------
By signing below, the client agrees to the scope of work, specifications, and payment terms outlined in this proposal.

Client Signature: ___________________________  Date: ________________

208 Contractor Rep: _________________________  Date: ________________

Saved in Google Drive • Managed via 208 Fence & Gate LLC Cloud ERP
`;

  // 3. Populate document with formatted text
  await googleApiFetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: docBody
          }
        }
      ]
    })
  });

  return {
    documentId,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`
  };
};

// ---------------- Google People / Contacts & Organization API ----------------
export interface GoogleContactItem {
  resourceName?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  organization?: string;
  jobTitle?: string;
  photoUrl?: string;
}

export const getGoogleUserProfile = async (): Promise<WorkspaceUser & { org?: string; title?: string }> => {
  try {
    const userInfo = await googleApiFetch('https://www.googleapis.com/oauth2/v3/userinfo');
    return {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
  } catch (err) {
    console.warn('User info fetch error:', err);
    return {};
  }
};

// ---------------- Centralized Google Sheets Quote & Inventory Log ----------------
export interface CentralQuoteLogPayload {
  quoteId: string;
  customerName: string;
  email: string;
  phone?: string;
  address: string;
  city?: string;
  zipCode?: string;
  fenceType: string;
  linearFeet: number;
  heightFeet?: number;
  postType?: string;
  materialsCost: number;
  laborCost: number;
  gatesCost?: number;
  tax?: number;
  totalCost: number;
  monthlyFinancingPayment?: number;
  status?: string;
  notes?: string;
}

const CENTRAL_SPREADSHEET_NAME = '208 Fence & Gate - Project Estimates & Inventory Log';

export const logQuoteToCentralSheets = async (quote: CentralQuoteLogPayload): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  // 1. Check if the centralized spreadsheet exists in Drive
  let spreadsheetId: string | null = null;
  try {
    const q = `mimeType = 'application/vnd.google-apps.spreadsheet' and name = '${CENTRAL_SPREADSHEET_NAME}' and trashed = false`;
    const searchRes = await googleApiFetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)`
    );

    if (searchRes.files && searchRes.files.length > 0) {
      spreadsheetId = searchRes.files[0].id;
    }
  } catch (err) {
    console.warn('Could not search for existing central spreadsheet:', err);
  }

  const todayStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

  // 2. If it does not exist, create a new spreadsheet with structured headers
  if (!spreadsheetId) {
    const createdSheet = await googleApiFetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          title: CENTRAL_SPREADSHEET_NAME
        },
        sheets: [
          {
            properties: {
              title: 'Estimates Log',
              gridProperties: {
                frozenRowCount: 1
              }
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Quote ID' } },
                      { userEnteredValue: { stringValue: 'Date / Time' } },
                      { userEnteredValue: { stringValue: 'Customer Name' } },
                      { userEnteredValue: { stringValue: 'Email' } },
                      { userEnteredValue: { stringValue: 'Phone' } },
                      { userEnteredValue: { stringValue: 'Project Address' } },
                      { userEnteredValue: { stringValue: 'City / Region' } },
                      { userEnteredValue: { stringValue: 'Fence Style' } },
                      { userEnteredValue: { stringValue: 'Linear Footage' } },
                      { userEnteredValue: { stringValue: 'Height (ft)' } },
                      { userEnteredValue: { stringValue: 'Post System' } },
                      { userEnteredValue: { stringValue: 'Materials ($)' } },
                      { userEnteredValue: { stringValue: 'Labor ($)' } },
                      { userEnteredValue: { stringValue: 'Gates ($)' } },
                      { userEnteredValue: { stringValue: 'Tax ($)' } },
                      { userEnteredValue: { stringValue: 'Total Contract ($)' } },
                      { userEnteredValue: { stringValue: 'Monthly Fin ($)' } },
                      { userEnteredValue: { stringValue: 'Pipeline Status' } },
                      { userEnteredValue: { stringValue: 'Project Notes' } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
    });
    spreadsheetId = createdSheet.spreadsheetId;
  }

  // 3. Append the new quote row to 'Estimates Log' sheet
  const newRowValues = [
    quote.quoteId,
    todayStr,
    quote.customerName || 'Valued Client',
    quote.email || '',
    quote.phone || '',
    quote.address || '',
    `${quote.city || 'Boise'}, ID ${quote.zipCode || ''}`,
    quote.fenceType,
    quote.linearFeet,
    quote.heightFeet || 6,
    quote.postType || 'POSTMASTER',
    quote.materialsCost,
    quote.laborCost,
    quote.gatesCost || 0,
    quote.tax || 0,
    quote.totalCost,
    quote.monthlyFinancingPayment || Math.round(quote.totalCost * 0.021),
    quote.status || 'NEW_LEAD',
    quote.notes || 'Generated from 208 CAD Estimator'
  ];

  await googleApiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Estimates Log!A:S:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      body: JSON.stringify({
        values: [newRowValues]
      })
    }
  );

  return {
    spreadsheetId: spreadsheetId!,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
};

export const createGoogleContact = async (lead: {
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  fenceType: string;
  linearFeet: number;
  totalCost: number;
  quoteId: string;
}): Promise<any> => {
  const parts = (lead.customerName || 'Client Lead').trim().split(/\s+/);
  const givenName = parts[0] || 'Client';
  const familyName = parts.slice(1).join(' ') || '';

  const contactPayload = {
    names: [
      {
        givenName,
        familyName
      }
    ],
    emailAddresses: lead.email ? [
      {
        value: lead.email,
        type: 'work'
      }
    ] : [],
    phoneNumbers: lead.phone ? [
      {
        value: lead.phone,
        type: 'mobile'
      }
    ] : [],
    addresses: lead.address ? [
      {
        streetAddress: lead.address,
        city: lead.city || 'Boise',
        region: 'ID',
        postalCode: lead.zipCode || '83702',
        type: 'work'
      }
    ] : [],
    organizations: [
      {
        name: '208 Fence & Gate Lead',
        title: `${lead.fenceType} (${lead.linearFeet} LF) - $${lead.totalCost.toLocaleString()}`
      }
    ],
    biographies: [
      {
        value: `208 Fence Quote ID: ${lead.quoteId} | Material: ${lead.fenceType} | ${lead.linearFeet} LF | Total: $${lead.totalCost.toLocaleString()}`
      }
    ],
    userDefined: [
      {
        key: 'QuoteId',
        value: lead.quoteId
      },
      {
        key: 'LeadSource',
        value: '208 CAD Fence Estimator'
      }
    ]
  };

  return await googleApiFetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    body: JSON.stringify(contactPayload)
  });
};

export const getGoogleContacts = async (pageSize = 30): Promise<GoogleContactItem[]> => {
  try {
    const res = await googleApiFetch(
      `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations,occupations,photos&pageSize=${pageSize}`
    );
    const connections = res.connections || [];
    return connections.map((person: any) => {
      const name = person.names?.[0]?.displayName || 'Unnamed Contact';
      const email = person.emailAddresses?.[0]?.value || '';
      const phoneNumber = person.phoneNumbers?.[0]?.value || '';
      const organization = person.organizations?.[0]?.name || '';
      const jobTitle = person.organizations?.[0]?.title || person.occupations?.[0]?.value || '';
      const photoUrl = person.photos?.[0]?.url || '';
      return {
        resourceName: person.resourceName,
        name,
        email,
        phoneNumber,
        organization,
        jobTitle,
        photoUrl
      };
    });
  } catch (err) {
    console.warn('Google Contacts query notice (graceful fallback):', err);
    return [];
  }
};

// ---------------- Google Photos API ----------------
export interface GooglePhotoItem {
  id: string;
  baseUrl: string;
  filename: string;
  mimeType: string;
  mediaMetadata?: {
    creationTime?: string;
    width?: string;
    height?: string;
  };
}

export const listGooglePhotosMedia = async (pageSize = 20): Promise<GooglePhotoItem[]> => {
  try {
    const res = await googleApiFetch(
      `https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=${pageSize}`
    );
    return res.mediaItems || [];
  } catch (error) {
    console.warn('Google Photos API query notice (falling back gracefully):', error);
    return [];
  }
};
