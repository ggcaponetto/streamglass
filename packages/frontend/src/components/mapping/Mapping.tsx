import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const Mapping = () => {
    const monacoEl = useRef(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    useEffect(() => {
        if (monacoEl.current) {
            const editorInstance = monaco.editor.create(monacoEl.current!, {
                theme: 'vs-dark',
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}',
                ].join('\n'),
                language: 'typescript',
            });
            editorRef.current = editorInstance;
        }
        return () => editorRef.current?.dispose();
    }, []);

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
            }}
            ref={monacoEl}
        ></div>
    );
};
