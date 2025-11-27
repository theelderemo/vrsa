/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Export utilities for conversation history
 */

/**
 * Export conversation as plain text file
 * @param {Array} messages - Array of message objects {role, content}
 * @param {Object} metadata - Optional metadata (sessionId, editHistory, etc.)
 */
export function exportConversationAsTxt(messages, metadata = {}) {
  let textContent = '=== VRS/A Conversation Export ===\n\n';
  
  if (metadata.exportedAt) {
    textContent += `Exported: ${new Date(metadata.exportedAt).toLocaleString()}\n`;
  }
  if (metadata.sessionId) {
    textContent += `Session ID: ${metadata.sessionId}\n`;
  }
  textContent += '\n' + '='.repeat(50) + '\n\n';
  
  messages.forEach((msg) => {
    const role = msg.role === 'assistant' ? 'VRS/A' : msg.role === 'user' ? 'You' : 'System';
    textContent += `[${role}]\n`;
    textContent += `${msg.content}\n\n`;
    textContent += '-'.repeat(50) + '\n\n';
  });
  
  if (metadata.editHistory && metadata.editHistory.length > 0) {
    textContent += '\n=== Edit History ===\n\n';
    metadata.editHistory.forEach((edit, index) => {
      textContent += `Edit ${index + 1}:\n`;
      textContent += `  Line: ${edit.lineNumber}\n`;
      textContent += `  Time: ${new Date(edit.timestamp).toLocaleString()}\n`;
      textContent += '\n';
    });
  }
  
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vrsa-conversation-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export conversation as PDF file (using browser's print to PDF functionality)
 * @param {Array} messages - Array of message objects {role, content}
 * @param {Object} metadata - Optional metadata (sessionId, editHistory, etc.)
 */
export function exportConversationAsPdf(messages, metadata = {}) {
  // Create a new window with formatted content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to export as PDF');
    return;
  }
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>VRS/A Conversation Export</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #333;
          line-height: 1.6;
        }
        h1 {
          color: #6366f1;
          border-bottom: 3px solid #6366f1;
          padding-bottom: 10px;
        }
        .metadata {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 0.9em;
        }
        .message {
          margin: 25px 0;
          padding: 15px;
          border-left: 4px solid #e5e7eb;
        }
        .message.assistant {
          background: #f9fafb;
          border-left-color: #6366f1;
        }
        .message.user {
          background: #fefefe;
          border-left-color: #10b981;
        }
        .role {
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-size: 0.85em;
          letter-spacing: 0.5px;
        }
        .role.assistant { color: #6366f1; }
        .role.user { color: #10b981; }
        .content {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .edit-history {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }
        .edit-item {
          margin: 10px 0;
          padding: 10px;
          background: #fef3c7;
          border-radius: 4px;
          font-size: 0.85em;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>VRS/A Conversation Export</h1>
      <div class="metadata">
        ${metadata.exportedAt ? `<div><strong>Exported:</strong> ${new Date(metadata.exportedAt).toLocaleString()}</div>` : ''}
        ${metadata.sessionId ? `<div><strong>Session ID:</strong> ${metadata.sessionId}</div>` : ''}
        ${metadata.memoryEnabled !== undefined ? `<div><strong>Memory Mode:</strong> ${metadata.memoryEnabled ? 'Enabled' : 'Disabled'}</div>` : ''}
      </div>
  `;
  
  messages.forEach((msg) => {
    const role = msg.role === 'assistant' ? 'VRS/A' : msg.role === 'user' ? 'You' : 'System';
    const roleClass = msg.role === 'assistant' ? 'assistant' : 'user';
    htmlContent += `
      <div class="message ${roleClass}">
        <div class="role ${roleClass}">${role}</div>
        <div class="content">${escapeHtml(msg.content)}</div>
      </div>
    `;
  });
  
  if (metadata.editHistory && metadata.editHistory.length > 0) {
    htmlContent += `
      <div class="edit-history">
        <h2>Edit History</h2>
    `;
    metadata.editHistory.forEach((edit, index) => {
      htmlContent += `
        <div class="edit-item">
          <strong>Edit ${index + 1}:</strong> Line ${edit.lineNumber} at ${new Date(edit.timestamp).toLocaleString()}
        </div>
      `;
    });
    htmlContent += `</div>`;
  }
  
  htmlContent += `
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print dialog
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

/**
 * Export conversation as JSON (existing format)
 * @param {Array} messages - Array of message objects {role, content}
 * @param {Object} metadata - Optional metadata (sessionId, editHistory, etc.)
 */
export function exportConversationAsJson(messages, metadata = {}) {
  const exportData = {
    ...metadata,
    messages,
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vrsa-conversation-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Helper function to escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
