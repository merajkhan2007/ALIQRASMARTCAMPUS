/**
 * Script to wrap Urdu text portions in bilingual labels with <span className="urdu">
 * Pattern: "اردو / English" → "<span className='urdu'>اردو</span> / English"
 * 
 * Run: node scripts/apply-urdu-font.js
 */

const fs = require('fs');
const path = require('path');

// Files to process
const files = [
  'src/components/admin/ReviewAdmissionModal.tsx',
  'src/app/dashboard/admin/admissions/page.tsx',
  'src/app/dashboard/admin/students/enroll/page.tsx',
  'src/app/dashboard/admin/donations/page.tsx',
];

/**
 * Regex to match Urdu text followed by " / English text"
 * Urdu Unicode range: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement), \uFB50-\uFDFF (Arabic Presentation Forms-A)
 * Also matches Urdu punctuation: ، ؟ ۔
 */
const URDU_PATTERN = /([\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF][\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s،؟۔\)\u0028\u0029\u003A0-9%#\-+]*?)\s*\/\s*/g;

function processLine(line) {
  // Check if line contains Urdu characters
  if (!/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF]/.test(line)) {
    return line;
  }

  // Already wrapped? Skip
  if (line.includes("className='urdu'") || line.includes('className="urdu"')) {
    return line;
  }

  // Pattern: Urdu text followed by " / " and then English text
  // We need to find the Urdu portion before " / "
  
  let result = line;
  
  // Match: Urdu text / English text pattern
  // The Urdu text can contain spaces, commas, question marks, parentheses, etc.
  const regex = /([\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF][\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s،؟۔\)\u0028\u0029\u003A0-9%#\-+]*?)\s*\/\s+(?=[A-Za-z0-9"'(])/g;
  
  result = result.replace(regex, (match, urduPart) => {
    const trimmedUrdu = urduPart.trim();
    // Don't wrap if it's just a single character or number
    if (trimmedUrdu.length < 2) return match;
    
    const before = match.substring(0, match.indexOf(urduPart));
    const after = match.substring(match.indexOf(urduPart) + urduPart.length);
    
    return before + "<span className='urdu'>" + trimmedUrdu + "</span>" + after;
  });

  return result;
}

function processFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  console.log(`Processing: ${filePath}`);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');
  
  let modified = false;
  const processedLines = lines.map((line, idx) => {
    const processed = processLine(line);
    if (processed !== line) {
      modified = true;
      console.log(`  Line ${idx + 1}: modified`);
    }
    return processed;
  });

  if (modified) {
    fs.writeFileSync(fullPath, processedLines.join('\n'), 'utf-8');
    console.log(`  ✓ Updated: ${filePath}`);
  } else {
    console.log(`  - No changes needed`);
  }
}

console.log('Applying Urdu font wrappers...\n');

files.forEach(file => {
  processFile(file);
});

console.log('\nDone!');