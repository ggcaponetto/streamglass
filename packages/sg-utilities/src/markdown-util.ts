import * as fs from 'fs'
import * as path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { fileURLToPath } from 'url'

const initCwd = process.env.INIT_CWD
const cwd = process.cwd()
const rootCwd = initCwd || cwd

/**
 * Shifts all markdown headings in the content by a specified level.
 * @param content - Markdown string content.
 * @param shift - Number of levels to shift headings.
 * @returns Modified markdown content.
 */
export function shiftHeadings(content: string, shift: number): string {
    const lines = content.split('\n')
    return lines
        .map((line) => {
            const match = line.match(/^(#+)(\s.*)/)
            if (match) {
                const hashes = match[1]
                const text = match[2]
                const newHashes = '#'.repeat(Math.min(hashes.length + shift, 6))
                return `${newHashes}${text}`
            }
            return line
        })
        .join('\n')
}

/**
 * Concatenates multiple markdown files and shifts headings.
 * @param inputFiles - Array of file paths to markdown files.
 * @param outputFile - Output file path.
 * @param headingShift - Number of levels to shift headings.
 */
export function concatenateMarkdownFiles(
    inputFiles: string[],
    outputFile: string,
    headingShift: number
): void {
    let concatenatedContent = ''

    inputFiles.forEach((filePath, index) => {
        const absolutePath = path.resolve(rootCwd, filePath)
        const content = fs.readFileSync(absolutePath, 'utf-8')
        if (index === 0) {
            concatenatedContent +=
                `\n\n<!-- Source: ${filePath} -->\n\n` + content
        } else {
            const shiftedContent = shiftHeadings(content, headingShift)
            concatenatedContent +=
                `\n\n<!-- Source: ${filePath} -->\n\n` + shiftedContent
        }
    })

    const outputPath = path.resolve(rootCwd, outputFile)
    fs.writeFileSync(outputPath, concatenatedContent.trim())
    console.log(`Successfully written to ${outputPath}`)
}

// Define types for yargs
interface Args {
    input: string[]
    output: string
    shift: number
}

export function runCli() {
    const argv = yargs(hideBin(process.argv))
        .scriptName('md-concat')
        .usage('$0 -i <files...> -o <output> [-s <shift>]')
        .option('input', {
            alias: 'i',
            describe: 'Input markdown files',
            type: 'array',
            string: true,
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
        .parseSync() as unknown as Args // Yargs doesn't infer array item types well, so we cast to Args

    const inputFiles: string[] = argv.input
    const outputFile: string = argv.output
    const headingShift: number = argv.shift

    concatenateMarkdownFiles(inputFiles, outputFile, headingShift)
}

const __filename = fileURLToPath(import.meta.url)
const isRunningDirectly = process.argv[1] === __filename

if (isRunningDirectly) {
    runCli()
}
