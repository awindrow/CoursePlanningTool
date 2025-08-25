// utils/handlers/courseHandler.ts
import { jsonFieldsMapper } from "../jsonFieldsMapper";
import {
    createNewCourse,
    getCourseData,
    getCourses as apiFetchCourses,
    Course,
} from "../../services/course/courseService";
import { Dispatch, SetStateAction } from "react";

export type ModalControls = {
    setVisible: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<"loading" | "success" | "error">>;
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
};

export const createCourseHandler = (
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (formData: Record<string, string>) => {
        modal.setVisible(true);

        try {
            // 1) Create & get back the new ID
            const mapped = jsonFieldsMapper(formData);
            const createResult = await createNewCourse(mapped);
            if (!createResult.ok) {
                throw new Error("No course_id returned from createNewCourse");
            }
            const newId = createResult.data.course_id;

            // 2) Persist that ID
            localStorage.setItem("currentCourseId", newId);

            // 3) Fetch the new row
            const raw = await getCourseData(newId);
            if (!raw.ok) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }
            const data = raw.data; // Record<string, string>

            // 4) Build Course object
            const newCourse: Course = {
                course_id: newId,
                course_title_syllabus:    data["Course Title"]    || "",
                subj_code_syllabus:       data["Course Code"]     || "",
                crse_number_syllabus:     data["Course Number"]   || "",
                instructor_name_syllabus: data["Instructor Name"] || "",
                term_syllabus:            data["Semester"]        || "",
                year_syllabus:            data["Year"]            || "",
                last_edited:              data["Last Edited"]     || "",
                ...data,
            };

            // 5) Persist full data & refresh list
            localStorage.setItem("currentCourseData", JSON.stringify(newCourse));

            const all = await apiFetchCourses();
            setCourses(all.ok ? all.data : []);

            // 6) Success
            modal.setStatus("success");
            modal.setTitle("Course Created");
            modal.setMessage(`Course ${newId} created!`);
        } catch (err: any) {
            console.error("Course creation failed:", err);
            modal.setStatus("error");
            modal.setTitle("Error Creating Course");
            modal.setMessage(err?.message || "An unexpected error occurred.");
        } finally {
            setTimeout(() => modal.setVisible(false), 1500);
        }
    };
};
