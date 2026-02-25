import {Editor} from "@tinymce/tinymce-react";

interface FnEditorProps {
    value: string;
    onChange: (value: string) => void;
    name: string;
    error?: string;
    touched?: boolean;
}

type RespondWith = {
    string: (fn: () => Promise<string>) => void;
};

const FnEditorComponent: React.FC<FnEditorProps> =  ({value, onChange, name, error, touched}) => {
    const isError = touched && error;

    return(
        <>
            <Editor
                apiKey='892nspafb52wuvd4m7rcv2537rbrukv8lh9i1k1kxmhmzx71'
                value={value}
                tagName= {name}
                onEditorChange={(content) => onChange(content)}
                init={{
                    plugins: [
                        'autolink', 'searchreplace', 'visualblocks', 'wordcount',  'casechange', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'ai',  'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough |  spellcheckdialog a11ycheck typography | align lineheight | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    ai_request: (respondWith: RespondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                    uploadcare_public_key: '7f279604b8fd94d6b486',
                }}
                initialValue="Опис міста"
            />

            {isError && (<div className="invalid-feedback">{error}</div>)}
        </>

    );
}

export default FnEditorComponent;