'use strict';
importScripts('./vendor/mammoth/mammoth.browser.min.js');
self.onmessage = async event => {
 try {
  const result = await mammoth.extractRawText({arrayBuffer: event.data});
  if (result.value.length > 100000) throw new Error('DOCUMENT_TEXT_LIMIT');
  self.postMessage({text: result.value, warnings: result.messages.length});
 } catch (error) {
  self.postMessage({error: error.message === 'DOCUMENT_TEXT_LIMIT' ? error.message : 'DOCX_INVALID'});
 }
};
