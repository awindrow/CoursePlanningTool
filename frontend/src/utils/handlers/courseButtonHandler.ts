// utils/handlers/courseHandler.ts
import {
    getCourseData,
    getCourses as apiFetchCourses,
    Course,
    deleteCourseRow,
    duplicateCourse,
} from "../../services/course/courseService";
import { previewSyllabus } from "../../services/TestServices/syllabusService";
import { Dispatch, SetStateAction } from "react";

export type ModalControls = {
    setVisible: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<"loading" | "success" | "error">>;
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
};

/**
 * Loads an existing course into localStorage, refreshes the list,
 * and navigates to the overview page.
 */
export const createEditHandler = (
    modal: ModalControls,
    setCourses: (courses: Course[]) => void,
    navigate: (path: string) => void
) => {
    return async (courseId: string) => {
        modal.setTitle("Loading Course");
        modal.setMessage(`Fetching data for course ${courseId}…`);
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            // 1) Clear stale data
            localStorage.removeItem("currentCourseData");
            localStorage.removeItem("currentCourseId");

            // 2) Fetch from backend
            const raw = await getCourseData(courseId);
            if (!raw.ok) throw new Error(`No data for course ${courseId}`);
            const data = raw.data;

            // 3) Build Course object
            const course: Course = {
                course_id: courseId,
                course_title_syllabus:    data["Course Title"]    || "",
                subj_code_syllabus:       data["Course Code"]     || "",
                crse_number_syllabus:     data["Course Number"]   || "",
                instructor_name_syllabus: data["Instructor Name"] || "",
                term_syllabus:            data["Semester"]        || "",
                year_syllabus:            data["Year"]            || "",
                last_edited:              data["Last Edited"]     || "",
                ...data,
            };

            // 4) Persist & refresh
            localStorage.setItem("currentCourseId", courseId);
            localStorage.setItem("currentCourseData", JSON.stringify(course));

            const all = await apiFetchCourses();
            setCourses(all.ok ? all.data : []);

            // 5) DONE → go to overview
            navigate("/overview");

            // 6) Feedback
            modal.setStatus("success");
            modal.setTitle("Course Loaded");
            modal.setMessage(`Routing to overview…`);
        } catch (err: any) {
            console.error("Edit handler failed:", err);
            modal.setStatus("error");
            modal.setTitle("Error Loading Course");
            modal.setMessage(err?.message || "Something went wrong.");
        } finally {
            setTimeout(() => modal.setVisible(false), 500);
        }
    };
};

export const createPreviewHandler = (
    modal: ModalControls,
    courseId: string,
    courseTitle: string
) => {
    return async () => {
        modal.setTitle("Generating Preview");
        modal.setMessage(`Downloading syllabus for "${courseTitle}"…`);
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            const prev = await previewSyllabus(courseId);
            if (!prev.ok) throw new Error("Empty preview response");

            const url = window.URL.createObjectURL(prev.data); // Blob
            const a = document.createElement("a");
            a.href = url;
            a.download = `syllabus_preview_${courseId}.docx`;
            a.click();
            window.URL.revokeObjectURL(url);

            modal.setStatus("success");
            modal.setTitle("Preview Ready!");
            modal.setMessage(`Downloaded "${courseTitle}".`);
        } catch (err: any) {
            console.error("Preview failed:", err);
            modal.setStatus("error");
            modal.setTitle("Preview Failed");
            modal.setMessage(err?.message || `Could not download "${courseTitle}".`);
        } finally {
            setTimeout(() => modal.setVisible(false), 1500);
        }
    };
};

export const createDeleteRowHandler = (
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (courseId: string) => {
        modal.setTitle("Deleting Course");
        modal.setMessage("Please wait while we remove the course…");
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            const res = await deleteCourseRow(courseId);
            if (!res.ok) throw new Error("Course could not be deleted");

            const updated = await apiFetchCourses();
            setCourses(updated.ok ? updated.data : []);

            modal.setStatus("success");
            modal.setTitle("Course Deleted");
            modal.setMessage(`Course ${courseId} has been removed.`);
        } catch (err: any) {
            console.error("Delete handler failed:", err);
            modal.setStatus("error");
            modal.setTitle("Deletion Failed");
            modal.setMessage(err?.message || "Something went wrong while deleting the course.");
        } finally {
            setTimeout(() => modal.setVisible(false), 1500);
        }
    };
};

export const createDuplicateRowHandler = (
    modal: ModalControls,
    setCourses: (courses: Course[]) => void
) => {
    return async (courseId: string) => {
        modal.setTitle("Duplicating Course");
        modal.setMessage("Please wait while we duplicate the course…");
        modal.setStatus("loading");
        modal.setVisible(true);

        try {
            const response = await duplicateCourse(courseId);
            if (!response.ok) throw new Error("Course could not be duplicated");

            // Normalize ID from backend payload
            const payload: any = response.data;
            const newId =
                payload?.course_id ??
                payload?.courseId ??
                payload?.courseID ??
                payload?.["courseId:"] ??
                null;

            if (!newId) throw new Error("Duplicate response missing course id");

            const updated = await apiFetchCourses();
            setCourses(updated.ok ? updated.data : []);

            modal.setStatus("success");
            modal.setTitle("Course Duplicated");
            modal.setMessage(`Course has been duplicated with ID: ${newId}`);
        } catch (err: any) {
            console.error("Duplicate handler failed:", err);
            modal.setStatus("error");
            modal.setTitle("Duplication Failed");
            modal.setMessage(err?.message || "Something went wrong while duplicating the course.");
        } finally {
            setTimeout(() => modal.setVisible(false), 1500);
        }
    };
};
