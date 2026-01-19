
import { GeneratedQuestion } from '../types';

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateAiken = (questions: GeneratedQuestion[]): string => {
  return questions.map((q) => {
    // Aiken format requires the question to be on a single line (mostly), 
    // though some parsers support multiline. We'll play it safe.
    // Replace <br> tags with spaces if they exist
    const cleanQuestion = q.questionText.replace(/<br\s*\/?>/gi, ' ').replace(/\n/g, ' ').trim();
    
    const options = q.options.map((opt, i) => {
      const letter = String.fromCharCode(65 + i);
      const cleanOpt = opt.replace(/<br\s*\/?>/gi, ' ').trim();
      return `${letter}) ${cleanOpt}`;
    }).join('\n');
    
    const correctLetter = String.fromCharCode(65 + q.correctAnswerIndex);
    
    return `${cleanQuestion}\n${options}\nANSWER: ${correctLetter}`;
  }).join('\n\n');
};

export const generateGIFT = (questions: GeneratedQuestion[]): string => {
  const escapeGIFT = (text: string) => {
    // Remove <br> tags, replacing with newlines first, then escape special chars
    const noTags = text.replace(/<br\s*\/?>/gi, '\n');
    // Escape characters special to GIFT: ~ = # { } :
    return noTags.replace(/[~=#{}:]/g, '\\$&');
  };

  return questions.map((q, index) => {
    const title = `::Q${index + 1} ${q.topicTag}::`;
    const cleanQuestion = escapeGIFT(q.questionText);
    
    const options = q.options.map((opt, i) => {
      const prefix = i === q.correctAnswerIndex ? '=' : '~';
      return `\t${prefix}${escapeGIFT(opt)}`;
    }).join('\n');

    // Add explanation as feedback using the general feedback syntax ####
    const explanation = q.explanation ? `\n\t#### ${escapeGIFT(q.explanation)}` : '';

    return `${title} ${cleanQuestion} {\n${options}${explanation}\n}`;
  }).join('\n\n');
};

export const generateWord = (questions: GeneratedQuestion[]): string => {
  const content = questions.map((q, i) => {
    // Convert newlines to <br/> for HTML export
    const questionHtml = q.questionText
      .replace(/<br\s*\/?>/gi, '\n') // normalize first
      .replace(/\n/g, '<br/>'); // convert to HTML break
    
    const explanationHtml = q.explanation
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/\n/g, '<br/>');

    return `
    <div class="question-block">
      <p class="question-text"><strong>Q${i + 1}. ${questionHtml}</strong></p>
      <ul class="options-list">
        ${q.options.map((opt, optIndex) => {
           const letter = String.fromCharCode(65 + optIndex);
           const isCorrect = optIndex === q.correctAnswerIndex;
           // Highlight correct answer for the teacher's copy
           const style = isCorrect ? 'color: #166534; font-weight: bold;' : '';
           const check = isCorrect ? ' (Correct)' : '';
           const optHtml = opt.replace(/<br\s*\/?>/gi, ' ');
           return `<li style="${style}">${letter}. ${optHtml}${check}</li>`;
        }).join('')}
      </ul>
      <div class="explanation">
        <p><strong>Explanation:</strong> ${explanationHtml}</p>
        <p style="font-size: 0.85em; color: #666;">
          <em>Topic: ${q.topicTag} | Bloom: ${q.bloomLevel} | Angoff: ${q.predictedAngoff}%</em>
        </p>
      </div>
    </div>
    <hr/>
  `}).join('');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>MCQ Export</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1e293b; }
          .question-block { margin-bottom: 24px; page-break-inside: avoid; }
          .question-text { font-size: 1.1em; margin-bottom: 12px; }
          .options-list { list-style-type: none; padding-left: 0; }
          .options-list li { margin-bottom: 6px; padding-left: 12px; }
          .explanation { background-color: #f8fafc; padding: 12px; border-left: 4px solid #3b82f6; margin-top: 12px; }
          hr { border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0; }
        </style>
      </head>
      <body>
        <h1 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Generated MCQs</h1>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        ${content}
      </body>
    </html>
  `;
};
