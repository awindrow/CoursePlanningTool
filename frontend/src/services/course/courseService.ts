import {ApiResult, createApiCaller} from "../../utils/apiFactory";
import {SHEET_COLUMNS} from "../../utils/handlers/sheetColumns";

export interface Course {
    course_id: string;
    course_title_syllabus: string;
    subj_code_syllabus: string;
    crse_number_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    year_syllabus: string;
    last_edited: string;
    [key: string]: string;
}

/**
 * Fetches a new course_id for the given user.
 */
export const getNewCourseId = (
    userId: string
): Promise<ApiResult<{ course_id: string }>> => {
    return createApiCaller<{ course_id: string }>({
        url: "getNewCourseId/",
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        data: { user: userId },
    })();
};

/**
 * Updates (or creates) the values for a given course_id.
 */
export const updateCourseValues = (
    course_id: string,
    values: Record<string, string>
): Promise<ApiResult<void>> => {
    return createApiCaller<void>({
        url: "updateValue/",
        method: "POST",
        withCredentials: true,
        data: {
            course_id,
            dict_of_columns_and_vals: values,
        },
    })();
};

/**
 * Loads all courses for the current user.
 */
export const getCourses = async (): Promise<ApiResult<Course[]>> => {
    const res = await createApiCaller<Record<string, Record<string, string>>>({
        url: "getSheet/",
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        data: {}, // empty body for POST
    })();
    if (!res.ok) return res;

    const list: Course[] = Object.entries(res.data).map(([course_id, courseData]) => ({
        course_id,
        course_title_syllabus: courseData["Course Title"] || "",
        subj_code_syllabus: courseData["Course Code"] || "",
        crse_number_syllabus: courseData["Course Number"] || "",
        instructor_name_syllabus: courseData["Instructor Name"] || "",
        term_syllabus: courseData["Semester"] || "",
        year_syllabus: courseData["Year"] || "",
        last_edited: courseData["Last Edited"] || "",
        ...courseData,
    }));

    return { ok: true, data: list };
};

/**
 * Fetches the full data object for a single course row.
 */
export const getCourseData = (
    course_id: string
): Promise<ApiResult<Record<string, string>>> => {
    return createApiCaller<Record<string, string>>({
        url: "getValue/",
        method: "POST",
        data: {
            course_id,
            list_of_columns: SHEET_COLUMNS,
        },
    })();
};


/**
 * (Alternative path) Creates a new course row and returns its ID.
 * If you end up switching to this on the backend, you can call it instead of getNewCourseId.
 */

export interface CreateCourseResponse {
    course_id: string;
}

export interface CreateCourseResponse {
    course_id: string;
}

export const createNewCourse = async (
    data: Record<string, string>
): Promise<ApiResult<CreateCourseResponse>> => {
    const res = await createApiCaller<any>({
        url: "createNewCourse/",
        method: "POST",
        data: { dict_of_columns_and_vals: data },
    })();
    if (!res.ok) return res;

    const id =
        res.data?.course_id ??
        res.data?.courseId ??
        res.data?.courseID ??
        null;

    return id ? { ok: true, data: { course_id: id } } : { ok: false };
};

export const deleteCourseRow = (
    course_id: string
): Promise<ApiResult<{ course_id: string }>> => {
    return createApiCaller<{ course_id: string }>({
        url: "deleteCourse/",
        method: "POST",
        data: { course_id },
    })();
};

export const duplicateCourse = (
    course_id: string
): Promise<ApiResult<{ course_id: string }>> => {
    return createApiCaller<{ course_id: string }>({
        url: "duplicateCourse/",
        method: "POST",
        data: { course_id },
    })();
};