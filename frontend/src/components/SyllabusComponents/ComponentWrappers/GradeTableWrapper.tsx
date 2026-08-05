import React from "react";

<<<<<<< Updated upstream
import {parseStringPairArray} from "../../../utils/PageRenderEngine/typeGuards";
import {FormState, FormValue, GradeTableComponent} from "../../../utils/PageRenderEngine/types";
import GradeTable from "../Tables/gradeTable";
interface GradeTableProps {
    component: GradeTableComponent;
    formData?: FormState;
}


export const GradeTableWrapper: React.FC<GradeTableProps> = ({
    component,
    formData,
}) => {
    const gradeTableData =  parseStringPairArray(formData?.[component.id]);

    return (
        <GradeTable id={component.id} data = {gradeTableData} />
    );
}
=======
import {FormValue, GradeTableComponent} from "../../../utils/types";
import GradeTable from "../Tables/gradeTable";
interface GradeTableProps {
    component: GradeTableComponent;
    formData: FormValue;
}


export const GradeTableWrapper: React.FC<GradeTableProps> =({
    component,
    formData,
})

const isStringPairedArray = (value: unknown): value is [string, string][] => {}
retut
>>>>>>> Stashed changes
