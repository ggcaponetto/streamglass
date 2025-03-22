import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * Shifts all markdown headings in the content by a specified level.
 * @param content - Markdown string content.
 * @param shift - Number of levels to shift headings.
 * @returns Modified markdown content.
 */
export function shiftHeadings(content: string, shift: number): string {
  const lines = content.split('\n');
  return lines
    .map((line) => {
      const match = line.match(/^(#+)(\s.*)/);
      if (match) {
        const hashes = match[1];
        const text = match[2];
        const newHashes = '#'.repeat(Math.min(hashes.length + shift, 6));
        return `${newHashes}${text}`;
      }
      return line;
    })
    .join('\n');
}

/**
 * Concatenates multiple markdown files and shifts headings.
 * @param inputFiles - Array of file paths to markdown files.
 * @param outputFile - Output file path.
 * @param headingShift - Number of levels to shift headings.
 */
export function concatenateMarkdownFiles(inputFiles: string[], outputFile: string, headingShift: number): void {
  let concatenatedContent = '';

  inputFiles.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    const shiftedContent = shiftHeadings(content, headingShift);
    concatenatedContent += `\n\n<!-- Source: ${filePath} -->\n\n` + shiftedContent;
  });

  const outputPath = path.resolve(process.cwd(), outputFile);
  fs.writeFileSync(outputPath, concatenatedContent.trim());
  console.log(`Successfully written to ${outputPath}`);
}

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .scriptName('md-concat')
    .usage('$0 -i <files...> -o <output> [-s <shift>]')
    .option('input', {
      alias: 'i',
      describe: 'Input markdown files',
      type: 'array',
      demandOption: true,
    })
    .option('output', {
      alias: 'o',
      describe: 'Output file path',
      type: 'string',
      demandOption: true,
    })
    .option('shift', {
      alias: 's',
      describe: 'Heading shift level',
      type: 'number',
      default: 1,
    })
    .help()
    .argv as any;

  const inputFiles: string[] = argv.input;
  const outputFile: string = argv.output;
  const headingShift: number = argv.shift;

  concatenateMarkdownFiles(inputFiles, outputFile, headingShift);
}
