import React from "react";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import "./SyllabusFormField.css";

interface Props {
    field: SyllabusContent;
    value: string;
    onChange: (label: string, value: string) => void;
}

const SyllabusFormField: React.FC<Props> = ({ field, value, onChange }) => {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        onChange(field.content, e.target.value);
    };

    if (field.type === "alert") {
        return (
            <div className="syllabus-alert">
                ️ {field.content}
            </div>
        );
    }
    if(field.type  === 'select' && field.options) {
        return (
            <label>
                {field.content}
                <select
                value = {value}
                onChange={handleInputChange}
                required={field.required}
                >
                    <option value ="">Select</option>
                    {field.options.map((opt, i) => (
                        <option key = {i} value={opt}>{opt}</option>
                    ))}

                </select>
            </label>
        );
    }

    if (field.type === "text") {
        return <p className="syllabus-text">{field.content}</p>;
    }

    if (field.type === "text-box" || field.type === "syllabus-text") {
        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

        return (
            <div className="syllabus-field-container">
                {field.content && (
                    <label className="syllabus-label">{field.content}</label>
                )}

                {field.type === "syllabus-text" ? (
                    <div className="syllabus-green-wrapper">
                        <textarea
                            value={value}
                            onChange={handleInputChange}
                            required={field.required}
                        />
                    </div>
                ) : (
                    <>
        <textarea
            className="syllabus-textarea"
            value={value}
            onChange={handleInputChange}
            required={field.required}
        />
                    </>
                )}
                <p className="syllabus-wordcount">
                    Word Count: {wordCount} / 500 words max
                </p>

            </div>
        );
    }

    return (
        <div>
            <label>{field.content}</label>
        </div>
    );
};

export default SyllabusFormField;
