import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import defaultMapText from './maps/default?raw';

export const Mapping = () => {
    const monacoEl = useRef(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    useEffect(() => {
        if (monacoEl.current) {
            const editorInstance = monaco.editor.create(monacoEl.current!, {
                theme: 'vs-dark',
                value: [defaultMapText].join('\n'),
                language: 'typescript',
            });
            editorInstance.onEndUpdate(() => {
                const content = editorInstance.getValue();
                console.log('onEndUpdate', {
                    editorInstance,
                    content,
                });
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
