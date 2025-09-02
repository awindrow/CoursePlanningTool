import React from "react";
import SyllabusFormField from "./SyllabusFormField";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import {generateRowIdentifiers} from "../../../utils/generateRowIdentifiers";;
interface Props {
    field: SyllabusContent;
    value: string;
    onChange: (name: string, value: string) => void;
    className?: string;
}

const SyllabusFormRow: React.FC<Props> = ({ field, value, onChange, className }) => {
    const rowIdentifier = generateRowIdentifiers(field.content);

    return (
        <div className={`syllabus-form-row`}>
            <SyllabusFormField field={field} value={value} onChange={onChange} />
        </div>
    );
};

export default SyllabusFormRow;
