import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { State, useStore } from '../store/store';
// import defaultMapText from './maps/default?raw';

export const Mapping = () => {
    const monacoEl = useRef(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const mapping = useStore((state: State) => state.mapping);
    const setMapping = useStore((state: State) => state.setMapping);
    useEffect(() => {
        if (monacoEl.current) {
            const editorInstance = monaco.editor.create(monacoEl.current!, {
                theme: 'vs-dark',
                value: mapping,
                language: 'typescript',
            });
            editorInstance.onEndUpdate(() => {
                const content = editorInstance.getValue();
                console.log('onEndUpdate', {
                    editorInstance,
                    content,
                });
                setMapping?.(content);
            });
            editorRef.current = editorInstance;
        }
        return () => editorRef.current?.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setMapping]);

    useEffect(() => {
        const current = editorRef.current;
        if (current && mapping !== current.getValue()) {
            current.setValue(mapping || '');
        }
    }, [mapping]);

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
