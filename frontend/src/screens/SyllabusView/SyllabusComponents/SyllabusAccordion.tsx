import React from "react";
import SyllabusFormRow from "./SyllabusFormRow";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import { FaAngleUp } from "react-icons/fa";
import "./SyllabusAccordion.css";
import SafeIcon from "../../../utils/ComponentWrapper";

interface Props {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const SyllabusSectionAccordion: React.FC<Props> = ({
                                                       sectionName,
                                                       fields,
                                                       formData,
                                                       onFieldChange
                                                   }) => {

    const groupedRows = fields.reduce((acc, field) => {
        const rowKey = `${field.row}-${field.layoutRow || '0'}`; // Unique row key
        if (!acc[rowKey]) acc[rowKey] = [];
        acc[rowKey].push(field);                                 // Add the field to its row group
        return acc;
    }, {} as Record<string, SyllabusContent[]>);


    return (
        <div className="syllabus-section-accordion">
            <details open>

                <summary className="syllabus-section-header">

                    <span className="syllabus-section-title">{sectionName}</span>

                    <SafeIcon Icon ={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                {/* Content of the accordion section */}
                <div className="syllabus-content">
                    {Object.entries (groupedRows).map(([rowKey,rowFields]) => (
                        <div key = {rowKey} className="form-row">

                            {rowFields
                                .filter((field) => {
                                const isConditional = field.row === 1 && field.layoutRow === 3;
                                const valueTrigger = formData["Additional Meeting IMes"] || "";
                                return !isConditional || valueTrigger.includes("Yes");
                            })
                                .map((field, index) => (
                                    <SyllabusFormRow
                                        key = {index}
                                        field = {field}
                                        value ={formData[field.content] || ''}
                                        onChange = {onFieldChange}
                                        className = {
                                            field.content.includes('Additional Information')
                                                ? 'full-width'
                                                : ''
                                    }
                                />
                                ))}

                        </div>
                    ))}'
                </div>
            </details>
        </div>
    );
};

export default SyllabusSectionAccordion;
