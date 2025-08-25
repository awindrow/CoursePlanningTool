// src/utils/handlers/formHandlersFactory.ts
import { saveToBackend, previewSyllabus } from "../../services/TestServices/syllabusService"; // these should now return ApiResult<void> / ApiResult<Blob>
import { jsonFieldsMapper } from "../jsonFieldsMapper";
import { createNewCourse } from "../../services/course/courseService"; // should return ApiResult<{ course_id: string }>

type ModalControls = {
    setVisible: (visible: boolean) => void;
    setStatus: (status: "loading" | "success") => void;
    setTitle: (title: string) => void;
    setMessage: (message: string) => void;
};

type FieldDef = { content: string; backendKey?: string; type: string };

const mapFields = (
    formData: Record<string, string>,
    fields?: FieldDef[]
): Record<string, string> => {
    if (!fields) return jsonFieldsMapper(formData);
    return fields.reduce((acc, field) => {
        if (
            (field.type === "text-box" || field.type === "syllabus-text") &&
            field.backendKey &&
            formData[field.content]
        ) {
            acc[field.backendKey] = formData[field.content];
        }
        return acc;
    }, {} as Record<string, string>);
};

const getSavedCourseId = (): string | undefined => {
    const saved = localStorage.getItem("currentCourseData");
    if (!saved) return;
    try {
        const savedData = JSON.parse(saved);
        return savedData?.course_id as string | undefined;
    } catch {
        console.warn("Invalid saved course data");
        return;
    }
};

export const createSaveHandler = (
    formData: Record<string, string>,
    modal: ModalControls,
    fields?: FieldDef[]
) => {
    return async () => {
        modal.setTitle("Saving Changes");
        modal.setMessage("Please wait while we save your progress...");
        modal.setStatus("loading");
        modal.setVisible(true);

        let mappedData = mapFields(formData, fields);
        let course_id = mappedData["course_id"] ?? getSavedCourseId();

        if (!course_id) {
            const res = await createNewCourse(mappedData);
            if (!res.ok) { modal.setVisible(false); return; }
            course_id = res.data.course_id;
        }

        mappedData = { ...mappedData, course_id };
        localStorage.setItem("currentCourseData", JSON.stringify({ ...mappedData }));

        const saveRes = await saveToBackend(course_id, mappedData);
        if (saveRes.ok) {
            modal.setStatus("success");
            modal.setTitle("Saved!");
            modal.setMessage("Your changes were saved successfully.");
            setTimeout(() => modal.setVisible(false), 1500);
        } else {
            modal.setVisible(false);
        }
    };
};

export const createSaveAndExitHandler = (
    formData: Record<string, string>,
    navigate: (path: string) => void,
    modal: ModalControls,
    fields?: FieldDef[]
) => {
    return async () => {
        modal.setTitle("Saving & Exiting");
        modal.setMessage("Hold on, we're saving and redirecting you...");
        modal.setStatus("loading");
        modal.setVisible(true);

        let mappedData = mapFields(formData, fields);
        let course_id = mappedData["course_id"] ?? getSavedCourseId();

        if (!course_id) {
            const res = await createNewCourse(mappedData);
            if (!res.ok) { modal.setVisible(false); return; }
            course_id = res.data.course_id;
            mappedData["course_id"] = course_id;
            localStorage.setItem("currentCourseData", JSON.stringify(mappedData));
        }

        const saveRes = await saveToBackend(course_id!, mappedData);
        if (saveRes.ok) {
            modal.setStatus("success");
            modal.setTitle("Saved & Exiting");
            modal.setMessage("Redirecting you to My Courses Home Page...");
            setTimeout(() => {
                modal.setVisible(false);
                navigate("/course-page");
            }, 1500);
        } else {
            modal.setVisible(false);
        }
    };
};

export const createPreviewHandler = (
    formData: Record<string, string>,
    modal: ModalControls,
    fields?: FieldDef[]
) => {
    return async () => {
        modal.setTitle("Generating Preview");
        modal.setMessage("Please wait while we generate your syllabus...");
        modal.setStatus("loading");
        modal.setVisible(true);

        let mappedData = mapFields(formData, fields);

        // inject saved course_id if present
        const savedId = getSavedCourseId();
        if (savedId) mappedData["course_id"] = savedId;

        let course_id = mappedData["course_id"];

        if (!course_id) {
            const res = await createNewCourse(mappedData);
            if (!res.ok) { modal.setVisible(false); return; }
            course_id = res.data.course_id;
            mappedData["course_id"] = course_id;
        }

        // Save latest data locally
        localStorage.setItem("currentCourseData", JSON.stringify(mappedData));

        // Save to backend first
        const saveRes = await saveToBackend(course_id!, mappedData);
        if (!saveRes.ok) { modal.setVisible(false); return; }

        // Then request preview blob
        const prevRes = await previewSyllabus(course_id!);
        if (prevRes.ok) {
            const url = window.URL.createObjectURL(prevRes.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "syllabus_preview.docx";
            a.click();
            window.URL.revokeObjectURL(url);

            modal.setStatus("success");
            modal.setTitle("Preview Ready!");
            modal.setMessage("Your preview has been downloaded.");
            setTimeout(() => modal.setVisible(false), 1500);
        } else {
            modal.setVisible(false);
        }
    };
};
