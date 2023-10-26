import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Project } from "../models/Project";
import { RootState } from "../config/store";
import axios from "axios";

const DB_URL = "http://127.0.0.1:3000/projects";

export const getProjects = createAsyncThunk(
    "projects/getAll",
    async () => {
        const res = await axios.get<{ projects: Project[] }>(DB_URL);
        return res.data.projects;
    }
);

export const getOneProject = createAsyncThunk(
    "projects/getOne",
    async (id: string) => {
        const res = await axios.get<{ project: Project }>(`${DB_URL}/${id}`);
        return res.data.project;
    }
);

export const getRandomProject = createAsyncThunk(
    "projects/getRandom",
    async () => {
        const res = await axios.get<{ project: Project }>(`${DB_URL}/random`);
        return res.data.project;
    }
);

export const addProject = createAsyncThunk(
    "projects/post",
    async (project: Project) => {
        const res = await axios.post<{ project: Project }>(DB_URL, project);
        return res.data.project;
    }
);

export const editProject = createAsyncThunk(
    "projects/edit",
    async ({ project, id }: { project: Project, id: string }) => {
        const res = await axios.put<{ project: Project }>(`${DB_URL}/${id}`, project);
        return res.data.project;
    }
);

export const deleteProject = createAsyncThunk(
    "projects/delete",
    async (id: string) => {
        const res = await axios.delete<{ projects: Project[] }>(`${DB_URL}/${id}`);
        return res.data.projects;
    }
);

const initialState = {
    projects: [],
    selectedProject: null
} as {
    projects: Project[],
    selectedProject: Project | null
};

const projectSlice = createSlice({
    name: "projects",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
            state.projects = action.payload;
        }),
            builder.addCase(getProjects.rejected, (state, action) => {
                console.error(action.error);
            }),
            builder.addCase(getOneProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.selectedProject = action.payload;
            }),
            builder.addCase(getOneProject.rejected, (state, action) => {
                console.error(action.error);
            }),
            builder.addCase(getRandomProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.selectedProject = action.payload;
            }),
            builder.addCase(getRandomProject.rejected, (state, action) => {
                console.error(action.error);
            }),
            builder.addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.projects.push(action.payload);
            }),
            builder.addCase(addProject.rejected, (state, action) => {
                console.error(action.error);
            }),
            builder.addCase(editProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.projects.map((project: Project) => project.id === action.payload.id ? action.payload : project);
            }),
            builder.addCase(editProject.rejected, (state, action) => {
                console.error(action.error);
            }),
            builder.addCase(deleteProject.fulfilled, (state, action: PayloadAction<Project[]>) => {
                state.projects = action.payload;
            }),
            builder.addCase(deleteProject.rejected, (state, action) => {
                console.error(action.error);
            })
    }
});

export default projectSlice.reducer;
export const projectSelector = (state: RootState) => state.projects;