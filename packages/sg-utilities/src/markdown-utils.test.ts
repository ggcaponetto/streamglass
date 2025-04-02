import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { shiftHeadings, concatenateMarkdownFiles } from './markdown-util.js';

vi.mock('fs');

describe('shiftHeadings', () => {
    it('shifts headings by the specified amount', () => {
        const markdown = `# Title\n## Subtitle\nSome paragraph\n### Sub-subtitle`;
        const expected = `## Title\n### Subtitle\nSome paragraph\n#### Sub-subtitle`;

        const result = shiftHeadings(markdown, 1);
        expect(result).toBe(expected);
    });

    it('caps heading level at 6', () => {
        const markdown = `##### Heading 5\n###### Heading 6`;
        const expected = `###### Heading 5\n###### Heading 6`; // max at 6

        const result = shiftHeadings(markdown, 2);
        expect(result).toBe(expected);
    });
});

describe('concatenateMarkdownFiles', () => {
    const mockReadFileSync = fs.readFileSync as unknown as ReturnType<
        typeof vi.fn
    >;
    const mockWriteFileSync = fs.writeFileSync as unknown as ReturnType<
        typeof vi.fn
    >;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('concatenates multiple markdown files with heading shift', () => {
        const inputFiles = ['file1.md', 'file2.md'];
        const outputFile = 'output.md';
        const headingShift = 1;

        mockReadFileSync.mockImplementation((filePath: string) => {
            if (filePath.includes('file1.md')) {
                return '# File 1 Title\nContent of file 1';
            } else if (filePath.includes('file2.md')) {
                return '## File 2 Title\nContent of file 2';
            }
        });

        // The official docs state that we can disable this rule in testing frameworks
        // that expect funcitions even if the do nothing.

        mockWriteFileSync.mockImplementation(() => {});

        concatenateMarkdownFiles(inputFiles, outputFile, headingShift);

        const expectedOutput = `
<!-- Source: file1.md -->

# File 1 Title
Content of file 1

<!-- Source: file2.md -->

### File 2 Title
Content of file 2`.trim();

        expect(mockWriteFileSync).toHaveBeenCalledWith(
            path.resolve(process.env.INIT_CWD || process.cwd(), outputFile),
            expectedOutput
        );
    });
});

describe('runCli', () => {
    let mockReadFileSync: ReturnType<typeof vi.fn>;
    let mockWriteFileSync: ReturnType<typeof vi.fn>;
    let mockExit: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        // Reset all mocks/modules
        vi.resetModules();
        vi.clearAllMocks();

        // Mock yargs/helpers
        vi.doMock('yargs/helpers', () => ({
            hideBin: () => [
                'node',
                'script.js',
                '-i',
                'file1.md',
                'file2.md',
                '-o',
                'output.md',
                '-s',
                '1',
            ],
        }));

        // Mock fs
        mockReadFileSync = vi.fn((filePath: string) => {
            if (filePath.includes('file1.md')) {
                return '# File 1 Title\nContent of file 1';
            } else {
                return '## File 2 Title\nContent of file 2';
            }
        });

        mockWriteFileSync = vi.fn();

        vi.doMock('fs', () => ({
            readFileSync: mockReadFileSync,
            writeFileSync: mockWriteFileSync,
        }));

        // Stub process.exit so yargs doesn't crash test
        mockExit = vi.fn();
        vi.stubGlobal('process', {
            ...process,
            exit: mockExit,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    it('reads input files and writes the output with shifted headings', async () => {
        const runCli = (await import('./markdown-util.js')).runCli;
        runCli();

        expect(mockExit).not.toHaveBeenCalled();
        expect(mockReadFileSync).toHaveBeenCalledTimes(2);
        expect(mockWriteFileSync).toHaveBeenCalledTimes(1);

        const outputContent = mockWriteFileSync.mock.calls[0][1];
        expect(outputContent).toContain('<!-- Source: file1.md -->');
        expect(outputContent).toContain('<!-- Source: file2.md -->');
        expect(outputContent).toContain('### File 2 Title');
    });
});
