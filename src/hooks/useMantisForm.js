import { useReducer, useEffect } from "react";

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
export const initialState = {
    mantis: "",
    tipoMantis: "",
    title: "",
    brief: "",
    output: "",
    components: [{ componente: "", version_dll: "", version_ascx: "" }],
    changes: [{ description: "", images: [] }],

    // Optional sections — each has an `enabled` toggle and a `value`
    sprint: { enabled: true, value: 37 },
    porque: { enabled: false, value: "" },
    como: { enabled: false, value: "" },
    impacto: { enabled: false, value: "" },
    templates: { enabled: false, value: "" },
    formatos: { enabled: false, value: "" },
    ticket: { enabled: false, value: "" },
    evidencias: { enabled: false, value: "" },
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function mantisReducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };

        case "TOGGLE_SECTION":
            return {
                ...state,
                [action.section]: {
                    ...state[action.section],
                    enabled: !state[action.section].enabled,
                },
            };

        case "SET_SECTION_VALUE":
            return {
                ...state,
                [action.section]: {
                    ...state[action.section],
                    value: action.value,
                },
            };

        case "UPDATE_COMPONENT": {
            const updated = [...state.components];
            updated[action.index] = {
                ...updated[action.index],
                [action.key]: action.value,
            };
            return { ...state, components: updated };
        }

        case "ADD_COMPONENT":
            return {
                ...state,
                components: [
                    ...state.components,
                    { componente: "", version_dll: "", version_ascx: "" },
                ],
            };

        case "RESET":
            return initialState;

        case "LOAD_SAVED":
            return { ...initialState, ...action.data };

        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Migration: supports old flat format saved in localStorage
// ---------------------------------------------------------------------------
function fromStoredData(raw) {
    // New format already has section objects
    if (raw.sprint && typeof raw.sprint === "object") return raw;

    // Migrate old flat format
    return {
        ...initialState,
        mantis: raw.mantis || "",
        tipoMantis: raw.tipoMantis || "",
        title: raw.title || "",
        brief: raw.brief || "",
        output: raw.output || "",
        components:
            raw.components?.length > 0
                ? raw.components
                : initialState.components,
        changes: (raw.changes || []).map((c) => ({
            ...c,
            images: Array.isArray(c.images)
                ? c.images
                : c.images
                  ? [c.images]
                  : [],
        })),
        sprint: { enabled: raw.usaSprint ?? true, value: raw.sprint ?? 37 },
        porque: { enabled: raw.usaPorque ?? false, value: raw.porque ?? "" },
        como: { enabled: raw.usaComo ?? false, value: raw.como ?? "" },
        impacto: { enabled: raw.usaImpacto ?? false, value: raw.impacto ?? "" },
        templates: {
            enabled: raw.usaTemplates ?? false,
            value: raw.templates ?? "",
        },
        formatos: {
            enabled: raw.usaFormatos ?? false,
            value: raw.formatos ?? "",
        },
        ticket: { enabled: raw.usaTicket ?? false, value: raw.ticket ?? "" },
        evidencias: {
            enabled: raw.usaEvidencias ?? false,
            value: raw.evidencias ?? "",
        },
    };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useMantisForm() {
    const [state, dispatch] = useReducer(mantisReducer, initialState);

    // Load persisted data on mount
    useEffect(() => {
        const saved = localStorage.getItem("fastMantisData");
        if (!saved) return;
        try {
            dispatch({
                type: "LOAD_SAVED",
                data: fromStoredData(JSON.parse(saved)),
            });
        } catch {
            // ignore corrupt localStorage data
        }
    }, []);

    // Action creators
    const setField = (field, value) =>
        dispatch({ type: "SET_FIELD", field, value });
    const toggleSection = (section) =>
        dispatch({ type: "TOGGLE_SECTION", section });
    const setSectionValue = (section, value) =>
        dispatch({ type: "SET_SECTION_VALUE", section, value });
    const updateComponent = (index, key, value) =>
        dispatch({ type: "UPDATE_COMPONENT", index, key, value });
    const addComponent = () => dispatch({ type: "ADD_COMPONENT" });
    const reset = () => dispatch({ type: "RESET" });

    const saveProgress = () => {
        localStorage.setItem("fastMantisData", JSON.stringify(state));
    };

    // Builds the normalized data object consumed by the generators and PDF
    const obtenerDatos = () => {
        const tipo = state.tipoMantis || "Tipo de Mantis";
        const commitTitle = state.sprint.enabled
            ? `${tipo} - Sprint: ${state.sprint.value}`
            : tipo;

        return {
            ...state,

            mantisEnabled: state.mantis.trim() !== "",
            mantis: state.mantis || "3XXXX",
            mantisUrl: `https://mantis.tca.com/assist/view.php?id=${state.mantis || "3XXXX"}`,
            title: state.title || "Título del Mantis",
            tipoMantis: tipo,
            brief: state.brief || "Descripción corta del cambio",
            commitTitle,

            componentes: state.components
                .filter((c) => c.componente.trim() !== "")
                .map((c) => ({
                    original: c,
                    componente: c.componente,
                    version_dll: "10.1." + c.version_dll,
                    version_ascx: "10.1." + c.version_ascx,
                    version: `DLL: 10.1.${c.version_dll || "X.X"}${c.version_ascx ? ", ASCX: 10.1." + c.version_ascx : ""}`,
                })),

            reglasNegocio: state.components
                .filter((c) => c.version_dll.trim() !== "")
                .map(
                    (c) =>
                        `- ${c.componente}.dll (Versión: 10.1.${c.version_dll})`,
                )
                .join("\n"),

            vistas: state.components
                .filter((c) => c.version_ascx.trim() !== "")
                .map(
                    (c) =>
                        `- ${c.componente}.ascx (Versión: 10.1.${c.version_ascx})`,
                )
                .join("\n"),
            
            cambios:
                state.changes
                    .filter((c) => c.description.trim())
                    .map((c) => `- ${c.description}`)
                    .join("\n") || "- Descripción detallada del cambio realizado en el código.",
        };
    };

    return {
        state,
        // Field actions
        setField,
        toggleSection,
        setSectionValue,
        updateComponent,
        addComponent,
        reset,
        // Persistence
        saveProgress,
        // Derived data
        obtenerDatos,
    };
}
